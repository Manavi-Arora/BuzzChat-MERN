import React, { useState, useEffect } from "react";
import StatusSidebar from "./StatusSidebar";  // Sidebar component
import StatusContainer from "./StatusContainer";  // StatusContainer component
import { useAuthStore } from "../../store/useAuthStore"; // Assuming Zustand store for status users
import SearchInput from "../../components/sidebar/SearchInput"; // Optional: Search input for filtering users

const Status = () => {
  const { statusUsers, fetchUsersWithStatus,updateStatus } = useAuthStore();  // Using Zustand store to get status users
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Fetch users with their status on mount
  useEffect(() => {
    setSelectedUser(null);
    fetchUsersWithStatus();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);  // Set the selected user to display status in the container
  };

  return (
    <div className="flex w-screen overflow-auto h-screen">
      {/* Sidebar */}
      <StatusSidebar onUserClick={handleUserClick} />
      
      {/* StatusContainer - Shows selected user's status */}
      <StatusContainer selectedUser={selectedUser} />
    </div>
  );
};

export default Status;
