import React, { useState, useEffect } from 'react';
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import { UsersRound } from "lucide-react";
import NewGroupModal from './NewGroupModel';
import { useAuthStore } from "../../store/useAuthStore";
import '../../App.css';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { fetchUserGroups, createGroup } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  // Open modal
  const handleNewGroupClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // You can add fetching user groups logic here if needed
  // useEffect(() => {
  //   fetchUserGroups();  // Fetch groups when component mounts
  // }, []);

  return (
    <div className='border-r border-black p-3 flex flex-col sidebar mt-16 w-1/3' style={{ backgroundColor: "#2c2c2c" }}>
      <div className='flex pb-3 sm:pl-2 items-center justify-between'>
        <h3 className='text-white font-sans sm:text-2xl sm:font-bold'>Chats</h3>
        <div className="flex justify-end items-center gap-2 text-white font-sans">
          <span className="hidden sm:block font-semibold">New Group</span>
          <button className="cursor-pointer" onClick={handleNewGroupClick}>
            <UsersRound color="#ffffff" />
          </button>
        </div>
      </div>
      <SearchInput />
      <Conversations /> {/* Pass groups to Conversations component */}

      {/* Conditionally render the NewGroupModal */}
      {isModalOpen && (
        <NewGroupModal
          isOpen={isModalOpen}
          onClose={closeModal}
          createGroup={createGroup} // Pass createGroup function
        />
      )}
    </div>
  );
};

export default Sidebar;
