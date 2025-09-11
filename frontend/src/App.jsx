import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUsers.jsx'
import {io} from "socket.io-client"
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  getCurrentUser()
  getOtherUsers()
  let {userData , socket, onlineUsers} = useSelector(state=>state.user)
  let dispatch = useDispatch()

useEffect(() => {
  if (!userData?._id) return;  

  if(userData){
       const socketio = io(`${serverUrl}`, {
          query: { userId: userData._id }
        });

      dispatch(setSocket(socketio))

        socketio.on("getOnlineUsers", (users)=>{
            dispatch(setOnlineUsers(users))
        })

      return () => {
        socketio.close(); 
      }
      }else{
        if(socket){
          socket.close()
          dispatch(setSocket(null))
        }
      }
    }, [userData]);

  
  return (
    <div >
      
      <Routes>
        <Route path='/signup'  element={!userData? <SignUp/>:<Navigate to="/profile" /> } />
        <Route path='/login'  element={!userData? <Login/>:<Navigate to="/" /> } />
        <Route path='/' element={userData? <Home/>:<Navigate to="/login" /> } />
        <Route path='/profile' element={userData? <Profile/>:<Navigate to="/signup" /> } />

      </Routes>
    </div>
  )
}

export default App