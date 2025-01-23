import User from "../models/user.model.js";
import Group from "../models/group.model.js";

export const createGroup = async (req, res) => {
  const { name, description, members } = req.body;

  if (!members || members.length === 0) {
    return res.status(400).json({ message: "Group must have at least one member." });
  }

  try {
    const newGroup = new Group({
      name,
      description,
      members,
    });

    await newGroup.save();

    for (const memberId of members) {
      await User.findByIdAndUpdate(memberId, { $push: { groups: newGroup._id } });
    }

    return res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating group", error });
  }
};

export const fetchUserGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('groups');
    return res.status(200).json({ groups: user.groups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching groups" });
  }
};
