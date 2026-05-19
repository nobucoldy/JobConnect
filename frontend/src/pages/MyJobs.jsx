import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useToast } from '../context/ToastContext';
import JobCard from '../components/job/JobCard';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import './MyJobs.css';

const MyJobs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể tải công việc của bạn';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    return {
      ALL: jobs.length,
      OPEN: jobs.filter(job => job.status === 'OPEN').length,
      ASSIGNED: jobs.filter(job => job.status === 'ASSIGNED').length,
      COMPLETED: jobs.filter(job => job.status === 'COMPLETED').length,
      CANCELLED: jobs.filter(job => job.status === 'CANCELLED').length
    };
  };

  const getFilteredJobs = () => {
    if (statusFilter === 'ALL') return jobs;
    return jobs.filter(job => job.status === statusFilter);
  };

  const stats = getStatusStats();
  const filteredJobs = getFilteredJobs();

  if (loading) {
    return (
      <div className="my-jobs-page">
        <div className="my-jobs-loading">
          <Spinner size="lg" />
          <p>Đang tải công việc của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-jobs-page">
      <div className="my-jobs-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Công việc của tôi</h1>
            <p>Quản lý các công việc bạn đã đăng</p>
          </div>
          <Button onClick={() => navigate('/jobs/create')}>
            + Đăng việc mới
          </Button>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️ {error}</span>
            <button onClick={fetchMyJobs}>Thử lại</button>
          </div>
        )}

        <div className="stats-section">
          <div className="stat-card" onClick={() => setStatusFilter('ALL')}>
            <div className="stat-number">{stats.ALL}</div>
            <div className="stat-label">Tất cả</div>
          </div>
          <div className="stat-card stat-open" onClick={() => setStatusFilter('OPEN')}>
            <div className="stat-number">{stats.OPEN}</div>
            <div className="stat-label">Đang mở</div>
          </div>
          <div className="stat-card stat-assigned" onClick={() => setStatusFilter('ASSIGNED')}>
            <div className="stat-number">{stats.ASSIGNED}</div>
            <div className="stat-label">Đã giao</div>
          </div>
          <div className="stat-card stat-completed" onClick={() => setStatusFilter('COMPLETED')}>
            <div className="stat-number">{stats.COMPLETED}</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
          <div className="stat-card stat-cancelled" onClick={() => setStatusFilter('CANCELLED')}>
            <div className="stat-number">{stats.CANCELLED}</div>
            <div className="stat-label">Đã hủy</div>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Tất cả ({stats.ALL})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'OPEN' ? 'active' : ''}`}
            onClick={() => setStatusFilter('OPEN')}
          >
            Đang mở ({stats.OPEN})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'ASSIGNED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ASSIGNED')}
          >
            Đã giao ({stats.ASSIGNED})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            Hoàn thành ({stats.COMPLETED})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CANCELLED')}
          >
            Đã hủy ({stats.CANCELLED})
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <EmptyState
            icon="📋"
            title={
              jobs.length === 0
                ? 'Chưa có công việc nào'
                : `Không có công việc ${statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()}`
            }
            message={
              jobs.length === 0
                ? 'Bắt đầu đăng công việc đầu tiên của bạn'
                : 'Thử chọn bộ lọc khác'
            }
            action={
              jobs.length === 0 && (
                <Button onClick={() => navigate('/jobs/create')}>
                  Đăng việc ngay
                </Button>
              )
            }
          />
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
