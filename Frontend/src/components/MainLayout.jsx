import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { showMainLayoutExtras } from '@/redux/extrasSlice'

const MainLayout = () => {
  const showExtras = useSelector((state) => state.extras.showMainLayoutExtras);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(showMainLayoutExtras())
  },[dispatch])

  return (
    <div>
         {showExtras ? <LeftSidebar/>:""}
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout