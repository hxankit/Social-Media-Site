import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex items-center gap-3'>
        <Avatar>
            <AvatarImage src={comment?.auther?.profilepic}/>
            <AvatarFallback>DO</AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-sm' >{comment?.auther?.username}<span className='font-normal pl-1'>{comment.text}</span></h1>
        </div>

    </div>
  )
}

export default Comment