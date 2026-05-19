import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Component để chuyển hướng admin đến trang admin
 * Sử dụng cho các trang mà admin không nên truy cập
 */
const AdminRedirect = ({ children }) => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRedirect;
