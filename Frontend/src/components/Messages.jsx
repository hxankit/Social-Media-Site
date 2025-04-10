import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  return (
    <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-white'>
      {messages?.length ? (
        messages.map((msg) => {
          const isSender = msg.senderId === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && (
                <Avatar className='w-7 h-7 mr-2'>
                  <AvatarImage src={selectedUser?.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`px-4 py-2 rounded-xl text-sm max-w-xs break-words shadow-md ${
                  isSender
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })
      ) : (
        <p className='text-center text-gray-400 text-sm mt-4'>No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
