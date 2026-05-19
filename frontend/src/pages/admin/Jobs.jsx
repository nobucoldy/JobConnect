import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import './Jobs.css';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
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

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    setDeleteLoading(jobId);
    try {
      await adminService.deleteJob(jobId);
      setShowDeleteConfirm(null);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa công việc');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="admin-jobs-loading">
        <div className="spinner"></div>
        <p>Đang tải danh sách công việc...</p>
      </div>
    );
  }

  const getStatusLabel = (status) => {
    const labels = {
      'OPEN': 'Đang mở',
      'ASSIGNED': 'Đã giao',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return labels[status] || status;
  };

  return (
    <div className="admin-jobs">
      <div className="admin-jobs-header">
        <h1 className="admin-jobs-title">Quản lý công việc</h1>
        <div className="admin-jobs-filters">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Đang mở</option>
            <option value="ASSIGNED">Đã giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
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
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Người đăng</th>
                  <th>Người nhận</th>
                  <th>Trạng thái</th>
                  <th>Lương</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
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
                      <span className={`status-badge status-${job.status.toLowerCase()}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </td>
                    <td className="salary-cell">
                      {formatCurrency(job.salary)} / {job.salaryUnit || 'ngày'}
                    </td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <div className="job-actions">
                        <button
                          onClick={() => handleViewJob(job._id)}
                          className="btn-view-job"
                          title="Xem chi tiết"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(job._id)}
                          className="btn-delete-job"
                          title="Xóa công việc"
                          disabled={deleteLoading === job._id}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
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
                ← Trước
              </button>
              <span className="pagination-info">
                Trang {pagination.page} / {pagination.pages} ({pagination.total} công việc)
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="pagination-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Xác nhận xóa</h2>
            <p className="modal-message">
              Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác và sẽ xóa tất cả đơn ứng tuyển và đánh giá liên quan.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-cancel"
                disabled={deleteLoading}
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteConfirm)}
                className="btn-delete"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
