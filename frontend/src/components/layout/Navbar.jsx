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
          {!isAdmin && (
            <>
              <Link to="/" className="navbar-link">Trang chủ</Link>
              <Link to="/jobs" className="navbar-link">Tìm việc</Link>
              {isAuthenticated && (
                <>
                  <Link to="/jobs/create" className="navbar-link">Đăng việc</Link>
                  <Link to="/profile" className="navbar-link">Hồ sơ</Link>
                </>
              )}
            </>
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
            <div className="navbar-auth-buttons">
              <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
