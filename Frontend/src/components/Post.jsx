import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`https://instaclone-g9h5.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://instaclone-g9h5.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter(p => p._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://instaclone-g9h5.onrender.com/api/v1/post/${post._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='my-4 w-full max-w-md mx-auto px-2'>
      <div className='bg-white rounded-2xl shadow-md '>
        {/* Post Header */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-10 h-10'>
              <AvatarImage src={post.author?.profilePicture} alt="avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-2'>
              <h1 className='font-semibold text-base'>{post.author?.username}</h1>
              {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className='cursor-pointer text-gray-500 hover:text-black' />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              {post?.author?._id !== user?._id && (
                <Button variant='ghost' className="w-full text-[#ED4956] font-bold">Unfollow</Button>
              )}
              <Button variant='ghost' className="w-full">Add to favorites</Button>
              {user?._id === post?.author._id && (
                <Button onClick={deletePostHandler} variant='ghost' className="w-full text-red-500">Delete</Button>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Post Image */}
        <div className='rounded-xl overflow-hidden mb-3'>
          <img
            className='w-full object-cover aspect-square transition-all duration-300 hover:scale-[1.01]'
            src={post.image}
            alt="post_img"
          />
        </div>

        {/* Actions */}
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-4'>
            {liked ? (
              <FaHeart onClick={likeOrDislikeHandler} size={22} className='cursor-pointer text-red-500' />
            ) : (
              <FaRegHeart onClick={likeOrDislikeHandler} size={22} className='cursor-pointer hover:text-gray-600' />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className='cursor-pointer hover:text-gray-600'
            />
            <Send className='cursor-pointer hover:text-gray-600' />
          </div>
          <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
        </div>

        {/* Likes & Caption */}
        <span className='font-medium text-sm block mb-1'>{postLike} likes</span>
        <p className='text-sm mb-2'>
          <span className='font-semibold mr-2'>{post.author?.username}</span>
          {post.caption}
        </p>

        {/* Comments */}
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className='cursor-pointer text-sm text-gray-500 hover:underline'
          >
            View all {comment.length} comments
          </span>
        )}
        <CommentDialog open={open} setOpen={setOpen} />

        {/* Add Comment */}
        <div className='flex items-center gap-2 mt-3 border-t pt-2'>
          <input
            type="text"
            placeholder='Add a comment...'
            value={text}
            onChange={changeEventHandler}
            className='flex-1 text-sm outline-none bg-transparent'
          />
          {text && (
            <span onClick={commentHandler} className='text-[#3BADF8] font-medium text-sm cursor-pointer'>
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Post
