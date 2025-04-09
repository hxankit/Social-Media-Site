import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto px-4 sm:px-8'>
      <div className='flex flex-col gap-12 py-10 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 items-center'>
          <section className='flex justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-lg font-semibold'>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit"><Button variant='secondary' className='h-8'>Edit profile</Button></Link>
                      <Button variant='secondary' className='h-8'>View archive</Button>
                      <Button variant='secondary' className='h-8'>Ad tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='h-8'>Unfollow</Button>
                        <Button variant='secondary' className='h-8'>Message</Button>
                      </>
                    ) : (
                      <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex gap-6 text-sm'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1 text-sm'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit mt-1' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>

        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center gap-10 text-xs sm:text-sm font-medium tracking-wider uppercase text-gray-600'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`} onClick={() => handleTabChange('posts')}>
              Posts
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'border-b-2 border-black' : ''}`} onClick={() => handleTabChange('saved')}>
              Saved
            </span>
            <span className='py-3 cursor-pointer'>Reels</span>
            <span className='py-3 cursor-pointer'>Tags</span>
          </div>

          <div className='grid grid-cols-3 gap-1 pt-4'>
            {
              displayedPost?.map((post) => (
                <div key={post?._id} className='relative group cursor-pointer'>
                  <img src={post.image} alt='postimage' className='rounded-sm w-full aspect-square object-cover' />
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
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
