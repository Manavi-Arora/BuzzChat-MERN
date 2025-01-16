import React, { useState, useEffect } from "react";
import { UserRoundPlus, UserCheck } from "lucide-react"; // Import the icons
import { useAuthStore } from "../../store/useAuthStore"; // Import the store to access user data

function Card({friend,profilePic, fullName, userBio, friendId}) {
  const { authUser, addFriend, removeFriend } = useAuthStore();
  const [isFriend, setIsFriend] = useState(null); // Initialize with the `alreadyFriend` prop

  // Update isFriend whenever the friends list or the authUser changes
  useEffect(() => {
    if (authUser) {
      setIsFriend((authUser?.friends?.includes(friendId) || friend.friends.includes(authUser._id))); // Check if this friendId is in the current user's friends list
    }
  }, [authUser, friendId,friend]);

  const handleFriendClick = async () => {
    if (isFriend) {
      await removeFriend(friendId); // Remove friend from the user's list
    } else {
      await addFriend(friendId); // Add friend to the user's list
    }

    // Toggle the friend status after adding/removing the friend
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
