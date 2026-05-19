import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: 'var(--primary-blue)', marginBottom: '16px' }}>
        Welcome to JobConnect
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--gray-600)', marginBottom: '32px' }}>
        Find jobs or hire workers for short-term tasks
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <a href="/jobs" style={{
          background: 'var(--primary-blue)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          textDecoration: 'none'
        }}>
          Find Jobs
        </a>
        <a href="/login" style={{
          background: 'white',
          color: 'var(--primary-blue)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          textDecoration: 'none',
          border: '2px solid var(--primary-blue)'
        }}>
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
