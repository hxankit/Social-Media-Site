import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:pl-[20%] lg:pr-4 py-4">
      <div className="w-full max-w-2xl">
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
