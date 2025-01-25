import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import MessageGroup from "../models/messageGroup.model.js";
import cloudinary from "../lib/cloudinary.js";


export const createGroup = async (req, res) => {
  const { name, description, members } = req.body;
  const creatorId = req.user._id;
  if (!members || members.length === 0) {
    return res
      .status(400)
      .json({ message: "Group must have at least one member." });
  }
  if (!members.includes(creatorId)) {
    members.push(creatorId);
  }

  try {
    const newGroup = new Group({
      name,
      description,
      members,
    });

    await newGroup.save();

    for (const memberId of members) {
      await User.findByIdAndUpdate(memberId, {
        $push: { groups: newGroup._id },
      });
    }

    return res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating group", error });
  }
};

export const fetchUserGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("groups");
    return res.status(200).json({ groups: user.groups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching groups" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find all messages for the group
    const messages = await MessageGroup.find({ groupId })
      .populate({
        path: "senderId", // Populate sender info
        select: "fullName profilePic", // Only select necessary fields
      })
      .populate({
        path: "receiverIds", // Populate receiver info (if necessary, can be omitted if not needed in the response)
        select: "fullName profilePic",
      })
      .sort({ createdAt: 1 }); // Sort by the time the message was created (ascending order)

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages in this group" });
    }

    return res.status(200).json(messages); // Return the fetched messages
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { senderId, text, image } = req.body; // Now we accept both text and image

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    //console.log(senderId, text, image );

    // Get all members of the group (excluding the sender)
    const groupMembers = group.members.filter(
      (memberId) => memberId.toString() !== senderId.toString()
    );

    if (groupMembers.length === 0) {
      return res.status(400).json({
        message: "Group must have at least one member other than the sender.",
      });
    }

    // Create a new group message for each member
    let newMessageGroup;
    if (text) {
      newMessageGroup = new MessageGroup({
        groupId,
        senderId,
        receiverIds: groupMembers, // Send to all other members of the group
        text,
      });
    } else if (image) {
      newMessageGroup = new MessageGroup({
        groupId,
        senderId,
        receiverIds: groupMembers, // Send to all other members of the group
        image,
      });
    } else {
      return res.status(400).json({
        message: "Message must contain either text or an image.",
      });
    }

    // Save the message group to the database
    await newMessageGroup.save();

    // Return the newly created message group
    return res.status(201).json(newMessageGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateGroupReaction = async (req, res) => {
  try {
    const { messageId } = req.params;  // Extract messageId from URL
    const { reaction } = req.body;  // Extract reaction from the request body

    if (!reaction) {
      return res.status(400).json({ message: "User Reaction is required" });
    }

    // Find the group message by its ID and update the reaction field
    const updatedMessage = await MessageGroup.findByIdAndUpdate(
      messageId,  // Find message by ID
      { reaction: reaction },  // Set the reaction field
      { new: true }  // Return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(updatedMessage);  // Return the updated message
  } catch (error) {
    console.log("Error in updateReaction controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateGroupProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const groupId = req.params.groupId;  // Assuming groupId is passed in the URL

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload the profile picture to cloudinary (or your preferred cloud service)
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    // Update the group's profile picture
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { profilePic: uploadResponse.secure_url },  // Save the URL from cloudinary
      { new: true }
    );

    res.status(200).json(updatedGroup);  // Return the updated group data
  } catch (error) {
    console.log("Error in updating group profile pic:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateGroupDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const groupId = req.params.groupId;  // Assuming groupId is passed in the URL

    if (!description) {
      return res.status(400).json({ message: "Group description is required" });
    }

    // Update the group's description
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { description: description },
      { new: true }
    );

    res.status(200).json(updatedGroup);  // Return the updated group data
  } catch (error) {
    console.log("Error in updating group description:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupWithMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Find the group by its ID and populate members with their fullName and profilePic
    const group = await Group.findById(groupId)
      .populate('members', 'fullName profilePic'); // Populate members with fullName and profilePic

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group); // Send the group details along with populated members
  } catch (error) {
    console.log("Error in retrieving group with members:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


