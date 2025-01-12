import Conversation from "./Conversation";
import SidebarSkeleton from "./SidebarSkeleton"
import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { getRandomEmoji } from "../../lib/emojis";

const Conversations = () => {
  const{getUsers,users,isUsersLoading} = useChatStore()
 
	useEffect(()=>{
		getUsers();
	},[getUsers])

	if(isUsersLoading){
		return [...Array(1)].map((_, idx) => <SidebarSkeleton key={idx} />)
	}

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {users.map((user, idx) => (
				<Conversation
					key={user._id}
					user={user}
					emoji={getRandomEmoji()}
					lastIdx={idx === users.length - 1}
				/>
			))}
    </div>
  );
};

export default Conversations;
