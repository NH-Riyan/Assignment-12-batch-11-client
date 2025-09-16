import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayout from "../Layouts/DashboardLayout";
import AddPost from "../Pages/AddPost/AddPost";
import MyPost from "../Pages/MyPost/MyPost";
import CommentPage from "../Pages/CommentPage/CommentPage";
import AddAnnouncements from "../Pages/AddAnnouncements/AddAnnouncement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/auth/login",
        element: <Login></Login>
      },
      {
        path: "/auth/register",
        element: <Register></Register>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: 'myposts',
        element: <MyPost></MyPost>
      }, 
      {
        path: 'myposts/post/comments/:id',
        element: <CommentPage></CommentPage>
      },
      {
        path: 'addpost',
        element: <AddPost></AddPost>
      },
      {
        path:'announcements',
        element:<AddAnnouncements></AddAnnouncements>
      }

    ]
  }
]);
