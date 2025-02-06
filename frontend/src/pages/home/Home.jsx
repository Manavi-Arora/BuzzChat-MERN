import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import CallPage from "../call/callPage";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useGroupStore } from "../../store/useGroupStore";


const Home = (props) => {
	const { calling, subscribeToCalls, unsubscribeFromCalls } = useAuthStore();
	const { selectedUser ,setSelectedUser} = useChatStore();
	const { selectedGroup,setSelectedGroup } = useGroupStore();
	const showContainer = selectedGroup || selectedUser;
	useEffect(() => {
		subscribeToCalls()
		return () => { unsubscribeFromCalls() }
	}, [subscribeToCalls, unsubscribeFromCalls])
	useEffect(()=>{
		setSelectedGroup(null);
		setSelectedUser(null);
    },[])

	useEffect(() => {
		props.setProgress(20);
		setTimeout(() => {
			props.setProgress(50);
		}, 500);
		setTimeout(() => {
			props.setProgress(100);
		}, 1000);
	}, []);
	return (
		<>
			<div className='hidden sm:block rounded-lg overflow-hidden h-screen w-full'>
				{calling ? <CallPage /> : (
					<div className="flex h-full">
					  
						<Sidebar />
						<MessageContainer />
					</div>
				)}
			</div>

			<div className="block sm:hidden rounded-lg w-full h-full">
				{calling ? <CallPage /> : (showContainer ? <MessageContainer /> : <Sidebar />)}
			</div>

		</>
	);
};
export default Home;