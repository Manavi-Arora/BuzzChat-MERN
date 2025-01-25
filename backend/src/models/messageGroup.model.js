
import mongoose from "mongoose";

const messageGroupSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",  // Reference to the Group model
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model (sender)
      required: true,
    },
    receiverIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // References to User model (group members)
        required: true,
      },
    ],
    text: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reaction:{
      type: String,
    }
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt
  }
);

const MessageGroup = mongoose.model("MessageGroup", messageGroupSchema);
export default MessageGroup;
