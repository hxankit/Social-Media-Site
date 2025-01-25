import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Button } from './ui/button'

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const { userProfile } = useSelector(store => store.auth)
  const isLogedInUserProfile = true
  const isFollowing = false
  return (
    <div className='flex max-w-5xl mx-auto justify-center pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilepic} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="flex flex-col p-4">
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">{userProfile?.username}</span>
          {isLogedInUserProfile ? (
            <>
              <Button variant="secondary" className="h-8 hover:bg-gray-200">Edit Profile</Button>
              <Button variant="secondary" className="h-8 hover:bg-gray-200">View Archives</Button>
              <Button variant="secondary" className="h-8 hover:bg-gray-200">Tools</Button>
            </>
          ) : isFollowing ? (
            <>
              <Button className="h-8 bg-blue-600 text-white hover:bg-blue-800">Unfollow</Button>
              <Button className="h-8 bg-blue-600 text-white hover:bg-blue-800"> Message</Button>
            </>
          ) : (
            <Button className="h-8 bg-blue-600 text-white hover:bg-blue-800">Follow</Button>
          )}
        </div>

        
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold">{userProfile?.post?.length || 0}</p>
            <span className="text-gray-500">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold">{userProfile?.followers?.length || 0}</p>
            <span className="text-gray-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold">{userProfile?.following?.length || 0}</p>
            <span className="text-gray-500">Following</span>
          </div>
        </div>
      </div>
    </section>
        </div>
      </div >
    </div >
  )
}

export default Profile