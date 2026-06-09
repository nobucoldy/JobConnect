import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Confirm from '../common/Confirm';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onUpdate, isPoster = false }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'PENDING': 'warning',
      'ACCEPTED': 'success',
      'REJECTED': 'danger'
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Chờ duyệt',
      ACCEPTED: 'Đã chấp nhận',
      REJECTED: 'Đã từ chối'
    };
    return labels[status] || status;
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await applicationService.acceptApplication(application._id);
      toast.success('Đã chấp nhận ứng viên!');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await applicationService.rejectApplication(application._id);
      toast.success('Đã từ chối ứng viên!');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn rút lại ứng tuyển này?')) {
      return;
    }

    setLoading(true);
    try {
      await applicationService.withdrawApplication(application._id);
      alert('Đã rút lại ứng tuyển!');
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-card">
      <div className="application-header">
        <div className="applicant-info">
          {application.worker?._id ? (
            <Link
              to={`/profile/${application.worker._id}`}
              className="applicant-avatar applicant-avatar-link"
              title="Xem hồ sơ ứng viên"
            >
              {application.worker?.name?.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <div className="applicant-avatar">
              {application.worker?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="applicant-details">
            <div className="applicant-name">{application.worker?.name}</div>
            <div className="applicant-rating">
              ⭐ {application.worker?.averageRating?.toFixed(1) || 'Chưa có đánh giá'}
              {application.worker?.totalReviews > 0 && ` (${application.worker.totalReviews} đánh giá)`}
            </div>
            {isPoster && (
              <>
                <div className="applicant-contact">📧 {application.worker?.email}</div>
                {application.worker?.phone && (
                  <div className="applicant-contact">📱 {application.worker?.phone}</div>
                )}
              </>
            )}
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(application.status)}>
          {getStatusLabel(application.status)}
        </Badge>
      </div>

      <div className="application-body">
        {application.coverLetter && (
          <div className="cover-letter">
            <div className="cover-letter-label">Thư xin việc:</div>
            <p>{application.coverLetter}</p>
          </div>
        )}

        <div className="application-meta">
          <span className="applied-date">
            Ứng tuyển: {formatDate(application.createdAt)}
          </span>
        </div>
      </div>

      {isPoster && application.status === 'PENDING' && (
        <div className="application-actions">
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAcceptConfirm(true)}
            disabled={loading}
          >
            Chấp nhận
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowRejectConfirm(true)}
            disabled={loading}
          >
            ❌ Từ chối
          </Button>
        </div>
      )}

      {!isPoster && application.status === 'PENDING' && (
        <div className="application-actions">
          <Button
            variant="danger"
            size="sm"
            onClick={handleWithdraw}
            disabled={loading}
          >
            Rút lại ứng tuyển
          </Button>
        </div>
      )}

      <Confirm
        isOpen={showAcceptConfirm}
        onClose={() => setShowAcceptConfirm(false)}
        onConfirm={handleAccept}
        title="Chấp nhận ứng viên"
        message="Bạn có chắc chắn muốn chấp nhận ứng viên này? Công việc sẽ được giao cho họ và các ứng tuyển khác sẽ bị từ chối."
        confirmText="Chấp nhận"
        cancelText="Hủy"
        variant="success"
      />

      <Confirm
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleReject}
        title="Từ chối ứng viên"
        message="Bạn có chắc chắn muốn từ chối ứng viên này?"
        confirmText="Từ chối"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
};

export default ApplicationCard;
