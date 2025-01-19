import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";


const Home = (props) => {
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
			<Sidebar />
			<MessageContainer /> 
		</div>
	);
};
export default Home;