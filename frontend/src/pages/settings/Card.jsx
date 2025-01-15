import React, { useState, useEffect } from "react";
import { UserRoundPlus, UserCheck } from "lucide-react"; // Import the icons
import { useAuthStore } from "../../store/useAuthStore"; // Import the store to access user data

function Card({ profilePic, fullName, userBio, friendId }) {
  const { authUser, addFriend, removeFriend, friends } = useAuthStore();
  const [isFriend, setIsFriend] = useState(false);

  // Check if the user is a friend when the component mounts or authUser changes
  useEffect(() => {
    if (authUser) {
      setIsFriend(authUser.friends.includes(friendId)); // Check if this friendId is in the current user's friends list
    }
  }, [authUser, friendId]);

  const handleFriendClick = async () => {
    if (isFriend) {
      await removeFriend(friendId); // Remove friend if already a friend
    } else {
      await addFriend(friendId); // Add friend if not already a friend
    }

    // Toggle the friend status in the UI after the operation
    setIsFriend(!isFriend);
  };

  return (
    <div className="card w-full bg-black/70 backdrop-blur-md p-4 rounded-lg shadow-xl h-full relative">
      {/* UserRoundPlus Icon in top-right corner */}
      <div className="absolute top-2 right-2">
        {isFriend ? (
          // Show a check icon if they are already friends
          <UserCheck className="text-green-500 w-6 h-6 cursor-pointer" onClick={handleFriendClick} />
        ) : (
          // Show a plus icon if they are not friends
          <UserRoundPlus className="text-white w-6 h-6 cursor-pointer" onClick={handleFriendClick} />
        )}
      </div>

      <figure className="flex justify-center mb-4">
        {/* Use a default image if profilePic is empty */}
        <img
          className="w-24 h-24 rounded-full"
          src={profilePic || "avatar.jpg"}
          alt={`${fullName}'s profile`}
        />
      </figure>

      <div className="text-center text-black">
        <h3 className="text-xl font-semibold">{fullName}</h3>
        <p className="text-sm text-gray-300 mt-2">{userBio || "No bio available"}</p>
      </div>
    </div>
  );
}

export default Card;
