import {
    Heart,
    Home,
    LogOut,
    MessageCircle,
    PlusSquare,
    Search,
    TrendingUp,
  } from 'lucide-react';
  import React, { useState } from 'react';
  import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
  import { toast } from 'sonner';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { setAuthUser } from '@/redux/authSlice';
  import CreatePost from './CreatePost';
  import { setPosts, setSelectedPost } from '@/redux/postSlice';
  import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
  
  const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { likeNotification } = useSelector((store) => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
  
    const logoutHandler = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAuthUser(null));
          dispatch(setSelectedPost(null));
          dispatch(setPosts([]));
          navigate('/login');
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Logout failed');
      }
    };
  
    const sidebarHandler = (textType) => {
      switch (textType) {
        case 'Logout':
          logoutHandler();
          break;
        case 'Create':
          setOpen(true);
          break;
        case 'Profile':
          navigate(`/profile/${user?._id}`);
          break;
        case 'Home':
          navigate('/');
          break;
        case 'Messages':
          navigate('/chat');
          break;
        default:
          break;
      }
    };
  
    const sidebarItems = [
      { icon: <Home size={22} />, text: 'Home' },
      { icon: <Search size={22} />, text: 'Search' },
      { icon: <TrendingUp size={22} />, text: 'Explore' },
      { icon: <MessageCircle size={22} />, text: 'Messages' },
      {
        icon: (
          <div className='relative'>
            <Heart size={22} />
            {likeNotification.length > 0 && (
              <span className='absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                {likeNotification.length}
              </span>
            )}
          </div>
        ),
        text: 'Notifications',
      },
      { icon: <PlusSquare size={22} />, text: 'Create' },
      {
        icon: (
          <Avatar className='w-6 h-6'>
            <AvatarImage src={user?.profilePicture} alt='@user' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        text: 'Profile',
      },
      { icon: <LogOut size={22} />, text: 'Logout' },
    ];
  
    return (
      <>
        {/* Desktop Sidebar */}
        <aside className='hidden sm:flex flex-col fixed top-0 left-0 px-5 py-6 border-r border-gray-200 dark:border-zinc-800 w-[16%] h-screen bg-white dark:bg-zinc-900 shadow-sm'>
          <h1 className='text-2xl font-bold mb-8 text-blue-600 dark:text-blue-400'>
            SyncroLink
          </h1>
          <nav className='flex flex-col gap-5'>
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className='flex items-center gap-4 hover:bg-blue-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-lg cursor-pointer transition-colors relative text-gray-700 dark:text-gray-300'
              >
                {item.icon}
                <span className='text-sm font-medium'>{item.text}</span>
                {item.text === 'Notifications' && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className='absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full' />
                    </PopoverTrigger>
                    <PopoverContent className='w-64 dark:bg-zinc-900 dark:border-zinc-700'>
                      <h3 className='font-semibold mb-2 text-gray-800 dark:text-gray-200'>
                        New Likes
                      </h3>
                      {likeNotification.map((n) => (
                        <div key={n.userId} className='flex items-center gap-2 my-2'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage src={n.userDetails?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className='text-sm text-gray-700 dark:text-gray-300'>
                            <span className='font-bold'>{n.userDetails?.username}</span> liked your post
                          </p>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </nav>
        </aside>
  
        {/* Mobile Bottom Navbar */}
        <div className='sm:hidden fixed bottom-0 left-0 z-50 w-full border-t border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-around items-center py-2'>
          {['Home', 'Messages', 'Create', 'Profile'].map((label, idx) => (
            <div
              key={idx}
              onClick={() => sidebarHandler(label)}
              className='flex flex-col items-center text-[10px] text-gray-700 dark:text-gray-300 cursor-pointer'
            >
              {label === 'Home' && <Home className='w-5 h-5' />}
              {label === 'Messages' && <MessageCircle className='w-5 h-5' />}
              {label === 'Create' && <PlusSquare className='w-5 h-5' />}
              {label === 'Profile' && (
                <Avatar className='w-5 h-5'>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <span>{label}</span>
            </div>
          ))}
        </div>
  
        {/* Create Post Modal */}
        <CreatePost open={open} setOpen={setOpen} />
      </>
    );
  };
  
  export default LeftSidebar;
  