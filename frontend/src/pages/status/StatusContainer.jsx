import React, { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const StatusContainer = ({ selectedUser }) => {
  const { authUser,updateStatus } = useAuthStore();
  
  // Check if the selectedUser is the same as authUser
  const isAuthUser = selectedUser && selectedUser._id === authUser._id;
  return (
    <div className="flex justify-center items-center w-full h-screen overflow-auto" style={{ backgroundColor: "#2c2c2c" }}>
      <div className="px-4 text-center sm:text-lg md:text-xl text-white font-semibold flex flex-col items-center gap-4 w-full md:w-3/4 lg:w-1/2">
        {selectedUser ? (
          <>
            <h2 className="text-2xl font-semibold mt-4 mb-2">
              {isAuthUser ? "Your status" : `${selectedUser.fullName}'s Status`}
            </h2>
            <div className="mb-6 relative">
              {selectedUser.status ? (
                <img
                  src={selectedUser.status}
                  alt="User status"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="flex justify-center items-center text-center w-full text-gray-500">
                  No status set
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No user selected</div>
        )}
      </div>
    </div>
  );
};

export default StatusContainer;
