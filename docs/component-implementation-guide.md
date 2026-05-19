# JobConnect - Component Implementation Guide

React components based on JobConnect design style

---

## Setup

### 1. Install Dependencies
```bash
npm install react-router-dom axios react-icons
```

### 2. Create CSS Variables File

**src/styles/variables.css**
```css
:root {
  /* Primary Colors */
  --primary-blue: #0066FF;
  --primary-blue-dark: #0052CC;
  --primary-blue-light: #E6F2FF;
  
  /* Neutral Colors */
  --white: #FFFFFF;
  --gray-50: #F8F9FA;
  --gray-100: #F1F3F5;
  --gray-200: #E9ECEF;
  --gray-300: #DEE2E6;
  --gray-500: #ADB5BD;
  --gray-700: #495057;
  --gray-900: #212529;
  
  /* Semantic Colors */
  --success: #28A745;
  --warning: #FFC107;
  --danger: #DC3545;
  --info: #17A2B8;
  
  /* Spacing */
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 16px;
  color: var(--gray-700);
  background: var(--gray-50);
}
```

### 3. Import in App.js
```javascript
import './styles/variables.css';
```

---

## Core Components

### 1. Button Component

**src/components/common/Button.jsx**
```jsx
import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  type = 'button',
  fullWidth = false,
  loading = false
}) => {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <>
          <span className="spinner-small"></span>
          {children}
        </>
      ) : children}
    </button>
  );
};

export default Button;
```

**src/components/common/Button.css**
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: var(--radius-md);
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-blue-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary-blue-light);
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-md {
  padding: 12px 24px;
  font-size: 16px;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 18px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-full {
  width: 100%;
}

.btn-loading {
  opacity: 0.7;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Usage:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" loading={isLoading}>
  Submit
</Button>
```

---

### 2. Input Component

**src/components/common/Input.jsx**
```jsx
import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  disabled = false,
  icon,
  required = false
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${icon ? 'has-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${error ? 'error' : ''}`}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default Input;
```

**src/components/common/Input.css**
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.required {
  color: var(--danger);
}

.input-wrapper {
  position: relative;
}

.input-wrapper.has-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  font-size: 20px;
  pointer-events: none;
}

.has-icon .input {
  padding-left: 44px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--gray-900);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  transition: all 0.2s;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--primary-blue-light);
}

.input::placeholder {
  color: var(--gray-500);
}

.input:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--danger);
}

.form-error {
  display: block;
  font-size: 12px;
  color: var(--danger);
  margin-top: 4px;
}
```

**Usage:**
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  required
  error={errors.email}
/>
```

---

### 3. Card Component

**src/components/common/Card.jsx**
```jsx
import React from 'react';
import './Card.css';

const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
```

**src/components/common/Card.css**
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.card-hover {
  transition: all 0.3s;
  cursor: pointer;
}

.card-hover:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

---

### 4. Badge Component

**src/components/common/Badge.jsx**
```jsx
import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'primary' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
```

**src/components/common/Badge.css**
```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
}

.badge-primary {
  background: var(--primary-blue-light);
  color: var(--primary-blue);
}

.badge-success {
  background: #D4EDDA;
  color: var(--success);
}

.badge-warning {
  background: #FFF3CD;
  color: #856404;
}

.badge-danger {
  background: #F8D7DA;
  color: var(--danger);
}

/* Job status badges */
.badge-open {
  background: var(--primary-blue-light);
  color: var(--primary-blue);
}

.badge-assigned {
  background: #FFF3CD;
  color: #856404;
}

.badge-completed {
  background: #D4EDDA;
  color: var(--success);
}

.badge-cancelled {
  background: #F8D7DA;
  color: var(--danger);
}
```

---

### 5. Navbar Component

**src/components/layout/Navbar.jsx**
```jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="logo">JobConnect</Link>
        </div>
        
        <nav className="navbar-menu">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/jobs" className="nav-link">Tìm việc</Link>
          {user && (
            <>
              <Link to="/my-jobs" className="nav-link">Công việc của tôi</Link>
              <Link to="/applications" className="nav-link">Ứng tuyển</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="user-name">Xin chào, {user.name}</span>
              <Link to="/profile">
                <div className="user-avatar">{user.name[0]}</div>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
```

**src/components/layout/Navbar.css**
```css
.navbar {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-700);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-blue);
}

.navbar-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-name {
  font-size: 14px;
  color: var(--gray-700);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
}
```

---

### 6. JobCard Component

**src/components/job/JobCard.jsx**
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdAccessTime, MdPerson } from 'react-icons/md';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './JobCard.css';

const JobCard = ({ job }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Delivery': '📦',
      'Cleaning': '🧹',
      'Tutoring': '📚',
      'Tech Support': '💻',
      'Other': '⭐'
    };
    return icons[category] || '⭐';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <span className="job-icon">{getCategoryIcon(job.category)}</span>
        <Badge variant="primary">{job.category}</Badge>
        <Badge variant={job.status.toLowerCase()}>{job.status}</Badge>
      </div>

      <h3 className="job-title">{job.title}</h3>
      
      <p className="job-description">
        {job.description.length > 100 
          ? job.description.substring(0, 100) + '...' 
          : job.description}
      </p>

      <div className="job-meta">
        <span>
          <MdLocationOn /> {job.location}
        </span>
        <span>
          <MdAccessTime /> {getTimeAgo(job.createdAt)}
        </span>
        <span>
          <MdPerson /> {job.poster?.name || 'N/A'}
        </span>
      </div>

      <div className="job-footer">
        <div className="job-price">
          {formatPrice(job.salary)}
          <span>/giờ</span>
        </div>
        <div className="job-actions">
          <Link to={`/jobs/${job._id}`} className="link">
            Xem chi tiết
          </Link>
          {job.status === 'OPEN' && (
            <Link to={`/jobs/${job._id}`}>
              <Button variant="primary" size="sm">Ứng tuyển ngay</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
```

**src/components/job/JobCard.css**
```css
.job-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.job-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.job-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.job-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue-light);
  border-radius: var(--radius-md);
  font-size: 20px;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
  line-height: 1.3;
}

.job-description {
  font-size: 14px;
  color: var(--gray-500);
  margin-bottom: 12px;
  line-height: 1.5;
  flex-grow: 1;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: var(--gray-500);
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-200);
}

.job-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
}

.job-price span {
  font-size: 14px;
  font-weight: 400;
  color: var(--gray-500);
}

.job-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link {
  font-size: 14px;
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
```

---

### 7. Modal Component

**src/components/common/Modal.jsx**
```jsx
import React from 'react';
import { MdClose } from 'react-icons/md';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
```

**src/components/common/Modal.css**
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gray-500);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--gray-900);
}

.modal-body {
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 8. Rating Component

**src/components/common/Rating.jsx**
```jsx
import React from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import './Rating.css';

const Rating = ({ value, total = 5, size = 'md', showScore = true, interactive = false, onChange }) => {
  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`rating rating-${size}`}>
      {[...Array(total)].map((_, index) => (
        <span 
          key={index}
          className={`star ${index < value ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => handleClick(index)}
        >
          {index < value ? <MdStar /> : <MdStarBorder />}
        </span>
      ))}
      {showScore && value > 0 && (
        <span className="rating-score">{value.toFixed(1)}</span>
      )}
    </div>
  );
};

export default Rating;
```

**src/components/common/Rating.css**
```css
.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: var(--gray-300);
  display: flex;
}

.star.filled {
  color: #FFC107;
}

.star.interactive {
  cursor: pointer;
}

.star.interactive:hover {
  color: #FFD54F;
}

.rating-sm .star {
  font-size: 16px;
}

.rating-md .star {
  font-size: 20px;
}

.rating-lg .star {
  font-size: 24px;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-left: 4px;
}
```

---

## Page Examples

### Login Page

**src/pages/Login.jsx**
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErrors({ general: error.message || 'Đăng nhập thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-header">
            <h1>JobConnect</h1>
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              error={errors.email}
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={errors.password}
            />

            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              loading={loading}
            >
              Đăng nhập
            </Button>

            <div className="login-footer">
              <span>Chưa có tài khoản?</span>
              <Link to="/register">Đăng ký ngay</Link>
            </div>
          </form>
        </div>

        <div className="login-illustration">
          <div className="illustration-content">
            <h3>Việc làm tốt,<br />tương lai bắt đầu.</h3>
            <p>Kết nối với hàng ngàn cơ hội việc làm ngắn hạn phù hợp với bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

**src/pages/Login.css**
```css
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  padding: 20px;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.login-form-section {
  padding: 48px;
}

.login-header {
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 4px;
}

.login-header p {
  color: var(--gray-500);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  padding: 12px;
  background: #F8D7DA;
  color: var(--danger);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: var(--gray-500);
}

.login-footer a {
  color: var(--primary-blue);
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.login-illustration {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-content {
  color: white;
  text-align: center;
}

.illustration-content h3 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.3;
}

.illustration-content p {
  font-size: 16px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-illustration {
    display: none;
  }

  .login-form-section {
    padding: 32px 24px;
  }
}
```

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Install dependencies
- [ ] Create CSS variables file
- [ ] Setup folder structure
- [ ] Import fonts

### Phase 2: Core Components
- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Badge component
- [ ] Modal component
- [ ] Rating component

### Phase 3: Layout Components
- [ ] Navbar
- [ ] Footer
- [ ] Container/Layout wrapper

### Phase 4: Feature Components
- [ ] JobCard
- [ ] JobList
- [ ] JobFilter
- [ ] ApplicationCard
- [ ] ReviewCard

### Phase 5: Pages
- [ ] Home page
- [ ] Login/Register pages
- [ ] Job list page
- [ ] Job detail page
- [ ] Create/Edit job pages
- [ ] Profile page
- [ ] Admin dashboard

### Phase 6: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Accessibility

---

## Tips

1. **Reusability**: Build small, reusable components
2. **Consistency**: Use design tokens (CSS variables) everywhere
3. **Responsive**: Test on mobile, tablet, desktop
4. **Performance**: Lazy load images, code splitting
5. **Accessibility**: Use semantic HTML, ARIA labels
