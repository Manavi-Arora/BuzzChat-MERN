import React, { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ChevronLeft } from "lucide-react";

const StatusContainer = ({ selectedUser,setSelectedUser }) => {
  const { authUser, updateStatus, fetchAuthUserStatus, authUserStatus } = useAuthStore();
  
  // Check if the selectedUser is the same as authUser
  const isAuthUser = selectedUser && selectedUser._id === authUser._id;

  useEffect(() => {
    // Only fetch if the selectedUser is authUser and status hasn't been fetched
    if (isAuthUser) {
      fetchAuthUserStatus();
    }
  }, [authUserStatus?.status, fetchAuthUserStatus, updateStatus]);
  const handleBackClick = () => {
    setSelectedUser(null);
  }

  return (
    <div className="flex justify-center items-center w-full h-screen overflow-auto" style={{ backgroundColor: "#2c2c2c" }}>
      <div className="text-center sm:text-lg md:text-xl text-white font-semibold flex flex-col items-center gap-4 w-full h-4/5">
        {selectedUser ? (
          <>
            <div className="flex gap-16 items-center">
              <h2 className="text-2xl font-semibold mb-2 flex-grow-0">
                {isAuthUser ? "Your status" : `${selectedUser.fullName}'s Status`}
              </h2>
              <button className="sm:hidden block ml-auto" onClick={handleBackClick}>
                <ChevronLeft />
              </button>
            </div>


            <div className="mb-6 relative">
              {isAuthUser ? (
                // Display authUser's updated status
                authUserStatus?.status ? (
                  <img
                    src={authUserStatus?.status}
                    alt="User status"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex justify-center items-center text-center w-full text-gray-500">
                    No status set
                  </div>
                )
              ) : (
                // Display selectedUser's status
                selectedUser.status ? (
                  <img
                    src={selectedUser.status}
                    alt="User status"
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="flex justify-center items-center text-center w-full text-gray-500">
                    No status set
                  </div>
                )
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
