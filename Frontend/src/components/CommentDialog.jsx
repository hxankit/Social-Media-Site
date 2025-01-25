import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import Comment from './Comment';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector((state) => state.posts);
  const [comment, setComment] = useState(selectedPost?.comments || []);
  const dispatch = useDispatch();

  // Sync comments state when `selectedPost` changes
  useEffect(() => {
    setComment(selectedPost?.comments || []);
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : '');
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) return; // Prevent empty submissions
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text: text.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const newComment = res.data.comment;
        const updatedCommentData = [...comment, newComment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText('');
      }
    } catch (error) {
      console.error('Error while adding comment:', error);
      toast.error('Failed to add comment.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Image */}
          <div className="lg:w-1/2">
            <img
              src={selectedPost?.image || '/placeholder-image.jpg'}
              alt="Post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Right Section - Comments and Input */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.auther?.profilepic || '/default-avatar.jpg'} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">{selectedPost?.auther?.username || 'Anonymous'}</Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreVertical className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                  <div className="cursor-pointer w-full">Add to Favorite</div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            {/* Comments */}
            <div className="flex-1 overflow-y-auto max-h-96 p-2">
              {comment?.length > 0 ? (
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="w-full outline-none border-gray-300 p-2 rounded"
                  value={text}
                  onChange={changeEventHandler}
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
