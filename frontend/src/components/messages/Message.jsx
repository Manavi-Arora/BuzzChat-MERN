import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useState } from "react";

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

  const bubbleBgColor = fromMe ? "bg-[rgb(46,52,61)] text-light" : "bg-[#6c63ff]";

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
    if(reaction == " "){
      setReaction(null);
    }
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
        <div className="chat-bubble flex flex-col items-end">
          <img
            src={message.image}
            className={`text-white ${bubbleBgColor} px-0 py-1 max-w-[200px] sm:max-w-[400px]`}
          />
          <div className="text-xs text-gray-300">
            {formattedTime}
          </div>
        </div>
      )}

      {message.text && (
        <div className={`chat-bubble text-white ${bubbleBgColor} flex justify-center items-center pr-3 gap-6`}>
          {message.text}
          <span className={`${fromMe ? "text-gray-300" : "text-white" } text-xs`}>
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
  );
};

export default Message;
