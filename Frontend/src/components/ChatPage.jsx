import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, ArrowLeft } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { hideMainLayoutExtras, showMainLayoutExtras } from '@/redux/extrasSlice';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
          dispatch(showMainLayoutExtras());
        };
      }, []);
      

   function handleChat (User)  {
        dispatch(setSelectedUser(User))
        dispatch(hideMainLayoutExtras())
        navigate("/chat")
    }

  
    return (
        <div className='flex h-screen'>
            {/* User List */}
            <section className={`w-full sm:w-1/4 border-r border-gray-300 ${selectedUser ? 'hidden sm:block' : 'block'}`}>
                <h1 className='font-bold my-4 px-4 text-xl'>{user?.username}</h1>
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div
                                    key={suggestedUser._id}
                                    onClick={() => handleChat(suggestedUser)}
                                    className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
                                >
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            {/* Chat Section */}
            {
                selectedUser && (
                    <section className='flex flex-col flex-1 h-full'>
                        {/* Header with back for mobile */}
                        <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <div className='sm:hidden'>
                                <Button variant="ghost" size="icon" onClick={() => {
    dispatch(setSelectedUser(null));
    dispatch(showMainLayoutExtras());
  }}>
                                    <ArrowLeft className='w-5 h-5' />
                                </Button>
                            </div>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <Messages selectedUser={selectedUser} />

                        {/* Input */}
                        <div className='flex items-center p-4 border-t border-gray-300'>
                            <Input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                type='text'
                                className='flex-1 mr-2 focus-visible:ring-transparent'
                                placeholder='Messages...'
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                )
            }

            {/* Empty State (Desktop only) */}
            {
                !selectedUser && (
                    <div className='hidden sm:flex flex-col items-center justify-center flex-1'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    );
};

export default ChatPage;
