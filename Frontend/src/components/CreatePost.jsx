import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption('');
        setImagePreview('');
        setFile('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-md sm:max-w-xl">
        <DialogHeader className="text-center text-lg font-bold mb-3">Create New Post</DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-xs text-muted-foreground">Share something with your followers</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="resize-none min-h-[80px] border-gray-300 rounded-md focus-visible:ring-0"
        />

        {imagePreview && (
          <div className="w-full h-64 rounded-md overflow-hidden my-4 border">
            <img src={imagePreview} alt="preview_img" className="w-full h-full object-cover" />
          </div>
        )}

        <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />

        <div className="flex justify-between gap-2 mt-3">
          <Button
            onClick={() => imageRef.current.click()}
            variant="outline"
            className="flex-1"
          >
            Select from computer
          </Button>

          {imagePreview && (
            loading ? (
              <Button className="flex-1 cursor-not-allowed" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </Button>
            ) : (
              <Button onClick={createPostHandler} className="flex-1 bg-[#0095F6] hover:bg-[#1877F2] text-white">
                Post
              </Button>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
