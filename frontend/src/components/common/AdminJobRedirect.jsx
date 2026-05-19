import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Component wrapper cho JobDetail
 * Admin có thể xem chi tiết job, user thông thường cũng có thể
 */
const AdminJobRedirect = ({ children }) => {
  // Admin được phép xem job detail, nên không cần redirect
  return children;
};

export default AdminJobRedirect;
