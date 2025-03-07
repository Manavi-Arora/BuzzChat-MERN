import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    profilePic:{
      type: String,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Refers to the User model
        required: true,
      },
    ],
    
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;
