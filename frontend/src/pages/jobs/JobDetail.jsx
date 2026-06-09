import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { reviewService } from '../../services/reviewService';
import { adminService } from '../../services/adminService';
import { bookmarkService } from '../../services/bookmarkService';
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
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal, FiDollarSign, FiMapPin, FiCalendar, FiStar, FiUsers, FiEdit2, FiTrash2, FiCheckCircle, FiEye, FiClock, FiList, FiBookmark } from 'react-icons/fi';
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const fetchJobDetail = useCallback(async () => {
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
  }, [id]);

  const checkIfApplied = useCallback(async () => {
    try {
      const response = await applicationService.getMyApplications();
      const applications = response.data.data;
      const applied = applications.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (err) {
      console.error('Failed to check application status:', err);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewService.getReviewsForJob(id);
      setReviews(response.data.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  const fetchBookmarkStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setIsBookmarked(false);
      return;
    }

    try {
      const response = await bookmarkService.getSaved();
      const savedJobs = response.data.data || [];
      const saved = savedJobs.some(savedJob => {
        const savedJobId = savedJob?._id || savedJob?.id || savedJob;
        return savedJobId?.toString() === id;
      });
      setIsBookmarked(saved);
    } catch (err) {
      console.error('Failed to check bookmark status:', err);
    }
  }, [id, isAuthenticated]);

  const checkIfReviewed = useCallback(() => {
    const userReview = reviews.find(review => review.reviewer?._id === user?._id);
    setHasReviewed(!!userReview);
  }, [reviews, user]);

  useEffect(() => {
    fetchJobDetail();
    fetchReviews();
  }, [fetchJobDetail, fetchReviews]);

  useEffect(() => {
    if (isAuthenticated && job && user && user._id !== job.poster?._id) {
      checkIfApplied();
    }
  }, [isAuthenticated, job, user, checkIfApplied]);

  useEffect(() => {
    if (job) {
      fetchBookmarkStatus();
    }
  }, [job, fetchBookmarkStatus]);

  useEffect(() => {
    if (isAuthenticated && job && reviews.length > 0) {
      checkIfReviewed();
    }
  }, [isAuthenticated, job, reviews, checkIfReviewed]);



  const handleApplySuccess = () => {
    setHasApplied(true);
    fetchJobDetail();
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookmarkLoading(true);
    try {
      const response = await bookmarkService.toggle(id);
      setIsBookmarked(response.data.saved);
      toast.success(response.data.message || (response.data.saved ? 'ÄÃ£ lÆ°u cÃ´ng viá»‡c' : 'ÄÃ£ bá» lÆ°u cÃ´ng viá»‡c'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'KhÃ´ng thá»ƒ cáº­p nháº­t lÆ°u cÃ´ng viá»‡c');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    setReviewLoading(true);
    try {
      await reviewService.createReview(reviewData);
      toast.success('Đánh giá thành công!');
      setShowReviewForm(false);
      fetchReviews();
      fetchJobDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
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
  const canDelete = (isOwner && job.status === 'OPEN') || isAdmin;
  const canMarkComplete = isOwner && job.status === 'ASSIGNED';
  const canReview = isAuthenticated && job.status === 'COMPLETED' && (isOwner || isAssignedWorker) && !hasReviewed;

  const deadlinePassed = job.applicationDeadline && new Date(job.applicationDeadline) < new Date();
  const isAccepting = job.isAcceptingApplications ?? (!deadlinePassed && job.status === 'OPEN');

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Quay lại danh sách
        </button>

        <div className="job-detail-main">
          {/* Left column */}
          <div className="job-detail-left">
            <div className="job-category-badge">
              {React.createElement(getCategoryIcon(job.category))}
              <span>{job.category}</span>
            </div>

            <h1 className="job-title">{job.title}</h1>

    

            <div className="job-bookmark-row">
              <button
                className={`bookmark-btn ${isBookmarked ? 'bookmark-btn--active' : ''}`}
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
                title={isBookmarked ? 'Bỏ lưu' : 'Lưu việc làm'}
              >
                <FiBookmark size={18} />
                <span>{isBookmarked ? 'Đã lưu' : 'Lưu việc làm'}</span>
              </button>
            </div>

            {/* Trạng thái nhận đơn */}
            <div className="job-accepting-status">
              {isAccepting ? (
                <Badge variant="success">Đang nhận hồ sơ</Badge>
              ) : (
                <Badge variant="danger">Ngừng nhận hồ sơ</Badge>
              )}
            </div>

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
                <FiUsers />
                <span>Tuyển {job.slots || 1} người</span>
              </div>
              <div className="meta-item">
                <FiCalendar />
                <span>Bắt đầu: {formatDate(job.startDate)}</span>
              </div>
              <div className="meta-item">
                <FiCalendar />
                <span>Kết thúc: {formatDate(job.endDate)}</span>
              </div>
              {job.applicationDeadline && (
                <div className={`meta-item ${deadlinePassed ? 'meta-item--danger' : ''}`}>
                  <FiClock />
                  <span>Hạn nộp hồ sơ: {formatDate(job.applicationDeadline)}</span>
                  {deadlinePassed && <span className="meta-badge meta-badge--danger">Đã hết hạn</span>}
                </div>
              )}
              <div className="meta-item">
                <FiEye />
                <span>{job.views || 0} lượt xem</span>
              </div>
            </div>

            <div className="job-section">
              <h2 className="section-title">Mô tả công việc</h2>
              <p className="job-description">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="job-section">
                <h2 className="section-title">
                  <FiList /> Yêu cầu công việc
                </h2>
                <p className="job-requirements">{job.requirements}</p>
              </div>
            )}

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
                  {!isAccepting ? (
                    <Badge variant="danger">Đã hết hạn ứng tuyển</Badge>
                  ) : hasApplied ? (
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
                  <Button variant="info" onClick={() => setShowApplicationList(true)}>
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
                  <Button variant="primary" size="lg" fullWidth onClick={() => setShowReviewForm(true)}>
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

          {/* Right column */}
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
  <Button
    variant="outline"
    size="sm"
    onClick={() => navigate(`/profile/${job.poster?._id}`)}
  >
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
