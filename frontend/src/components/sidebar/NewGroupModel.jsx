import React, { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";
import SidebarSkeleton from "./SidebarSkeleton";

const NewGroupModal = ({ isOpen, onClose, createGroup }) => {
  // State to manage group name and selected members
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Get users and loading state from useChatStore
  const { getUsers, users, isUsersLoading } = useChatStore();

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      getUsers();  // Fetch users when modal is opened
    }
  }, [isOpen, getUsers]);

  // If users are loading, show skeleton loader
  if (isUsersLoading) {
    return [...Array(1)].map((_, idx) => <SidebarSkeleton key={idx} />);
  }

  // Handle member selection/deselection
  const handleMemberChange = (userId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(userId)
        ? prevMembers.filter((id) => id !== userId)  // Deselect if already selected
        : [...prevMembers, userId]  // Add to selected if not selected
    );
  };

  // Handle group creation
  const handleCreateGroup = async () => {
    if (!groupName) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      const groupData = { name: groupName, members: selectedMembers };
      const newGroup = await createGroup(groupData);
      console.log("New group created:", newGroup);
      onClose(); // Close the modal after group creation
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Determine which list to show: all users
  const conversationList = users;

  return (
    <div className="modal-overlay mt-2">
      <div className="modal-content">
        <h2 className="text-center text-white md:text-xl font-semibold mb-4">Create New Group</h2>

        {/* Group name input */}
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full p-3 rounded-md mb-4 bg-[#383838] outline-none"
        />
        <div className="flex justify-center gap-2">
          <button
            onClick={handleCreateGroup}
            className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Group
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>

        {/* Display users with selection */}
        <div className="members-list mb-4">
          <h3 className="font-medium text-lg mb-2">Select Members</h3>
          {conversationList.length === 0 ? (
            <p>No users available</p>
          ) : (
            <div className="users-cards" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {conversationList.map((user) => {
                const isSelected = selectedMembers.includes(user._id);
                return (
                  <div
                    key={user._id}
                    className={`flex gap-2 items-center rounded p-2 py-1 cursor-pointer ${isSelected ? "bg-[#454545]" : ""}`}
                    onClick={() => handleMemberChange(user._id)}
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={user.profilePic ? user.profilePic : "avatar.jpg"}
                          alt="user avatar"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="flex gap-3 justify-between">
                        <p className="md:font-semibold text-light hidden sm:block">{user.fullName}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Buttons */}
        
      </div>
    </div>
  );
};

export default NewGroupModal;
