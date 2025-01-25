import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const SuggestedUsers = () => {
  const { SuggestedUsers } = useSelector((store) => store.auth);

  if (!SuggestedUsers || SuggestedUsers.length === 0) {
    return (
      <div className="my-5 text-gray-500 text-sm">
        No suggested users at the moment.
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="flex justify-between text-sm">
        <h1 className="font-semibold text-gray-500">Suggested Users</h1>
        <span className="font-medium text-blue-500 cursor-pointer hover:underline">
          See All
        </span>
      </div>
      <div className="space-y-4">
        {
        SuggestedUsers.map((user) => (
          <div key={user._id} className="flex items-center gap-4 my-5">
            <Link to={`/profile/${user._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilepic} alt="" />
                <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user._id}`} className="hover:underline">
                  {user?.username}
                </Link>
              </h1>
              <span className="text-xs text-gray-600">
                {user?.profilebio || 'Bio Here...'}
              </span>
            </div>
            <span className='text-blue-500 text-xs font-bold cursor-pointer '>Follow</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;