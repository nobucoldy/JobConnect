import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await adminService.getAllJobs(params);
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'OPEN': 'success',
      'ASSIGNED': 'info',
      'COMPLETED': 'default',
      'CANCELLED': 'danger'
    };
    return variants[status] || 'default';
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo(0, 0);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="admin-jobs-loading">
        <div className="spinner"></div>
        <p>Đang tải danh sách công việc...</p>
      </div>
    );
  }

  return (
    <div className="admin-jobs">
      <div className="admin-jobs-header">
        <h1 className="admin-jobs-title">Jobs Management</h1>
        <div className="admin-jobs-filters">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="admin-jobs-error">
          <p>{error}</p>
          <button onClick={fetchJobs} className="btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {jobs.length === 0 && !loading ? (
        <div className="admin-jobs-empty">
          <p>Không tìm thấy công việc</p>
        </div>
      ) : (
        <>
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Poster</th>
                  <th>Worker</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="job-title-cell">
                      <span className="job-title-text">{job.title}</span>
                    </td>
                    <td>{job.category}</td>
                    <td>
                      <Link
                        to={`/profile/${job.poster._id}`}
                        className="user-link"
                      >
                        {job.poster.name}
                      </Link>
                    </td>
                    <td>
                      {job.assignedWorker ? (
                        <Link
                          to={`/profile/${job.assignedWorker._id}`}
                          className="user-link"
                        >
                          {job.assignedWorker.name}
                        </Link>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="salary-cell">
                      {formatCurrency(job.salary)} đ
                    </td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-view-job"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
