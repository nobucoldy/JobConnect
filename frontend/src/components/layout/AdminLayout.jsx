import React from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBarChart2, FiUsers, FiBriefcase } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiBarChart2 />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiUsers />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/admin/jobs"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiBriefcase />
            <span>Jobs</span>
          </NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
