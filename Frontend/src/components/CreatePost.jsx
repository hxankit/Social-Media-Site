import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  // Handle file change and image preview
  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const preview = await readFileAsDataUrl(selectedFile);
      setImagePreview(preview);
    }
  };

  // Handle post creation
  const createPostHandler = async (e) => {
    e.preventDefault();

    if (!file || !caption.trim()) {
      toast.error('Please add a caption and select an image.');
      return;
    }
    const formData = new FormData();
    formData.append('caption', caption.trim());
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:8000/api/v1/post/addpost',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setPosts([ response.data.post,...posts])); // Update Redux store
        toast.success(response.data.message);
        setCaption('');
        setImagePreview('');
        setFile(null);
        setOpen(false); // Close the dialog after successful submission
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create post.';
      toast.error(errorMessage);
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.profilepic} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600">{user?.bio}</span>
          </div>
        </div>

        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img src={imagePreview} alt="Preview" className="object-cover w-full rounded-md" />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-blue-500 hover:bg-blue-300">
          Select From Device
        </Button>

        {imagePreview && (
          <Button
            type="submit"
            onClick={createPostHandler}
            className="w-full mt-4 bg-green-500 hover:bg-green-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Post'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
