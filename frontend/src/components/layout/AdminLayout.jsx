import React from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiBarChart2, FiUsers, FiBriefcase, FiSun, FiMoon } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const { isAdmin, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

      <div className="admin-content-wrapper">
        <header className="admin-topbar">
          <span className="admin-topbar-title">JobConnect</span>
          <div className="admin-topbar-right">
            <button
              className="admin-theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <span className="admin-topbar-greeting">
              Xin chào, {user?.name || 'Admin User'}
            </span>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;