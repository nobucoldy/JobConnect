import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ApplicationModal from '../components/application/ApplicationModal';
import ApplicationList from '../components/application/ApplicationList';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationList, setShowApplicationList] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && job && !isOwner) {
      checkIfApplied();
    }
  }, [isAuthenticated, job]);

  const fetchJobDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await applicationService.getMyApplications();
      const applications = response.data.data;
      const applied = applications.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (err) {
      // Silently fail - not critical
      console.error('Failed to check application status:', err);
    }
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    fetchJobDetail();
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;

    setActionLoading(true);
    try {
      await jobService.deleteJob(id);
      alert('Đã xóa công việc thành công');
      navigate('/my-jobs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!window.confirm('Đánh dấu công việc này đã hoàn thành?')) return;

    setActionLoading(true);
    try {
      await jobService.markJobComplete(id);
      alert('Đã đánh dấu công việc hoàn thành');
      fetchJobDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as complete');
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Delivery': '🚚',
      'Cleaning': '🧹',
      'Tutoring': '📚',
      'Tech Support': '💻',
      'Other': '📋'
    };
    return icons[category] || '📋';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  if (loading) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-error">
          <h2>Lỗi</h2>
          <p>{error || 'Không tìm thấy công việc'}</p>
          <Button onClick={() => navigate('/jobs')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?._id === job.poster?._id;
  const canEdit = isOwner && job.status === 'OPEN';
  const canDelete = isOwner && job.status === 'OPEN';
  const canMarkComplete = isOwner && job.status === 'ASSIGNED';

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/jobs')}
          className="back-button"
        >
          ← Quay lại
        </Button>

        <div className="job-detail-card">
          <div className="job-detail-header">
            <div className="job-category-icon">{getCategoryIcon(job.category)}</div>
            <div className="job-header-content">
              <div className="job-header-top">
                <h1 className="job-title">{job.title}</h1>
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
              </div>
              <div className="job-meta">
                <span className="job-category">{job.category}</span>
                <span className="job-location">📍 {job.location}</span>
              </div>
            </div>
          </div>

          <div className="job-detail-body">
            <div className="job-section">
              <h2 className="section-title">Mô tả công việc</h2>
              <p className="job-description">{job.description}</p>
            </div>

            <div className="job-section">
              <h2 className="section-title">Thông tin chi tiết</h2>
              <div className="job-info-grid">
                <div className="info-item">
                  <span className="info-label">Mức lương</span>
                  <span className="info-value salary">{formatCurrency(job.salary)} đ</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày bắt đầu</span>
                  <span className="info-value">{formatDate(job.startDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày kết thúc</span>
                  <span className="info-value">{formatDate(job.endDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày đăng</span>
                  <span className="info-value">{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="job-section">
              <h2 className="section-title">Người đăng</h2>
              <div className="poster-info">
                <div className="poster-avatar">
                  {job.poster?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="poster-details">
                  <div className="poster-name">{job.poster?.name}</div>
                  <div className="poster-rating">
                    ⭐ {job.poster?.averageRating?.toFixed(1) || 'Chưa có đánh giá'}
                    {job.poster?.totalReviews > 0 && ` (${job.poster.totalReviews} đánh giá)`}
                  </div>
                  <div className="poster-contact">📧 {job.poster?.email}</div>
                  {job.poster?.phone && (
                    <div className="poster-contact">📱 {job.poster.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {job.assignedWorker && (
              <div className="job-section">
                <h2 className="section-title">Người nhận việc</h2>
                <div className="poster-info">
                  <div className="poster-avatar">
                    {job.assignedWorker?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="poster-details">
                    <div className="poster-name">{job.assignedWorker?.name}</div>
                    <div className="poster-rating">
                      ⭐ {job.assignedWorker?.averageRating?.toFixed(1) || 'Chưa có đánh giá'}
                      {job.assignedWorker?.totalReviews > 0 && ` (${job.assignedWorker.totalReviews} đánh giá)`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="job-detail-actions">
            {!isAuthenticated && (
              <div className="action-message">
                <p>Đăng nhập để ứng tuyển hoặc quản lý công việc</p>
                <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              </div>
            )}

            {isAuthenticated && !isOwner && job.status === 'OPEN' && (
              <div className="action-message">
                {hasApplied ? (
                  <>
                    <Badge variant="success">✅ Đã ứng tuyển</Badge>
                    <p className="action-note">Bạn đã ứng tuyển vào công việc này. Vui lòng chờ người đăng xét duyệt.</p>
                  </>
                ) : (
                  <Button size="lg" fullWidth onClick={() => setShowApplicationModal(true)}>
                    Ứng tuyển ngay
                  </Button>
                )}
              </div>
            )}

            {isOwner && (
              <div className="owner-actions">
                <Button
                  variant="info"
                  onClick={() => setShowApplicationList(true)}
                >
                  👥 Xem ứng viên
                </Button>
                {canEdit && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                    disabled={actionLoading}
                  >
                    ✏️ Chỉnh sửa
                  </Button>
                )}
                {canMarkComplete && (
                  <Button
                    variant="success"
                    onClick={handleMarkComplete}
                    disabled={actionLoading}
                  >
                    ✅ Đánh dấu hoàn thành
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={actionLoading}
                  >
                    🗑️ Xóa công việc
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {showApplicationModal && (
          <ApplicationModal
            job={job}
            onClose={() => setShowApplicationModal(false)}
            onSuccess={handleApplySuccess}
          />
        )}

        {showApplicationList && (
          <ApplicationList
            jobId={job._id}
            onClose={() => setShowApplicationList(false)}
          />
        )}
      </div>
    </div>
  );
};

export default JobDetail;
