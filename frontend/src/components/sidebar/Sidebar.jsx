import React, { useState, useEffect } from 'react';
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import { UsersRound } from "lucide-react";
import NewGroupModal from './NewGroupModel';
import { useAuthStore } from "../../store/useAuthStore";
import '../../App.css';

const Sidebar = () => {
  const { fetchUserGroups, createGroup } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  // Open modal
  const handleNewGroupClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getGroups = async () => {
      const groupsData = await fetchUserGroups(); // Fetch groups
      setGroups(groupsData); // Update the groups state with the fetched data
      setIsLoading(false); // Set loading state to false once data is fetched
    };

    getGroups(); // Call the function to fetch groups on component mount
  }, [createGroup, fetchUserGroups,isModalOpen]);

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
      {!isLoading && groups &&
        <div className="users-cards sm:pl-1.5 mt-2 mb-2">
          {groups.map((group) => {
            return (
              <>
                <h3 className='text-white font-sans sm:pl-1.5 mt-2 mb-2 sm:text-xl sm:font-bold'>Your Groups</h3>
                <div className="w-full flex items-center overflow-y-scroll cursor-pointer"> 
                  <div className="avatar flex items-center gap-2.5 "> 
                    <div className="w-14 h-14 rounded-full">
                      <img
                        src={group.profilePic ? group.profilePic : "group_profile.png"}
                        alt="user avatar"
                      />
                    </div>
                    <p className="md:font-semibold text-light hidden sm:block">{group.name}</p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      }
      <Conversations /> 
      {isModalOpen && (
        <NewGroupModal
          isOpen={isModalOpen}
          onClose={closeModal}
          createGroup={createGroup} 
        />
      )}
    </div>
  );
};

export default Sidebar;
