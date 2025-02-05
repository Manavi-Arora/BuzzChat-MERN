import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import CallPage from "../call/callPage";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useGroupStore } from "../../store/useGroupStore";


const Home = (props) => {
	const { calling, subscribeToCalls, unsubscribeFromCalls } = useAuthStore();
	const { selectedUser } = useChatStore();
	const { selectedGroup } = useGroupStore();
	const showContainer = selectedGroup || selectedUser;
	useEffect(() => {
		subscribeToCalls()
		return () => { unsubscribeFromCalls() }
	}, [subscribeToCalls, unsubscribeFromCalls])

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
			<div className='hidden sm:block rounded-lg overflow-hidden w-full'>
				{calling ? <CallPage /> : (
					<div className="flex h-screen">
					  
						<Sidebar />
						<MessageContainer />
					</div>
				)}
			</div>

			<div className="block sm:hidden rounded-lg overflow-hidden w-full h-screen">
				{calling ? <CallPage /> : (showContainer ? <MessageContainer /> : <Sidebar />)}
			</div>

		</>
	);
};
export default Home;