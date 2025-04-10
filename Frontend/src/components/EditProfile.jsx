import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector(store => store.auth);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture);

  const [input, setInput] = useState({
    profilePhoto: null,
    bio: user?.bio || '',
    gender: user?.gender || '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });

      // Live preview
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto) {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedUser = {
          ...user,
          bio: res.data.user.bio,
          profilePicture: res.data.user.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUser));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="text-xl font-bold">Edit Profile</h1>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-xl p-4 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar className="h-16 w-16">
              <AvatarImage src={previewUrl} alt="Profile Preview" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-xs">{user?.bio || 'No bio yet'}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-left">
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="hidden"
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="bg-[#0095F6] h-8 hover:bg-[#318bc7] w-full sm:w-auto"
            >
              Change Photo
            </Button>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block font-bold text-sm mb-1">
            Bio
          </label>
          <Textarea
            id="bio"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="focus-visible:ring-0"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Optional: Gender field */}
        {/* <div>
          <label className="block font-bold text-sm mb-1">Gender</label>
          <Select onValueChange={selectChangeHandler} defaultValue={input.gender}>
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        <div className="flex justify-end">
          {loading ? (
            <Button className="bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Save Changes
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
