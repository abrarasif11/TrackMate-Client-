import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/Authlayout/Authlayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/", // home
        element: <Home />,
      },
      {
        path: "coverage",
        element: <Coverage />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => fetch("ServiceCenter.json"),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: 
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>,
    children: [
      {
        path : "myParcels",
        Component : MyParcels
      }
    ],
  },
]);
