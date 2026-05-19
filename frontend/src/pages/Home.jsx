import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: 'var(--primary-blue)', marginBottom: '16px' }}>
        Welcome to JobConnect
      </h1>
      {isAuthenticated && (
        <p style={{ fontSize: '20px', color: 'var(--neutral-700)', marginBottom: '16px' }}>
          Xin chào, {user?.name}!
        </p>
      )}
      <p style={{ fontSize: '18px', color: 'var(--neutral-600)', marginBottom: '32px' }}>
        Find jobs or hire workers for short-term tasks
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/jobs" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">
            Tìm việc
          </Button>
        </Link>
        {isAuthenticated ? (
          <Link to="/my-jobs" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">
              Công việc của tôi
            </Button>
          </Link>
        ) : (
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">
              Đăng ký ngay
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
