import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import { useSelector } from 'react-redux'

const MainLayout = () => {

  const {user} = useSelector(store => store.auth); 
  const navigate = useNavigate() ; 

  useEffect(() => {
    if(!user){
      navigate('/login');
    }
  },[user,navigate])

   
  return (
    <div>
        <LeftSideBar/>
       <div>
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default MainLayout