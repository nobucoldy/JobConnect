import React, { useState } from 'react';
import { applicationService } from '../../services/applicationService';
import Button from '../common/Button';
import './ApplicationModal.css';

const ApplicationModal = ({ job, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 500;
  const remainingChars = maxLength - coverLetter.length;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (coverLetter.trim().length === 0) {
      setError('Vui lòng nhập thư xin việc');
      return;
    }

    if (coverLetter.length > maxLength) {
      setError(`Thư xin việc không được vượt quá ${maxLength} ký tự`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await applicationService.applyJob({
        jobId: job._id,
        coverLetter: coverLetter.trim()
      });

      alert('Ứng tuyển thành công!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content application-modal">
        <div className="modal-header">
          <h2>Ứng tuyển công việc</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="job-info-summary">
            <h3>{job.title}</h3>
            <p className="job-meta">
              <span>{job.category}</span> • <span>{job.location}</span>
            </p>
            <p className="job-meta job-date-range">
              <span>Bắt đầu: {formatDate(job.startDate)}</span> •{' '}
              <span>Kết thúc: {formatDate(job.endDate)}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="coverLetter">
                Thư xin việc <span className="required">*</span>
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Giới thiệu bản thân, kinh nghiệm và lý do bạn phù hợp với công việc này..."
                rows="6"
                className="form-textarea"
                disabled={loading}
              />
              <div className="char-count" style={{ color: remainingChars < 0 ? 'var(--danger)' : 'var(--gray-600)' }}>
                {remainingChars} ký tự còn lại
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi ứng tuyển'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
