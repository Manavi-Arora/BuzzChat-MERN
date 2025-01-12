import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";


const Message = ({ message }) => {
    const {authUser} = useAuthStore();
    const { selectedUser } = useChatStore();
    const fromMe = message.senderId === authUser?._id;

    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe
  ? authUser.profilePic || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
  : selectedUser?.profilePic || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg";

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
    return (
            <div className={`chat ${chatClassName}`}>
                <div className='chat-image avatar'>
                    <div className='w-10 rounded-full'>
                        <img alt='Tailwind CSS chat bubble component' src={profilePic} />
                    </div>
                </div>
                <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>{message.text}</div>
                <div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-black'>{formattedTime}</div>
            </div>
    );
};
export default Message;