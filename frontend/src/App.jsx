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

const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
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
  return (
    <div>
      <RouterProvider router={browserRouter}/>
    </div>
  )
}
