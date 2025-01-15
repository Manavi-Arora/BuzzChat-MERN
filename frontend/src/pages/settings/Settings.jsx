import React, { useEffect } from 'react';
import Card from './Card';
import { useChatStore } from '../../store/useChatStore';

function Settings() {
  const { users, getUsers } = useChatStore();  // Getting the users from the store

  useEffect(() => {
    getUsers(); // Fetch users on component mount
  }, [getUsers]);

  return (
    <div className="h-full w-full flex justify-center items-center bg-black bg-opacity-40">
      <div className="w-4/5 h-4/5 p-6 space-y-6 bg-white/30 backdrop-blur-md rounded-lg overflow-y-auto">
        {/* Sticky header */}
        <h1
          style={{ textShadow: '2px 2px 4px white' }}
          className="text-3xl p-2 font-bold text-black z-10 text-center shadow-[2px_2px_4px_black]"
        >
          FRIEND SUGGESTIONS
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <Card
                key={user._id}
                profilePic={user.profilePic}
                fullName={user.fullName}
                userBio={user.userBio}
                friendId={user._id}
              />
            ))
          ) : (
            <p className="text-white text-center">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
