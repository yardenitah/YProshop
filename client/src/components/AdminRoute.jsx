// client/src/components/AdminRoute.jsx

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute() {
  // the userInfo is in the auth state.
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default AdminRoute;
