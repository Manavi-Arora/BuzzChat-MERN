import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import Message from "./Message";
import MessageSkeleton from "./MessageSkeleton";


const Messages = () => {
  const {getMessages,selectedUser,messages,isMessagesLoading,subscribeToMessages,unsubscribeFromMessages} = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return ()=> unsubscribeFromMessages();
  }, [selectedUser, getMessages,subscribeToMessages,unsubscribeFromMessages]);

  const lastMessageRef = useRef();
  useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]); 
  return (
    <div className='px-4 flex-1 overflow-auto '>
      {!isMessagesLoading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}
      {isMessagesLoading && [...Array(5)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!isMessagesLoading && messages.length === 0 && (
				<p className='text-center text-black' >Send a message to start the conversation!</p>
			)}

    </div>
  );
};

export default Messages;
