import { useAuthStore } from "../../store/useAuthStore";
import { useState, useEffect } from "react";
import { useGroupStore } from "../../store/useGroupStore";
import { useChatStore } from "../../store/useChatStore";

const Message = ({ message }) => {

  const { authUser } = useAuthStore();  // Current logged-in user
  const { selectedMessage,setSelectedMessage,updateReaction } = useGroupStore();  // Group messages

  const [reaction, setReaction] = useState(null);
  const fromMe = message.senderId._id === authUser?._id;  // Check if the message is from the current user

  function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
  }
  const handleReactionClick = async (reaction) => {
    if(reaction == " "){
      setReaction(null);
    }
    setReaction(reaction); // Update the reaction state locally for immediate feedback
    await updateReaction({ reaction }); // Call the action to update the reaction in the store and database
    setSelectedMessage(null);
  };
  const bubbleBgColor = fromMe ? "bg-[rgb(46,52,61)] text-light" : "bg-[#6c63ff]";

  // Handle message selection
  const handleMessageSelect = () => {
    setSelectedMessage(message); // Set the selected message in the store
  };

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  const formattedTime = extractTime(message.createdAt);  // Extract the time from message
  const chatClassName = fromMe ? "chat-end" : "chat-start";  // Message alignment based on sender

  // Helper function to format the message time

  // Extract sender details (fullName, profilePic)
  const senderName = fromMe ? 'You' : message.senderId.fullName || "Unknown Sender";
  const profilePic = fromMe
    ? authUser.profilePic || "avatar.jpg"
    : message.senderId.profilePic || "avatar.jpg";

  return (
    <div className={`chat ${chatClassName}`} onClick={handleMessageSelect}>
      
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          
          <img
            src={profilePic}
            alt={`${senderName}'s profile`}
          />
        </div>
      </div>

      {message.image && (
        <div className={`chat-bubble flex flex-col items-end p-2 ${bubbleBgColor}`}>
          <div className="font-semibold font-sans text-white">{senderName}</div>
          <img
            src={message.image}
            className={`text-white ${bubbleBgColor} max-w-[200px] sm:max-w-[400px]`}
          />
          <div className="text-xs text-gray-300">
            {formattedTime}
          </div>
        </div>
      )}

      {message.text && (
        <div className={`chat-bubble text-white ${bubbleBgColor} flex justify-center items-end pr-3 gap-6`}>
          <div className="flex flex-col">
            <div className="font-semibold font-sans text-white">{senderName}</div>
            {message.text}
          </div>
          <span className={`${fromMe ? "text-gray-300" : "text-white"} text-xs`}>
            {formattedTime}
          </span>
        </div>
      )}

      <div className="chat-footer text-md gap-1 flex items-center text-black pt-1">
        {/* Flex container for the time and reaction */}

        <div className={`flex items-center`}>
          {/* Display reaction at the start */}
          {message.reaction && (
            <span className="text-xl border border-gray-500 rounded-full">
              {message.reaction}
            </span>
          )}
        </div>
      </div>




      {/* If selected, show the reaction options */}
      {!fromMe && selectedMessage && selectedMessage?._id === message._id && (
        <div className="chat-header ">
          {/* Reaction Options - display only if message is selected */}
          <div className="flex gap-0.5 text-xl">
            <button
              onClick={() => handleReactionClick("👍🏻")}
              className="text-xl border border-gray-400 rounded-full"
            >
              👍🏻
            </button>
            <button
              onClick={() => handleReactionClick("❤️")}
              className="text-xl border border-gray-400 rounded-full"
            >
              ❤️
            </button>

            <button
              onClick={() => handleReactionClick("👎🏻")}
              className="text-xl border border-gray-400 rounded-full"
            >
              👎🏻
            </button>
            <button
              onClick={() => handleReactionClick("😊")}
              className="text-xl border border-gray-400 rounded-full"
            >
              😊
            </button>

            <button
              onClick={() => handleReactionClick(" ")}
              className="text-xl border border-gray-400 rounded-full"
            >
              ❌
            </button>

          </div>

        </div>
      )}
    </div>

  )
};

export default Message;
