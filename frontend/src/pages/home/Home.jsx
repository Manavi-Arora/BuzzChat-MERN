import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import CallPage from "../call/callPage";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useGroupStore } from "../../store/useGroupStore";
import VoiceCallPage from "../call/voiceCallPage";


const Home = (props) => {
	const { setCalling,calling, subscribeToCalls, unsubscribeFromCalls, onlyVoiceCall } = useAuthStore();
	const { selectedUser, setSelectedUser } = useChatStore();
	const { selectedGroup, setSelectedGroup } = useGroupStore();
	const showContainer = selectedGroup || selectedUser;
	useEffect(() => {
		subscribeToCalls()
		return () => { unsubscribeFromCalls() }
	}, [subscribeToCalls, unsubscribeFromCalls])
	useEffect(() => {
		setSelectedGroup(null);
		setSelectedUser(null);
		setCalling(false);
	}, [])

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
			<div className='hidden sm:block overflow-hidden h-screen w-full'>
				{calling ? (
					onlyVoiceCall ? <VoiceCallPage /> : <CallPage />
				) : (
					<div className="flex h-full">
						<Sidebar />
						<MessageContainer />
					</div>
				)}

			</div>

			<div className="block sm:hidden w-full h-full">
				{calling ? <CallPage /> : (showContainer ? <MessageContainer /> : <Sidebar />)}
			</div>

		</>
	);
};
export default Home;