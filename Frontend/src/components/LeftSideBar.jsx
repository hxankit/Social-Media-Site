import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { useState } from 'react';
import CreatePost from './CreatePost';
import { setPosts, setselectedPost } from '@/redux/postSlice';

const LeftSideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false)
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setselectedPost(null))
                dispatch(setPosts([]))
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to logout');
        }
    };

    const sidebarHandler = (textType) => {
        if (textType.toLowerCase() === 'logout') {
            logoutHandler();
        } else if (textType.toLowerCase() === 'create') {
            setOpen(true)
        } else if (textType.toLowerCase() === 'profile') {
            navigate(`/profile/${user?.userId}`)
        }
    };

    const sideBarItems = [
        { Icon: <Home />, text: "Home" },
        { Icon: <Search />, text: "Search" },
        { Icon: <MessageCircle />, text: "Messages" },
        { Icon: <Heart />, text: "Notification" },
        { Icon: <PlusSquare />, text: "Create" },
        {
            Icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilepic || ''} alt="Profile" />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile",
        },
        { Icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className="fixed top-0 z-10 left-0 px-4 border-2 border-gray-300 w-[16%] h-screen">
            <div className="flex flex-col">
                <h1 className="my-5 pl-8 pt-4 font-bold text-xl">SyncroLink</h1>
                <div>
                    {sideBarItems.map((item, index) => (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            key={index}
                            className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                            aria-label={item.text}
                        >
                            {item.Icon}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSideBar;
