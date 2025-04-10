import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle } from 'lucide-react'

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')

  const { userProfile, user } = useSelector((store) => store.auth)
  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false

  const handleTabChange = (tab) => setActiveTab(tab)

  const displayedPost =
    activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className='max-w-screen-lg w-full px-4 sm:px-6 lg:px-8 lg:ml-64'>
  <div className='flex flex-col gap-12 py-10 w-full'>

        {/* Profile Info Section */}
        <div className='flex flex-col md:flex-row gap-10 md:items-start'>
          <div className='flex justify-center md:justify-start'>
            <Avatar className='h-28 w-28 md:h-32 md:w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt='profilephoto' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className='flex flex-col flex-1 gap-4'>
            {/* Username + Actions */}
            <div className='flex flex-wrap items-center gap-3'>
              <span className='text-xl font-semibold'>{userProfile?.username}</span>
              {isLoggedInUserProfile ? (
                <>
                  <Link to='/account/edit'>
                    <Button variant='secondary' className='h-8 text-xs sm:text-sm'>Edit profile</Button>
                  </Link>
                  <Button variant='secondary' className='h-8 text-xs sm:text-sm'>View archive</Button>
                  <Button variant='secondary' className='h-8 text-xs sm:text-sm'>Ad tools</Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button variant='secondary' className='h-8 text-xs sm:text-sm'>Unfollow</Button>
                  <Button variant='secondary' className='h-8 text-xs sm:text-sm'>Message</Button>
                </>
              ) : (
                <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8 text-xs sm:text-sm'>Follow</Button>
              )}
            </div>

            {/* Stats */}
            <div className='flex gap-6 text-sm flex-wrap'>
              <p><span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
              <p><span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
              <p><span className='font-semibold'>{userProfile?.following.length}</span> following</p>
            </div>

            {/* Bio */}
            <div className='text-sm'>
              <p className='font-semibold mb-1'>{userProfile?.bio || 'bio here...'}</p>
              <Badge className='w-fit' variant='secondary'>
                <AtSign className='w-4 h-4' />
                <span className='pl-1'>{userProfile?.username}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium tracking-wider uppercase text-gray-600 pt-4 overflow-x-auto whitespace-nowrap'>
            {['posts', 'saved', 'reels', 'tags'].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 pt-4'>
            {displayedPost?.map((post) => (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img
                  src={post.image}
                  alt='postimage'
                  className='rounded-sm w-full aspect-square object-cover'
                />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className='flex items-center gap-2'>
                      <Heart size={18} />
                      <span className='text-sm'>{post?.likes.length}</span>
                    </button>
                    <button className='flex items-center gap-2'>
                      <MessageCircle size={18} />
                      <span className='text-sm'>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {displayedPost?.length === 0 && (
              <p className='col-span-full text-center text-gray-500 py-10'>No posts to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
