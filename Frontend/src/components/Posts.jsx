import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)

  return (
    <div className='w-full flex flex-col items-center'>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className='text-gray-500 text-center mt-10 text-sm sm:text-base'>
          No posts yet.
        </p>
      )}
    </div>
  )
}

export default Posts
