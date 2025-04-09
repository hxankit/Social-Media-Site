import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  return (
    <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
      {messages?.length ? (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-xl text-sm max-w-xs break-words ${
                msg.senderId === user?._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-gray-400 text-sm mt-4'>No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
