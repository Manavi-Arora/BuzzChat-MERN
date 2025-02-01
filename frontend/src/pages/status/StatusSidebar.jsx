import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";  // Zustand store to get users with status
import { ChartPie } from "lucide-react";  // Import ChartPie icon from lucide-react
import SidebarSkeleton from "../../components/sidebar/SidebarSkeleton";  // Assuming SidebarSkeleton is a component

const StatusSidebar = ({ onUserClick }) => {
  const { statusUsers, fetchUsersWithStatus, statusLoading, authUser, updateStatus } = useAuthStore();
  const [hoveredUser, setHoveredUser] = useState(null); // Track hovered user
  const [selectedImg, setSelectedImg] = useState(null);  // State to store selected image
  const fileInputRef = React.createRef(); // Create a reference for the hidden file input

  useEffect(() => {
    fetchUsersWithStatus();  // Fetch users with their status on component mount
  }, [fetchUsersWithStatus, updateStatus, statusUsers,authUser]);

  const handleUserHover = (user) => {
    setHoveredUser(user);  // Set hovered user
  };

  const handleUserLeave = () => {
    setHoveredUser(null);  // Reset hover
  };

  const handleImageUpload = async (e) => {
    // Update profile image on upload
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // Only call updateStatus if image has been successfully selected
      if (base64Image) {
        await updateStatus(base64Image); // Pass the base64 image to update status
      }
    };
  };

  const handleChartPieClick = (e) => {
    e.preventDefault();  // Prevent the default behavior
    fileInputRef.current.click();  // Trigger the hidden file input click
  };

  const handleAuthUserClick = () => {
    // When authUser's avatar is clicked, set selected user as authUser
    onUserClick(authUser);
  };

  return (
    <div className="border-r border-black p-3 flex flex-col sidebar lg:w-1/3 w-auto" style={{ backgroundColor: "#2c2c2c" }}>
      {/* Header with New Status button */}
      <div className="flex pb-3 sm:pl-2 items-center justify-between mt-16">
        <h3 className="text-white font-sans sm:text-2xl sm:font-bold">Status</h3>
      </div>

      {/* Display authUser at the top */}
      <div className="sm:pl-1.5 mt-2 mb-2">
        <div className="avatar flex items-center gap-2.5  hover:bg-[#383838] rounded-sm p-1 cursor-pointer" onClick={handleAuthUserClick} >
          <div className="w-14 h-14 rounded-full " >
            <img
              src={authUser?.profilePic || "avatar.jpg"}
              alt={authUser?.fullName}
                // Set selected user as authUser when clicked
            />
          </div>
          <p className="text-white font-bold mr-2">Your Status</p>
          <button
            onClick={handleChartPieClick}  // Show file input on ChartPie icon click
            className="text-white ml-auto"
            aria-label="Update status"
          >
            <ChartPie size={20} /> {/* ChartPie icon button */}
          </button>
        </div>
      </div>

      {/* Users List Section */}
      <div className="sm:pl-1.5 mt-2 mb-2 overflow-y-auto">
        {/* Show Skeleton Loader when statusLoading is true */}
        
          <ul className="space-y-4 mt-3">
            {statusUsers.length === 0 ? (
              <p className="text-white">No Status Available</p>
            ) : (
              statusUsers
                .filter((user) => user._id !== authUser._id) // Filter out the authUser
                .map((user) => {
                  const isHovered = hoveredUser && hoveredUser._id === user._id;
                  const classHover = isHovered ? "bg-[#383838]" : "hover:bg-[#383838]";

                  return (
                    <li
                      key={user._id}
                      className={`w-full rounded-sm flex items-center cursor-pointer ${classHover}`}
                      onClick={() => onUserClick(user)}  // Handle user click to select user
                      onMouseEnter={() => handleUserHover(user)}  // Handle hover event
                      onMouseLeave={handleUserLeave}  // Reset hover state
                    >
                      <div className="avatar flex items-center gap-2.5">
                        <div className="w-14 h-14 rounded-full">
                          <img
                            src={user.profilePic || "avatar.jpg"}
                            alt={user.fullName}
                            onClick={() => updateStatus({ profilePic: user.profilePic })}  // Trigger update status on avatar click
                          />
                        </div>
                        <p className={`text-white ${isHovered ? 'font-bold' : 'font-normal'} hidden sm:block`}>
                          {user.fullName}
                        </p>
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
      </div>

      {/* Hidden file upload input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}  // Attach the reference to the file input
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default StatusSidebar;
