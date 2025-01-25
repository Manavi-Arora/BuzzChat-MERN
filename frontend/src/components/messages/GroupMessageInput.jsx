import { SendHorizontal, Image, X } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useRef } from "react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendGroupMessage,selectedGroup } = useGroupStore();
  const { authUser } = useAuthStore(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
  
    try {
     
  
      if (!selectedGroup._id || !authUser._id) {
        console.error("Group ID or User ID is missing");
        return;
      }
  
      // Send the message
      await sendGroupMessage(selectedGroup._id, authUser._id, text.trim(), imagePreview);
  
      // Clear the form after sending the message
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";  // Clear the file input
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg border border-zinc-700 ml-4"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}


      <form className="px-4 my-3" onSubmit={handleSendMessage}>
        <div className="w-full relative flex-1 flex gap-3 justify-between">
          <input
            type="text"
            className="text-sm rounded-lg block w-2/3 p-2.5 bg-[#383838] outline-none md:w-full"
            placeholder="Send a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-36 sm:right-32 md:right-16 inset-y-0"
            disabled={!text.trim() && !imagePreview}
          >
            <SendHorizontal color="#6c63ff" />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle gap-2 bg-[#383838]
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>


        </div>
      </form>
    </div>
  );
};

export default MessageInput;
