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
		
		<div className='flex sm:h-[450px] md:h-[600px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-full mx-20 mt-10'>
			<Sidebar />
			<MessageContainer /> 
		</div>
	);
};
export default Home;