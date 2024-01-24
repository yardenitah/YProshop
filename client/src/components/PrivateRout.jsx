// client/src/components/PrivateRout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRout() {
  // the userInfo is in the auth state.
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRout;
