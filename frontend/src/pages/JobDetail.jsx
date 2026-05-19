import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import Confirm from '../components/common/Confirm';
import ApplicationModal from '../components/application/ApplicationModal';
import ApplicationList from '../components/application/ApplicationList';
import ReviewForm from '../components/review/ReviewForm';
import ReviewList from '../components/review/ReviewList';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationList, setShowApplicationList] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && job && !isOwner) {
      checkIfApplied();
    }
  }, [isAuthenticated, job]);

  useEffect(() => {
    if (isAuthenticated && job && reviews.length > 0) {
      checkIfReviewed();
    }
  }, [isAuthenticated, job, reviews]);

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

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewService.getReviewsForJob(id);
      setReviews(response.data.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkIfReviewed = () => {
    const userReview = reviews.find(review => review.reviewer?._id === user?._id);
    setHasReviewed(!!userReview);
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    fetchJobDetail();
  };

  const handleReviewSubmit = async (reviewData) => {
    setReviewLoading(true);
    try {
      await reviewService.createReview(reviewData);
      toast.success('Đánh giá thành công!');
      setShowReviewForm(false);
      fetchReviews();
      fetchJobDetail(); // Refresh to update user ratings
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await jobService.deleteJob(id);
      toast.success('Đã xóa công việc thành công');
      navigate('/my-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa công việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setActionLoading(true);
    try {
      await jobService.markJobComplete(id);
      toast.success('Đã đánh dấu công việc hoàn thành');
      fetchJobDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đánh dấu hoàn thành');
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
          <Spinner size="lg" />
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
  const isAssignedWorker = isAuthenticated && user?._id === job.assignedWorker?._id;
  const canEdit = isOwner && job.status === 'OPEN';
  const canDelete = isOwner && job.status === 'OPEN';
  const canMarkComplete = isOwner && job.status === 'ASSIGNED';
  const canReview = isAuthenticated && job.status === 'COMPLETED' && (isOwner || isAssignedWorker) && !hasReviewed;

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
                    onClick={() => setShowCompleteConfirm(true)}
                    disabled={actionLoading}
                  >
                    ✅ Đánh dấu hoàn thành
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={actionLoading}
                  >
                    🗑️ Xóa công việc
                  </Button>
                )}
              </div>
            )}

            {canReview && (
              <div className="review-action">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowReviewForm(true)}
                >
                  ⭐ Viết đánh giá
                </Button>
              </div>
            )}

            {hasReviewed && job.status === 'COMPLETED' && (
              <div className="action-message">
                <Badge variant="success">✅ Đã đánh giá</Badge>
              </div>
            )}
          </div>
        </div>

        {job.status === 'COMPLETED' && (
          <div className="job-detail-card reviews-section">
            <h2 className="section-title">Đánh giá</h2>
            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </div>
        )}

        {showReviewForm && (
          <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Viết đánh giá</h2>
              <ReviewForm
                jobId={job._id}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
                loading={reviewLoading}
              />
            </div>
          </div>
        )}

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

        <Confirm
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Xóa công việc"
          message="Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          variant="danger"
        />

        <Confirm
          isOpen={showCompleteConfirm}
          onClose={() => setShowCompleteConfirm(false)}
          onConfirm={handleMarkComplete}
          title="Hoàn thành công việc"
          message="Đánh dấu công việc này đã hoàn thành? Sau khi hoàn thành, bạn và người nhận việc có thể đánh giá nhau."
          confirmText="Hoàn thành"
          cancelText="Hủy"
          variant="success"
        />
      </div>
    </div>
  );
};

export default JobDetail;
