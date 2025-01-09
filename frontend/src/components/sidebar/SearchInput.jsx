import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <form className='flex items-center gap-2'>
      <input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
      <button type='submit' className='btn btn-circle bg-yellow-200 text-white'>
        <Search color="#fbbf24" className='w-6 h-6 outline-none' />
      </button>
    </form>
  );
};

export default SearchInput;
