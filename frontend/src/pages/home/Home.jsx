import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import CallPage from "../call/callPage";
import { useAuthStore } from "../../store/useAuthStore";


const Home = (props) => {
	const {calling,subscribeToCalls,unsubscribeFromCalls} = useAuthStore();
	useEffect(()=>{
		subscribeToCalls()
		return () => {unsubscribeFromCalls()}
	  },[subscribeToCalls,unsubscribeFromCalls])

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
		
		<div className='flex rounded-lg overflow-hidden w-full h-screen'>
			{calling ? <CallPage/> : <>
				<Sidebar />
				<MessageContainer /> 
			</>}
	
		</div>
	);
};
export default Home;