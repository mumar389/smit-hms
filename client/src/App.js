import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Dashboard from "./components/admin/dashboard/Dashboard";
import RoomAlloc from "./components/admin/RoomAlloc/RoomAlloc";
import Sidebar from "./components/admin/Navigation/Sidebar";
import Complains from "./components/admin//complaint/Complains";
import Signin from "./components/admin/login/Signin";
import { ToastContainer } from "react-toastify";
import Protected from "./components/admin/Protected";
import Login from "./components/user/login/Login";
import SidebarUsers from "./components/user/Navigation/SidebarUsers";
import AuthUser from "./components/user/AuthUser";
import CreateComplain from "./components/user/Complains/CreateComplain";
import GetComplains from "./components/user/Complains/GetComplains";
import User from "./components/user/Home/User";
import UpdatePassword from "./components/user/Home/UpdatePassword";
import UpdatePasswordAdmin from "./components/admin/dashboard/UpdatePasswordAdmin";
import FetchRoom from "./components/admin/FetchRoom/FetchRoom";
import Notify from "./components/admin/Notifications/Notify";
import ChangeForm from "./components/user/RoomChange/ChangeForm";
import AllRequests from "./components/user/RoomChange/AllRequests";
import AllReq from "./components/admin/RoomChange/AllReq";
import Approve from "./components/Leave/Approve";
import Sign from "./components/warden/login/Sign";
import WardenAuth from "./components/warden/WardenAuth";
import SidebarWarden from "./components/warden/Navigation/SidebarWarden";
import DashboardWarden from "./components/warden/dashboard/DashboardWarden";
import LeaveReq from "./components/warden/Requests/LeaveReq";
import LeaveForm from "./components/user/leaves/LeaveForm";
import Leaves from "./components/user/leaves/Leaves";
import AllLeave from "./components/admin/Leaves/AllLeave";
import UpdatePasswordWarden from "./components/warden/dashboard/UpdatePasswordWarden";
import io from "socket.io-client";
const socket=io("https://smit-hms.vercel.app:8960")
socket.on('connection')
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/signin" element={<Signin />} />
        <Route path="/users/signin" element={<Login />} />
        <Route path="/leave/:id" element={<Approve />} />
        <Route path="/warden/signin" element={<Sign />} />

        <Route
          path="/admin/"
          element={
            <>
              <Protected Component={Sidebar} />
            </>
          }
        >
          <Route
            index
            path="dashboard"
            element={<Protected Component={Dashboard} />}
          />
          <Route
            path="room-alloc"
            element={<Protected Component={RoomAlloc} />}
          />
          <Route
            path="complains"
            element={<Protected Component={Complains} />}
          />
          <Route
            path="update-password"
            element={<Protected Component={UpdatePasswordAdmin} />}
          />
          <Route
            path="fetch-rooms"
            element={<Protected Component={FetchRoom} />}
          />
          <Route
            path="notify-page"
            element={<Protected Component={Notify} socket={socket}/>}
          />
          <Route path="all-req" element={<Protected Component={AllReq} />} />
          <Route
            path="get-leave"
            element={<Protected Component={AllLeave} />}
          />
        </Route>
        <Route
          path="/users/"
          element={
            <>
              <AuthUser Component={SidebarUsers} />
            </>
          }
        >
          <Route path="" index element={<AuthUser Component={User} />} />
          <Route
            path="create-complain"
            element={<AuthUser Component={CreateComplain} socket={socket}/>}
          />
          <Route
            path="get-complains"
            element={<AuthUser Component={GetComplains} />}
          />
          <Route
            path="update-password"
            element={<AuthUser Component={UpdatePassword} />}
          />
          <Route
            path="change-request"
            element={<AuthUser Component={ChangeForm} />}
          />
          <Route
            path="get-request-page"
            element={<AuthUser Component={AllRequests} />}
          />
          <Route path="get-leave-page" element={<AuthUser Component={Leaves} />} />
          <Route
            path="leave-req"
            element={<AuthUser Component={LeaveForm} />}
          />
        </Route>
        <Route
          path="/warden/"
          element={
            <>
              <WardenAuth Component={SidebarWarden} />
            </>
          }
        >
          <Route
            index
            path="dashboard"
            element={<WardenAuth Component={DashboardWarden} />}
          />
          <Route path="get-req" element={<WardenAuth Component={LeaveReq} />} />
          <Route path="new-password" element={<WardenAuth Component={UpdatePasswordWarden} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
