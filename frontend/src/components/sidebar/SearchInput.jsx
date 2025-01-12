import { Search } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search,setSearch] = useState("");
  const {users,setSelectedUser} = useChatStore();

  const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		
		const user = users.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

		if (user) {
			setSelectedUser(user);
			setSearch("");
		} else toast.error("No such user found!");
	};
  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-2' >
      <input type='text' placeholder='Search…' className='input input-bordered rounded-full'value={search} 
        onChange={(e) => setSearch(e.target.value)} />
      <button type='submit' className='btn btn-circle bg-yellow-200 text-white'>
        <Search color="#fbbf24" className='w-6 h-6 outline-none' />
      </button>
    </form>
  );
};

export default SearchInput;
