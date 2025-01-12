import { SendHorizontal } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const {sendMessage} = useChatStore();
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!message) return;
    await sendMessage({text : message});
    setMessage("");
  }
  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <SendHorizontal color="#fbbf24" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
