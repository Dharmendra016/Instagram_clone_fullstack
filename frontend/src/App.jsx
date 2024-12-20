import Login from "./components/Login";
import Signup from "./components/Signup"
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Profile } from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import {io} from "socket.io-client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path:"/",
    element: <ProtectedRoutes><MainLayout/></ProtectedRoutes> ,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:'/profile/:id',
        element:<Profile/>
      },
      {
        path:"/account/edit",
        element:<EditProfile/>
      },
      {
        path:"/chat",
        element:<ChatPage/>,
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
])

export default function App() {
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio)
  useEffect(() => {
    if(user){
      const socketio = io('http://localhost:8000' , {
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers' , (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      })

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }

    }else if( socket){
      socket.close();
      dispatch(setSocket(null));
    }


  },[user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}
