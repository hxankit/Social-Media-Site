import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [followingMap, setFollowingMap] = useState({});

  // 🟡 Build follow status based on actual user.following list
  useEffect(() => {
    if (suggestedUsers && user) {
      const initialMap = {};
      suggestedUsers.forEach((u) => {
        initialMap[u._id] = user.following.includes(u._id);
      });
      setFollowingMap(initialMap);
    }
  }, [suggestedUsers, user]);

  const handleFollowToggle = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      const message = res?.data?.message;

      if (message.includes('followed')) {
        setFollowingMap((prev) => ({ ...prev, [userId]: true }));
      } else if (message.includes('Unfollowed')) {
        setFollowingMap((prev) => ({ ...prev, [userId]: false }));
      }

      console.log(message);
    } catch (error) {
      console.error('Follow/unfollow failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
      </div>

      {suggestedUsers?.map((user) => (
        <div key={user._id} className="flex items-center justify-between my-5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user._id}`}>
              <Avatar>
                <AvatarImage
                  src={user?.profilePicture}
                  alt={`${user?.username}'s avatar`}
                />
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex flex-col">
              <Link
                to={`/profile/${user._id}`}
                className="text-sm font-semibold hover:underline"
              >
                {user?.username}
              </Link>
              <span className="text-gray-600 text-sm">
                {user?.bio || 'Bio here...'}
              </span>
            </div>
          </div>

          <button
            className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
            onClick={() => handleFollowToggle(user._id)}
          >
            {followingMap[user._id] ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
