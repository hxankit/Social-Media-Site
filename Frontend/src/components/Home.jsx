import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebarbar from './rightSidebar.jsx';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Feed and nested routes */}
      <div className="flex-grow w-full lg:w-[75%]">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar - hidden on smaller screens */}
      <div className="hidden lg:block w-[25%]">
        <RightSidebarbar />
      </div>
    </div>
  );
};

export default Home;
