import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import './JobCard.css';

const getStatusBadge = (status) => {
  const statusMap = {
    'OPEN': { variant: 'success', label: 'Đang tuyển' },
    'ASSIGNED': { variant: 'info', label: 'Đã giao' },
    'COMPLETED': { variant: 'default', label: 'Hoàn thành' },
    'CANCELLED': { variant: 'danger', label: 'Đã hủy' }
  };
  return statusMap[status] || statusMap['OPEN'];
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

const JobCard = ({ job }) => {
  const statusBadge = getStatusBadge(job.status);

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-category">
          <span className="category-icon">{getCategoryIcon(job.category)}</span>
          <span className="category-name">{job.category}</span>
        </div>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>

      <h3 className="job-title">{job.title}</h3>
      <p className="job-description">{job.description}</p>

      <div className="job-meta">
        <div className="job-location">📍 {job.location}</div>
        <div className="job-poster">
          👤 {job.poster?.name || 'Unknown'}
          {job.poster?.averageRating > 0 && (
            <span className="rating">⭐ {job.poster.averageRating.toFixed(1)}</span>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-salary">
          {job.salary.toLocaleString('vi-VN')} VNĐ
        </div>
        <Link to={`/jobs/${job._id}`} className="job-card-link">
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
