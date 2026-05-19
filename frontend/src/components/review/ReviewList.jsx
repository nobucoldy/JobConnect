import React from 'react';
import ReviewCard from './ReviewCard';
import './ReviewList.css';

const ReviewList = ({ reviews = [], loading = false }) => {
  if (loading) {
    return (
      <div className="review-list-loading">
        <div className="spinner"></div>
        <p>Đang tải đánh giá...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="review-list-empty">
        <div className="empty-icon">📝</div>
        <h3>Chưa có đánh giá</h3>
        <p>Chưa có đánh giá nào cho mục này</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
