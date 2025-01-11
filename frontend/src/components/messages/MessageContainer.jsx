import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { MessagesSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";

const NoChatSelected = () => {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-black font-semibold flex flex-col items-center gap-2'>
				<p>Welcome to BuzzChat!🌻</p>
				<p>Select a chat to start messaging...</p>
        <MessagesSquare size={48} color="black" className='text-3xl md:text-6xl text-center'/>
			</div>
		</div>
	);
};

const MessageContainer = () => {
  const {selectedUser,setSelectedUser} = useChatStore();

  useEffect(()=>{
	return ()=>{
		setSelectedUser(null);
	}
  },[setSelectedUser])
  
  if (!selectedUser) return <NoChatSelected/>;
  else return (
    <div className='md:min-w-[450px] flex flex-col w-full'>
					<div className='bg-slate-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>{selectedUser.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
    </div>
  );
};

export default MessageContainer;
