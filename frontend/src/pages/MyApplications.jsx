import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './MyApplications.css';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchMyApplications();
  }, [pagination.page, statusFilter]);

  const fetchMyApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const response = await applicationService.getMyApplications(params);
      setApplications(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
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
      'PENDING': 'warning',
      'ACCEPTED': 'success',
      'REJECTED': 'danger'
    };
    return variants[status] || 'default';
  };

  const getStatusStats = () => {
    // Note: This is a simplified version. In a real app, you'd fetch stats from the API
    return {
      ALL: applications.length,
      PENDING: applications.filter(app => app.status === 'PENDING').length,
      ACCEPTED: applications.filter(app => app.status === 'ACCEPTED').length,
      REJECTED: applications.filter(app => app.status === 'REJECTED').length
    };
  };

  const stats = getStatusStats();

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && applications.length === 0) {
    return (
      <div className="my-applications-page">
        <div className="my-applications-loading">
          <div className="spinner"></div>
          <p>Đang tải ứng tuyển của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="my-applications-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Ứng tuyển của tôi</h1>
            <p>Quản lý các công việc bạn đã ứng tuyển</p>
          </div>
          <Button onClick={() => navigate('/jobs')}>
            🔍 Tìm việc làm
          </Button>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️ {error}</span>
            <button onClick={fetchMyApplications}>Thử lại</button>
          </div>
        )}

        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Tất cả ({pagination.total})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Chờ duyệt
          </button>
          <button
            className={`filter-tab ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ACCEPTED')}
          >
            Đã chấp nhận
          </button>
          <button
            className={`filter-tab ${statusFilter === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('REJECTED')}
          >
            Đã từ chối
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Chưa có ứng tuyển nào</h3>
            <p>Bắt đầu tìm kiếm và ứng tuyển vào các công việc phù hợp với bạn</p>
            <Button onClick={() => navigate('/jobs')}>
              Tìm việc ngay
            </Button>
          </div>
        ) : (
          <>
            <div className="applications-list">
              {applications.map(application => (
                <div key={application._id} className="application-item">
                  <div className="application-item-header">
                    <div className="job-title-section">
                      <h3 onClick={() => navigate(`/jobs/${application.job._id}`)}>
                        {application.job?.title}
                      </h3>
                      <div className="job-meta">
                        <span>{application.job?.category}</span>
                        <span>📍 {application.job?.location}</span>
                        <span className="salary">{formatCurrency(application.job?.salary)} đ</span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </div>

                  <div className="poster-info-small">
                    <div className="poster-avatar-small">
                      {application.job?.poster?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="poster-name-small">{application.job?.poster?.name}</div>
                      <div className="poster-rating-small">
                        ⭐ {application.job?.poster?.averageRating?.toFixed(1) || 'Chưa có'}
                      </div>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <details className="cover-letter-collapsible">
                      <summary>Xem thư xin việc</summary>
                      <p>{application.coverLetter}</p>
                    </details>
                  )}

                  <div className="application-item-footer">
                    <span className="applied-date">
                      Ứng tuyển: {formatDate(application.createdAt)}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/jobs/${application.job._id}`)}
                    >
                      Xem công việc
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <Button
                  variant="secondary"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  ← Trang trước
                </Button>
                <span className="page-info">
                  Trang {pagination.page} / {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Trang sau →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
