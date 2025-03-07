import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import {OAuth2Client} from "google-auth-library";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { createRequire } from "module"; // Import createRequire
const require = createRequire(import.meta.url); // Create a CommonJS require function
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

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

export const updateStatus = async (req, res) => {
  const { statusImage } = req.body;  // Assuming the user sends a URL or base64 image string
  const userId = req.user._id;
  
  try {
    if (!statusImage) {
      return res.status(400).json({ message: "Status image is required" });
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(statusImage);

    // Get the current timestamp
    const currentTimestamp = new Date();

    // Update the user's status with the URL of the uploaded image and the statusUpdatedAt timestamp
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        status: uploadResponse.secure_url,
        statusUpdatedAt: currentTimestamp, // Store the time when the status was updated
      },
      { new: true }
    );
    io.emit('statusUpdated', updatedUser);
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in updateStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchAuthUserStatus = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request (based on token or session)
    const userId = req.user._id;

    // Find the user from the database and return the status information
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's status along with any other necessary information
    res.status(200).json({
      status: user.status,
      profilePic: user.profilePic, // You can include other details as needed
      statusUpdatedAt: user.statusUpdatedAt,
    });

  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchUsersWithStatus = async (req, res) => {
  try {
    // Fetch users with their status image URL (only those with a valid status URL)
    const users = await User.find({
      status: { $ne: "", $exists: true }, // Ensure status is not an empty string and exists
    }).select("fullName email profilePic status");

    // Map through users and determine if their status is expired
    const usersWithStatus = users.map((user) => {
      // Check if the status is expired (you can customize this condition)
      const statusExpired = !user.status || user.status === ""; // Basic check for expired status
      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status,
        statusExpired, // Add the expired status flag
      };
    });
    io.emit('usersWithStatus', usersWithStatus); 
    res.status(200).json(usersWithStatus); // Return the filtered users with status
  } catch (error) {
    console.log("Error in fetchUsersWithStatus:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const googleLogin= async (req,res)=>{
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const {id_token} = req.body
  try {
      const ticket = await client.verifyIdToken({
          idToken: id_token,
          audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload()

      const {sub,email,name} = payload

      const user = await User.findOne({email})

      if(user)
      {
          generateToken(user._id,res)
          return res.status(200).json({
              _id:user._id,
              fullName: user.fullName,
              email: user.email,
              profilePicture : user.profilePicture,
              createdAt:user.createdAt
          })
      }

      const newUser = new User({
          fullName:name,
          email,
          password: sub
      })

      if(newUser)
      {
          generateToken(newUser._id,res)
          await newUser.save()

          
          res.status(201).json({
              _id:newUser._id,
              fullName: newUser.fullName,
              email: newUser.email,
              profilePicture : newUser.profilePicture,
              createdAt:newUser.createdAt
          })
      }
      else{
          res.status(400).send({ message : "Invalid User Data" })
      }
  } catch (error) {
      console.log("Error in googleLogin controller", error.message)
      res.status(500).json({ messaage: "Internal Server Error"})
  }
}

export const tokenGenerateVideoCall = async (req, res) => {
  const { channelName, uid,userToCallToId } = req.body;
  const socketId=getReceiverSocketId(userToCallToId)
  console.log(userToCallToId,socketId);
  if (!channelName) {
    return res.status(400).json({ error: "Channel name is required" });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // Token valid for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channelName,
    uid || 0, // Use 0 for dynamic UID assignment
    role,
    privilegeExpiredTs
  );

  io.to(socketId).emit("videoCall",{channelName,token})

  res.json({ token });
}

