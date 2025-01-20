import { Search } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";
import { X } from "lucide-react";
const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { users, setSelectedUser } = useChatStore();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submit action
    if (!search) return;

    const user = users.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

    if (user) {
      setSelectedUser(user);
      setSearch(""); // Clear search input after selecting the user
    } else {
      toast.error("No such user found!");
    }
  };

  const cancelBtn = (e) => {
    e.preventDefault(); // Prevent the default behavior of the button
    setSearch(""); // Clear the search input
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='w-full mx-auto'>
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-[#2e343d] overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-light pr-2 bg-[#2e343d]"
            type="text"
            id="search"
            placeholder="Search something.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          {/* Show the cancel button when there is text in the search input */}
          {search.length > 0 && (
            <button onClick={cancelBtn} type="button">
              <X size={20} className="mr-2" />
            </button>
          )}
          
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
{/*<form onSubmit={handleSubmit} className='flex items-center gap-2 pb-4' >
      <input type='text' placeholder='Search…' className='input input-bordered rounded-full'value={search} 
        onChange={(e) => setSearch(e.target.value)} />
      <button type='submit' className='btn btn-circle bg-yellow-200 text-white'>
        <Search color="#fbbf24" className='w-6 h-6 outline-none' />
      </button>
    </form>*/}
