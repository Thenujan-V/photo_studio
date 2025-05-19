import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { decodedToken } from '../Services/getToken ';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const decode = decodedToken()
  const role = decode.role

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace  />;
};

export default ProtectedRoute;