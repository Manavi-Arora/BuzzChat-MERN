import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateBio = async (req, res) => {
  try {
    const { userBio } = req.body;
    const userId = req.user._id;

    if (!userBio) {
      return res.status(400).json({ message: "User Bio is required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userBio: userBio },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update bio:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateFriends = async (req, res) => {
  const { friendId, action } = req.body;  // Get friendId and action (add/remove) from request body

  if (!friendId || !action) {
    return res.status(400).json({ message: "Friend ID and action are required" });
  }

  if (action !== "add" && action !== "remove") {
    return res.status(400).json({ message: "Invalid action. Use 'add' or 'remove'" });
  }

  try {
    const user = await User.findById(req.user._id); // Get current user from JWT (protected route)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findById(friendId);  // Get the friend by friendId
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (action === "add") {
      // Check if the user is already friends with the given friendId
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "User is already your friend" });
      }
      if (friend.friends.includes(user._id)) {
        return res.status(400).json({ message: "Already mutual friends" });
      }

      // Add friend to both user's friends list
      user.friends.push(friendId); // Add friend to current user's friends list
      friend.friends.push(user._id); // Add current user to friend's friends list

      // Save both user and friend documents after adding the friend
      await user.save();
      await friend.save();

    } else if (action === "remove") {
      // Check if the user is already friends with the given friendId
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "User is not your friend" });
      }
      if (!friend.friends.includes(user._id)) {
        return res.status(400).json({ message: "Friend is not your friend" });
      }

      // Remove friend from both user's friends list using MongoDB's $pull operator
      await User.updateOne(
        { _id: user._id },
        { $pull: { friends: friendId } }
      );

      await User.updateOne(
        { _id: friendId },
        { $pull: { friends: user._id } }
      );
    }

    res.status(200).json({ message: "Friends updated successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Get current user from JWT (protected route)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the friends' details by their user IDs
    const friends = await User.find({ '_id': { $in: user.friends } });

    res.status(200).json(friends); // Send friends data as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};