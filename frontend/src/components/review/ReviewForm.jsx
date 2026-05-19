import React, { useState } from 'react';
import Rating from '../common/Rating';
import './ReviewForm.css';

const ReviewForm = ({ jobId, onSubmit, onCancel, loading = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Vui lòng chọn số sao');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Nhận xét phải có ít nhất 10 ký tự');
      return;
    }

    if (comment.trim().length > 500) {
      setError('Nhận xét không được quá 500 ký tự');
      return;
    }

    onSubmit({ jobId, rating, comment: comment.trim() });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-group">
        <label className="review-form-label">Đánh giá *</label>
        <Rating
          value={rating}
          onChange={setRating}
          size="lg"
        />
      </div>

      <div className="review-form-group">
        <label htmlFor="comment" className="review-form-label">
          Nhận xét * ({comment.length}/500)
        </label>
        <textarea
          id="comment"
          className="review-form-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          rows={5}
          maxLength={500}
        />
      </div>

      {error && <div className="review-form-error">{error}</div>}

      <div className="review-form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
