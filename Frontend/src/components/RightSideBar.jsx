import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import SuggestedUsers from './SuggesstedUsers';

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className='w-fit my-10 pr-32'>
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user.userId}`}>
        <Avatar>
          <AvatarImage src={user?.profilepic} alt="post_image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        <div>
        <h1 className='font-semibold text-sm cursor-pointer'><Link to={`/profile/${user.userId}`}>{user?.username}</Link></h1>

        <span className='text-sm text-gray-600'>{user?.profilebio ||'Bio Here....'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar