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
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRIders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import ForbiddenPage from "../Pages/ForbiddenPage/ForbiddenPage";
import AdminRoutes from "./AdminRoutes/AdminRoutes";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import RiderRoutes from "./RiderRoutes/RiderRoutes";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../Pages/Dashboard/MyEarnings/MyEarnings";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "coverage",
        element: <Coverage />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/beArider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
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
        path: "signin",
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
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index : true,
        Component : DashboardHome
      },
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "pendingRiders",
        Component: PendingRiders,
      },
      // Riders Routes//
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoutes>
            <PendingDeliveries />
          </RiderRoutes>
        ),
      },
      {
        path: "completeDeliveries",
        element: (
          <RiderRoutes>
            <CompletedDeliveries />
          </RiderRoutes>
        ),
      },
      {
        path: "earnings",
        element: (
          <RiderRoutes>
            <MyEarnings />
          </RiderRoutes>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoutes>
            <AssignRider />
          </AdminRoutes>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoutes>
            <ActiveRiders />
          </AdminRoutes>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoutes>
            <MakeAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "payment/:id",
        element: <Payment />,
      },
    ],
  },
]);
