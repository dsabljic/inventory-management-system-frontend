import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import NotFoundPage from "./components/misc/NotFoundPage";

import LoginPage from "./components/auth/LoginPage";
import RegistrationPage from "./components/auth/RegistrationPage";

import UserManagementPage from "./components/user/UserManagement";
import UserService from "./service/UserService";
import CreateUser from "./components/user/CreateUser";
import UpdateUser from "./components/user/UpdateUser";
import UpdateAdmin from "./components/user/UpdateAdmin";
import ProfilePage from "./components/user/ProfilePage";

import ItemTypeManagement from "./components/item_type/ItemTypeManagement";
import CreateItemType from "./components/item_type/CreateItemType";
import UpdateItemType from "./components/item_type/UpdateItemType";

import ItemManagement from "./components/item/ItemManagement";
import CreateItem from "./components/item/CreateItem";
import UpdateItem from "./components/item/UpdateItem";
import UserItemManagement from "./components/item/UserItemManagement";

import AdminRequestManagement from "./components/request/AdminRequestManagement";
import RequestForm from "./components/request/RequestForm";
import UserRequestManagement from "./components/request/UserRequestManagement";

import VerificationPage from "./components/auth/VerificationPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

import RoomManagement from "./components/room/RoomManagement";
import CreateRoom from "./components/room/CreateRoom";
import UpdateRoom from "./components/room/UpdateRoom";
import RoomInfo from "./components/room/RoomInfo";
import RoomHistory from "./components/room/RoomHistory";

import AdminReservationManagement from "./components/reservation/AdminReservationManagement";
import UserReservationManagement from "./components/reservation/UserReservationManagement";

const ProtectedRoute = ({ children }) => {
  if (!UserService.isAuthenticated() || UserService.isPendingUser()) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  if (!UserService.isAdmin()) {
    return <Navigate to="/not-found" />;
  }
  return children;
};

const PendingUserRoute = ({ children }) => {
  if (!UserService.isPendingUser()) {
    return <Navigate to="/not-found" />;
  }
  return children;
};

const NotSignedInRoute = ({ children }) => {
  if (UserService.isAuthenticated()) {
    return <Navigate to="/not-found" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UserManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="/users/create"
              element={
                <AdminRoute>
                  <CreateUser />
                </AdminRoute>
              }
            />
            <Route
              path="/users/update/:userId"
              element={
                <AdminRoute>
                  <UpdateUser />
                </AdminRoute>
              }
            />

            <Route
              path="/item-types"
              element={
                <AdminRoute>
                  <ItemTypeManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/item-types/create"
              element={
                <AdminRoute>
                  <CreateItemType />
                </AdminRoute>
              }
            />
            <Route
              path="/item-types/update/:itemTypeId"
              element={
                <AdminRoute>
                  <UpdateItemType />
                </AdminRoute>
              }
            />

            <Route
              path="/items"
              element={
                <AdminRoute>
                  <ItemManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/items/create"
              element={
                <AdminRoute>
                  <CreateItem />
                </AdminRoute>
              }
            />
            <Route
              path="/items/update/:itemId"
              element={
                <AdminRoute>
                  <UpdateItem />
                </AdminRoute>
              }
            />
            <Route
              path="/all-items"
              element={
                <ProtectedRoute>
                  <UserItemManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <AdminRoute>
                  <AdminRequestManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/request"
              element={
                <ProtectedRoute>
                  <RequestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/requests"
              element={
                <ProtectedRoute>
                  <UserRequestManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile/:adminId"
              element={
                <AdminRoute>
                  <UpdateAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/verification-page"
              element={
                <PendingUserRoute>
                  <VerificationPage />
                </PendingUserRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <NotSignedInRoute>
                  <ForgotPassword />
                </NotSignedInRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <NotSignedInRoute>
                  <ResetPassword />
                </NotSignedInRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/create"
              element={
                <AdminRoute>
                  <CreateRoom />
                </AdminRoute>
              }
            />
            <Route
              path="/rooms/update/:roomId"
              element={
                <AdminRoute>
                  <UpdateRoom />
                </AdminRoute>
              }
            />
            <Route
              path="/rooms/:roomId"
              element={
                <ProtectedRoute>
                  <RoomInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/history/:roomId"
              element={
                <AdminRoute>
                  <RoomHistory />
                </AdminRoute>
              }
            />
            <Route
              path="admin/reservations"
              element={
                <AdminRoute>
                  <AdminReservationManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/user/reservations"
              element={
                <ProtectedRoute>
                  <UserReservationManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
