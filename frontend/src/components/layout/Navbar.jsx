import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

  const getNavLinkClass = ({ isActive }) =>
    `navbar-link ${isActive ? 'navbar-link-active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          JobConnect
        </Link>

        <div className="navbar-links">
          {!isAdmin && (
            <>
              <NavLink to="/" end className={getNavLinkClass}>Trang chủ</NavLink>
              <NavLink to="/jobs" end className={getNavLinkClass}>Tìm việc</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/jobs/create" className={getNavLinkClass}>Đăng việc</NavLink>
                  <NavLink to="/profile" className={getNavLinkClass}>Hồ sơ</NavLink>
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
