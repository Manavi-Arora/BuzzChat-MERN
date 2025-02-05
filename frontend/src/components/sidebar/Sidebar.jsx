import React, { useState, useEffect } from 'react';
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import { UsersRound } from "lucide-react";
import NewGroupModal from './NewGroupModel';
import { useGroupStore } from "../../store/useGroupStore";
import { useChatStore } from '../../store/useChatStore';
import '../../App.css';

const Sidebar = () => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const { fetchUserGroups, createGroup, selectedGroup, setSelectedGroup } = useGroupStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [hoveredGroup, setHoveredGroup] = useState(null); // Track hovered group

  // Open modal
  const handleNewGroupClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch groups on mount
  useEffect(() => {
    const getGroups = async () => {
      const groupsData = await fetchUserGroups();
      setGroups(groupsData);
      setIsLoading(false);
    };

    getGroups();
  }, [createGroup, fetchUserGroups]);

  // Handle group click to set the selected group
  const handleGroupClick = (group) => {
    setSelectedUser(null);
    setSelectedGroup(group);
  };

  return (
    <div className='border-r border-black p-3 flex flex-col sidebar mt-16 lg:w-1/3 w-auto' style={{ backgroundColor: "#2c2c2c" }}>
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
      {!isLoading && groups.length > 0 && (
        <div className="users-cards sm:pl-1.5 mt-2 mb-2 overflow-y-auto h-28">
          <h3 className='text-white font-sans sm:pl-1.5 mt-2 mb-2 sm:text-xl sm:font-bold'>Your Groups</h3>
          {groups.map((group) => {
            const isSelected = selectedGroup && selectedGroup._id === group._id;
            const isHovered = hoveredGroup && hoveredGroup._id === group._id;
            const classHover = isHovered || isSelected ? "bg-[#383838]" : "hover:bg-[#383838]";

            return (
              <div
                key={group._id}
                className={`w-full rounded-sm flex items-center cursor-pointer ${classHover} ${isSelected?"bg-[#454545]":""} `}
                onClick={() => handleGroupClick(group)} // Handle group selection
                onMouseEnter={() => setHoveredGroup(group)} // Set hovered group on mouse enter
                onMouseLeave={() => setHoveredGroup(null)} // Reset hovered group on mouse leave
              >
                <div className="avatar flex items-center gap-2.5">
                  <div className="w-14 h-14 rounded-full">
                    <img
                      src={group.profilePic ? group.profilePic : "group_profile.png"}
                      alt="user avatar"
                    />
                  </div>
                  <p className={`md:font-semibold text-light ${isSelected ? 'font-bold' : ''} `}>
                    {group.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
