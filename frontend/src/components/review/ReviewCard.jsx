import React from 'react';
import Rating from '../common/Rating';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    return role === 'poster' ? 'Người đăng việc' : 'Người làm việc';
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-card-author">
          <div className="review-card-avatar">
            {review.reviewer?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="review-card-author-info">
            <h4 className="review-card-author-name">
              {review.reviewer?.name || 'Người dùng'}
            </h4>
            <span className="review-card-role-badge">
              {getRoleBadge(review.reviewerRole)}
            </span>
          </div>
        </div>
        <div className="review-card-date">
          {formatDate(review.createdAt)}
        </div>
      </div>

      <div className="review-card-rating">
        <Rating value={review.rating} readOnly size="sm" />
      </div>

      <p className="review-card-comment">{review.comment}</p>

      {review.job && (
        <div className="review-card-job">
          <span className="review-card-job-label">Công việc:</span>
          <span className="review-card-job-title">{review.job.title}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
