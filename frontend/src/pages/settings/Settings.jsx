import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

function Settings() {
  const { users, getUsers } = useChatStore();  // Getting the users from the store
  const { showFriendsOnly, toggleShowFriendsOnly, friends, fetchFriends, authUser } = useAuthStore();

  const [isFriendsFetched, setIsFriendsFetched] = useState(false);

  useEffect(() => {
    const fetchFriendsData = async () => {
      await fetchFriends();  // Fetch friends data from the store
      setIsFriendsFetched(true);  // Once friends are fetched, update state
    };
    fetchFriendsData();
  }, [fetchFriends, authUser, friends]);  // Only run when fetchFriends changes

  useEffect(() => {
    if (isFriendsFetched) {
      getUsers();  // Fetch users only after friends are fetched
    }
  }, [isFriendsFetched]);  // Run when isFriendsFetched changes

  useEffect(() => {
    console.log(`Friends of ${authUser?.fullName}:`, friends);
  }, [friends]); // This ensures that friends are logged when the friends list is updated

  return (
    <div className="h-full w-full flex justify-center items-center bg-black bg-opacity-40">
      <div className="w-4/5 h-4/5 p-6 space-y-6 bg-white/30 backdrop-blur-md rounded-lg overflow-y-auto">
        <h1
          style={{ textShadow: '2px 2px 4px white' }}
          className="text-3xl p-2 font-bold text-black z-10 text-center shadow-[2px_2px_4px_black]"
        >
          FRIEND SUGGESTIONS
        </h1>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={!showFriendsOnly}
            onChange={toggleShowFriendsOnly}
            id="showFriendsOnly"
            className="mr-2"
          />
          <label htmlFor="showFriendsOnly" className="text-white">Show Friends Only in sidebar</label>
        </div>

        {isFriendsFetched && users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card
                key={user._id}
                profilePic={user.profilePic}
                fullName={user.fullName}
                userBio={user.userBio}
                friendId={user._id}
                alreadyFriend={friends.includes(user._id)}  // Pass friends status
              />
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Settings;
