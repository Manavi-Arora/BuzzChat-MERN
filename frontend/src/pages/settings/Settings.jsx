import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

function Settings() {
  const { users, getUsers } = useChatStore();  // Getting the users from the store
  const { showFriendsOnly, toggleShowFriendsOnly,authUser } = useAuthStore();

  useEffect(() => {
   getUsers()
  }, [authUser]);  


  return (
    <div className="h-screen w-full bg-[#2c2c2c]">
    <div className="h-full w-full flex justify-center items-center bg-[#2c2c2c] bg-opacity-40">
      <div className="w-4/5 h-4/5 p-6 space-y-6 bg-white/10 backdrop-blur-md rounded-lg overflow-y-auto">
        <h1
          style={{ textShadow: '2px 2px 4px white' }}
          className="text-sm sm:text-3xl p-2 font-sans font-bold text-black z-10 text-center shadow-[2px_2px_4px_black]"
        >
          FRIEND SUGGESTIONS
        </h1>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={showFriendsOnly}
            onChange={toggleShowFriendsOnly}
            id="showFriendsOnly"
            className="mr-2"
          />
          <label htmlFor="showFriendsOnly" className="text-light">Show Friends Only in sidebar</label>
        </div>

        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card
                friend = {user}
                key={user._id}
                profilePic={user.profilePic}
                fullName={user.fullName}
                userBio={user.userBio}
                friendId={user._id}
              />
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No users found.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Settings;
