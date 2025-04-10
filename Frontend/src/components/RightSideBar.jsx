import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebarbar = () => {
  const { user } = useSelector(store => store.auth)

  if (!user) return null

  return (
    <aside className='hidden lg:block w-full max-w-xs px-4 pt-10'>
      <div className='flex items-center gap-4'>
        <Link to={`/profile/${user._id}`}>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user.profilePicture} alt="user_profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className='flex flex-col justify-center'>
          <h1 className='font-semibold text-sm leading-4'>
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
          </h1>
          <span className='text-gray-600 text-xs truncate max-w-[160px]'>
            {user.bio || 'Bio here...'}
          </span>
        </div>
      </div>

      <div className='mt-6'>
        <SuggestedUsers />
      </div>
    </aside>
  )
}

export default RightSidebarbar
