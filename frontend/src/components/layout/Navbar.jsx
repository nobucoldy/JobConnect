import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          JobConnect
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Trang chủ</Link>
          <Link to="/jobs" className="navbar-link">Tìm việc</Link>

          {isAuthenticated ? (
            <>
              <Link to="/jobs/create" className="navbar-link">Đăng việc</Link>
              <Link to="/profile" className="navbar-link">Hồ sơ</Link>
              {isAdmin && (
                <Link to="/admin" className="navbar-link navbar-link-admin">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="navbar-link">Đăng nhập</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-username">Xin chào, {user?.name}</span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/register')}>
              Đăng ký ngay
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
