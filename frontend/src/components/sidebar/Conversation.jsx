import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const Conversation = (props) => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const {onlineUsers} = useAuthStore();
  const classIsOnline = onlineUsers.includes(props.user._id)?"online": "";
  const isSelected = selectedUser &&selectedUser._id === props.user._id
  const classHover = !isSelected ? "hover:bg-yellow-200" : "";
    return (
      <>
        <div className={`flex gap-2 items-center ${classHover} rounded p-2 py-1 cursor-pointer ${isSelected?"bg-yellow-300":""}`}
        onClick={()=>setSelectedUser(props.user)}>
          <div className={`avatar ${classIsOnline}`}>
            <div className='w-12 rounded-full'>
              <img
                src={props.user.profilePic ? props.user.profilePic : "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"}
                alt='user avatar'
              />
            </div>
          </div>
  
          <div className='flex flex-col flex-1'>
            <div className='flex gap-3 justify-between'>
              <p className='font-bold text-black'>{props.user.fullName}</p>
              <span className='text-xl'>{props.emoji}</span>
            </div>
          </div>
        </div>
  
        {!props.lastIdx &&<div className='divider my-0 py-0 h-1' />}
      </>
    );
  };
  
  export default Conversation;
  