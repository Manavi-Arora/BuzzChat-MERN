import React, { useState, useEffect } from "react";
import StatusSidebar from "./StatusSidebar";  // Sidebar component
import StatusContainer from "./StatusContainer";  // StatusContainer component
import { useAuthStore } from "../../store/useAuthStore"; // Assuming Zustand store for status users

const Status = (props) => {
  const { statusUsers, fetchUsersWithStatus,updateStatus,authUser,fetchAuthUserStatus,authUserStatus } = useAuthStore();  // Using Zustand store to get status users
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(()=>{
    if(selectedUser?._id === authUser?._id){
      fetchAuthUserStatus();
    }
  },[updateStatus,statusUsers,fetchAuthUserStatus,authUser.status]);
  // Fetch users with their status on mount
  useEffect(() => {
    props.setProgress(50);
    setSelectedUser(null);
    props.setProgress(70);
    fetchUsersWithStatus();
    props.setProgress(100);
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);  // Set the selected user to display status in the container
  };

  return (
    <div className="flex w-screen overflow-auto h-screen">
      {/* Sidebar */}
      <StatusSidebar onUserClick={handleUserClick} setProgress={props.setProgress}/>
      
      {/* StatusContainer - Shows selected user's status */}
      <StatusContainer selectedUser={selectedUser} />
    </div>
  );
};

export default Status;
