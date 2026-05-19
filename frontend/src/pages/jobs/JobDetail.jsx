import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { reviewService } from '../../services/reviewService';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Confirm from '../../components/common/Confirm';
import ApplicationModal from '../../components/application/ApplicationModal';
import ApplicationList from '../../components/application/ApplicationList';
import ReviewForm from '../../components/review/ReviewForm';
import ReviewList from '../../components/review/ReviewList';
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal, FiDollarSign, FiMapPin, FiCalendar, FiStar, FiMail, FiPhone, FiUsers, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { PiBroom } from 'react-icons/pi';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
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
    if (isAuthenticated && job && user && user._id !== job.poster?._id) {
      checkIfApplied();
    }
  }, [isAuthenticated, job, user]);

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
      // Nếu là admin, sử dụng API admin để xóa
      if (isAdmin) {
        await adminService.deleteJob(id);
        toast.success('Đã xóa công việc thành công');
        navigate('/admin/jobs');
      } else {
        await jobService.deleteJob(id);
        toast.success('Đã xóa công việc thành công');
        navigate('/my-jobs');
      }
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
      'Giao hàng': FiPackage,
      'Dọn dẹp': PiBroom,
      'Gia sư': FiBook,
      'Hỗ trợ kỹ thuật': FiMonitor,
      'Khác': FiMoreHorizontal
    };
    return icons[category] || FiMoreHorizontal;
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

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 4) {
      return `${username.charAt(0)}***@${domain}`;
    }
    const visiblePart = username.substring(0, 4);
    return `${visiblePart}****@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 6) {
      return cleaned.substring(0, 3) + '****';
    }
    const start = cleaned.substring(0, 3);
    const end = cleaned.substring(cleaned.length - 3);
    return `${start}****${end}`;
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
  const canDelete = (isOwner && job.status === 'OPEN') || isAdmin; // Admin có thể xóa bất kỳ job nào
  const canMarkComplete = isOwner && job.status === 'ASSIGNED';
  const canReview = isAuthenticated && job.status === 'COMPLETED' && (isOwner || isAssignedWorker) && !hasReviewed;

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Quay lại danh sách
        </button>

        <div className="job-detail-main">
          {/* Left column - Job details */}
          <div className="job-detail-left">
            <div className="job-category-badge">
              {React.createElement(getCategoryIcon(job.category))}
              <span>{job.category}</span>
            </div>
            <h1 className="job-title">{job.title}</h1>

            <div className="job-meta-info">
              <div className="meta-item">
                <FiDollarSign />
                <span>{formatCurrency(job.salary)} / {job.salaryUnit || 'ngày'}</span>
              </div>
              <div className="meta-item">
                <FiMapPin />
                <span>{job.location}</span>
              </div>
              <div className="meta-item">
                <FiCalendar />
                <span>{formatDate(job.startDate)}</span>
              </div>
            </div>

            <div className="job-section">
              <h2 className="section-title">Mô tả công việc</h2>
              <p className="job-description">{job.description}</p>
            </div>

            {job.assignedWorker && (
              <div className="job-section">
                <h2 className="section-title">Người nhận việc</h2>
                <div className="poster-info">
                  <div className="poster-avatar-placeholder">
                    {job.assignedWorker?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="poster-name">{job.assignedWorker?.name}</div>
                  <div className="poster-rating">
                    <FiStar />
                    {job.assignedWorker?.averageRating?.toFixed(1) || 'N/A'}
                    {job.assignedWorker?.totalReviews > 0 && ` (${job.assignedWorker.totalReviews} đánh giá)`}
                  </div>
                </div>
              </div>
            )}

            <div className="job-detail-actions">
            {!isAuthenticated && (
              <div className="action-message">
                <p>Đăng nhập để ứng tuyển hoặc quản lý công việc</p>
                <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              </div>
            )}

            {isAdmin && (
              <div className="owner-actions">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={actionLoading}
                >
                  <FiTrash2 /> Xóa công việc
                </Button>
              </div>
            )}

            {isAuthenticated && !isOwner && !isAdmin && job.status === 'OPEN' && (
              <div className="action-message">
                {hasApplied ? (
                  <>
                    <Badge variant="success">Đã ứng tuyển</Badge>
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
                  <FiUsers /> Xem ứng viên
                </Button>
                {canEdit && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                    disabled={actionLoading}
                  >
                    <FiEdit2 /> Chỉnh sửa
                  </Button>
                )}
                {canMarkComplete && (
                  <Button
                    variant="success"
                    onClick={() => setShowCompleteConfirm(true)}
                    disabled={actionLoading}
                  >
                    <FiCheckCircle /> Đánh dấu hoàn thành
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={actionLoading}
                  >
                    <FiTrash2 /> Xóa công việc
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
                  <FiStar /> Viết đánh giá
                </Button>
              </div>
            )}

            {hasReviewed && job.status === 'COMPLETED' && (
              <div className="action-message">
                <Badge variant="success">Đã đánh giá</Badge>
              </div>
            )}
            </div>
          </div>

          {/* Right column - Poster info */}
          <div className="job-detail-right">
            <div className="poster-section-title">NGƯỜI ĐĂNG TIN</div>
            <div className="poster-info">
              <div className="poster-avatar-placeholder">
                {job.poster?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="poster-name">{job.poster?.name}</div>
              <div className="poster-rating">
                <FiStar />
                {job.poster?.averageRating?.toFixed(1) || '0.0'} ({job.poster?.totalReviews || 0} đánh giá)
              </div>
              <div className="poster-action">
                <Button variant="outline" size="sm">
                  Xem hồ sơ công ty
                </Button>
              </div>
            </div>
          </div>
        </div>

        {job.status === 'COMPLETED' && (
          <div className="reviews-section">
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
