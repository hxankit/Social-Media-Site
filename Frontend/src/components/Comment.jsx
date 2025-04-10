import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="my-3 px-2">
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm sm:text-base">
          <span className="font-semibold">{comment?.author?.username}</span>
          <span className="text-gray-700">{comment?.text}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
