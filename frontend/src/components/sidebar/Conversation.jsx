import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useGroupStore } from "../../store/useGroupStore";

const Conversation = (props) => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const {setSelectedGroup} = useGroupStore();
  const {onlineUsers} = useAuthStore();
  const classIsOnline = onlineUsers.includes(props.user._id)?"online": "";
  const isSelected = selectedUser &&selectedUser._id === props.user._id
  const classHover = !isSelected ? "hover:bg-[#383838]" : "";
    return (
      <>
        <div className={`flex gap-2 items-center ${classHover} rounded p-2 py-1 cursor-pointer ${isSelected?"bg-[#454545]":""} `}
        onClick={()=>{setSelectedUser(props.user);setSelectedGroup(null);}}>
          <div className={`avatar ${classIsOnline}`}>
            <div className='w-12 rounded-full'>
              <img
                src={props.user.profilePic ? props.user.profilePic : "avatar.jpg"}
                alt='user avatar'
              />
            </div>
          </div>
  
          <div className='flex flex-col flex-1 '>
            <div className='flex gap-3 justify-between'>
              <p className='md:font-semibold text-light hidden sm:block'>{props.user.fullName}</p>
              <span className='text-xl hidden sm:block'>{props.emoji}</span>
            </div>
          </div>
        </div>
  
        {/* {!props.lastIdx &&<div className='divider my-0 py-0 h-1' />} */}
      </>
    );
  };
  
  export default Conversation;
  