import { useChatStore } from "../../store/useChatStore";

const Conversation = (props) => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const isSelected = selectedUser &&selectedUser._id === props.user._id
    return (
      <>
        <div className={`flex gap-2 items-center hover:bg-yellow-200 rounded p-2 py-1 cursor-pointer ${isSelected?"bg-yellow-300":""}`}
        onClick={()=>setSelectedUser(props.user)}>
          <div className='avatar online'>
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
  