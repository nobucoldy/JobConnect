import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import { FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

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