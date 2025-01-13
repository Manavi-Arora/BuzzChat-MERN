import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

import '../../App.css';

const Sidebar = () => {
	
	return (
		<div className='border-r border-slate-500 p-4 flex flex-col sidebar'>
			<SearchInput />
			<div className='divider px-3 bg-gray-700 h-0.5'></div>
			<Conversations />
		</div>
	);
};
export default Sidebar;