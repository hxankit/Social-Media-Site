import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = () => {
  const { posts } = useSelector((store) => store.posts);

  try {
    return (
      <div>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error rendering posts:", error);
    return <div>Something went wrong while loading the posts.</div>;
  }
};

export default Posts;
