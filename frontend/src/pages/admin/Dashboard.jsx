import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { FiUsers, FiBriefcase, FiFileText, FiStar } from 'react-icons/fi';
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
      <h1 className="admin-dashboard-title">Tổng quan hệ thống</h1>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.users.total}</div>
            <div className="stat-label">Tổng người dùng</div>
            {stats.users.admins > 0 && (
              <div className="stat-detail">{stats.users.admins} quản trị viên</div>
            )}
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <FiBriefcase />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.jobs.total}</div>
            <div className="stat-label">Tổng công việc</div>
            <div className="stat-detail">
              {stats.jobs.open} đang mở, {stats.jobs.completed} hoàn thành
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <FiFileText />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.applications.total}</div>
            <div className="stat-label">Tổng đơn ứng tuyển</div>
            <div className="stat-detail">
              {stats.applications.pending} đang chờ
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <FiStar />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.reviews.total}</div>
            <div className="stat-label">Tổng đánh giá</div>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <section className="admin-section">
          <h2 className="section-title">Công việc theo trạng thái</h2>
          <div className="status-grid">
            <div className="status-item status-open">
              <div className="status-value">{stats.jobs.open}</div>
              <div className="status-label">Đang mở</div>
            </div>
            <div className="status-item status-assigned">
              <div className="status-value">{stats.jobs.assigned}</div>
              <div className="status-label">Đã giao</div>
            </div>
            <div className="status-item status-completed">
              <div className="status-value">{stats.jobs.completed}</div>
              <div className="status-label">Hoàn thành</div>
            </div>
            <div className="status-item status-cancelled">
              <div className="status-value">{stats.jobs.cancelled}</div>
              <div className="status-label">Đã hủy</div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Đơn ứng tuyển theo trạng thái</h2>
          <div className="status-grid">
            <div className="status-item status-pending">
              <div className="status-value">{stats.applications.pending}</div>
              <div className="status-label">Đang chờ</div>
            </div>
            <div className="status-item status-accepted">
              <div className="status-value">{stats.applications.accepted}</div>
              <div className="status-label">Đã chấp nhận</div>
            </div>
            <div className="status-item status-rejected">
              <div className="status-value">{stats.applications.rejected}</div>
              <div className="status-label">Đã từ chối</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
