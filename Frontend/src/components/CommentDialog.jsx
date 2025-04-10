import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 overflow-hidden flex flex-col md:flex-row md:h-[80vh] rounded-lg"
      >
        {/* Left: Post Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={selectedPost?.image}
            alt="post_img"
            className="w-full h-full object-cover md:rounded-l-lg"
          />
        </div>

        {/* Right: Comments Section */}
        <div className="md:w-1/2 w-full flex flex-col justify-between bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-3 items-center">
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-sm hover:underline">{selectedPost?.author?.username}</Link>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-start text-sm gap-2">
                <button className="text-[#ED4956] font-semibold w-full text-left hover:bg-gray-100 p-2 rounded">Unfollow</button>
                <button className="w-full text-left hover:bg-gray-100 p-2 rounded">Add to favorites</button>
              </DialogContent>
            </Dialog>
          </div>

          <hr />

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 max-h-96 md:max-h-full">
            {comment.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className="w-full outline-none border text-sm border-gray-300 p-2 rounded focus:ring-1 focus:ring-gray-400"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="default"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
