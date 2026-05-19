import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStatistics();
      setStats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        <h2>Lỗi</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.users.total}</div>
            <div className="stat-label">Total Users</div>
            {stats.users.admins > 0 && (
              <div className="stat-detail">{stats.users.admins} admins</div>
            )}
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <div className="stat-value">{stats.jobs.total}</div>
            <div className="stat-label">Total Jobs</div>
            <div className="stat-detail">
              {stats.jobs.open} open, {stats.jobs.completed} completed
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.applications.total}</div>
            <div className="stat-label">Total Applications</div>
            <div className="stat-detail">
              {stats.applications.pending} pending
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.reviews.total}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <section className="admin-section">
          <h2 className="section-title">Jobs by Status</h2>
          <div className="status-grid">
            <div className="status-item status-open">
              <div className="status-value">{stats.jobs.open}</div>
              <div className="status-label">Open</div>
            </div>
            <div className="status-item status-assigned">
              <div className="status-value">{stats.jobs.assigned}</div>
              <div className="status-label">Assigned</div>
            </div>
            <div className="status-item status-completed">
              <div className="status-value">{stats.jobs.completed}</div>
              <div className="status-label">Completed</div>
            </div>
            <div className="status-item status-cancelled">
              <div className="status-value">{stats.jobs.cancelled}</div>
              <div className="status-label">Cancelled</div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Applications by Status</h2>
          <div className="status-grid">
            <div className="status-item status-pending">
              <div className="status-value">{stats.applications.pending}</div>
              <div className="status-label">Pending</div>
            </div>
            <div className="status-item status-accepted">
              <div className="status-value">{stats.applications.accepted}</div>
              <div className="status-label">Accepted</div>
            </div>
            <div className="status-item status-rejected">
              <div className="status-value">{stats.applications.rejected}</div>
              <div className="status-label">Rejected</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
