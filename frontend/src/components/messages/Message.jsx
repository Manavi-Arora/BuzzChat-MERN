import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useState } from "react";
import { ThumbsUp, Heart } from "lucide-react"; // For reaction icons (feel free to add more)

const Message = ({ message }) => {
  const { authUser } = useAuthStore();
  const { selectedUser, selectedMessage, setSelectedMessage, updateReaction } = useChatStore();
  const [reaction, setReaction] = useState(null);

  const fromMe = message.senderId === authUser?._id;

  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic || "avatar.jpg"
    : selectedUser?.profilePic || "avatar.jpg";

  const bubbleBgColor = fromMe ? "bg-black-500 text-light" : "bg-yellow-400";

  function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
  }

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  // Function to handle reaction click
  const handleReactionClick = async (reaction) => {
    setReaction(reaction); // Update the reaction state locally for immediate feedback
    await updateReaction({ reaction }); // Call the action to update the reaction in the store and database
    setSelectedMessage(null);
  };

  // Handle message selection
  const handleMessageSelect = () => {
    setSelectedMessage(message); // Set the selected message in the store
  };

  return (
    <div className={`chat ${chatClassName}`} onClick={handleMessageSelect}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={profilePic}
          />
        </div>
      </div>

      {message.image && (
        <img
          src={message.image}
          className={`chat-bubble text-white ${bubbleBgColor} p-2 max-w-[200px] sm:max-w-[400px]`}
        />
      )}

      {message.text && (
        <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
          {message.text}
        </div>
      )}
      <div className="chat-footer text-md gap-1 flex items-center text-black">
        <span>{formattedTime}</span>
        {message.reaction && <span className=" text-xl">{message.reaction}</span>}
      </div>


      {/* If selected, show the reaction options */}
      {!fromMe && selectedMessage && selectedMessage?._id === message._id && (
        <div className="chat-header">
          {/* Reaction Options - display only if message is selected */}
          <div className="flex gap-1 text-xl">
            <button
              onClick={() => handleReactionClick("👍🏻")}
              className="text-xl"
            >
              👍🏻
            </button>
            <button
              onClick={() => handleReactionClick("❤️")}
              className="text-xl"
            >
              ❤️
            </button>

            <button
              onClick={() => handleReactionClick("👎🏻")}
              className="text-xl"
            >
              👎🏻
            </button>
            <button
              onClick={() => handleReactionClick("😊")}
              className="text-xl"
            >
              😊
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Message;
