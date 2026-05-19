import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal, FiMapPin, FiUser, FiCalendar } from 'react-icons/fi';
import { PiBroom } from 'react-icons/pi';
import './JobCard.css';

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

const JobCard = ({ job }) => {
  const CategoryIcon = getCategoryIcon(job.category);

  // Debug: log all job data
  console.log('JobCard rendering with job:', job);
  console.log('Job title:', job.title);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-category">
          <span className="category-icon">
            <CategoryIcon />
          </span>
          <span className="category-name">{job.category}</span>
        </div>
        <div className="job-salary">
          {job.salary.toLocaleString('vi-VN')} / {job.salaryUnit || 'ngày'}
        </div>
      </div>

      <h3 className="job-title">
        {job.title || 'Untitled Job'}
      </h3>

      <div className="job-meta">
        <div className="job-location">
          <FiMapPin /> {job.location}
        </div>
        <div className="job-poster">
          <FiUser /> {job.poster?.name || 'Unknown'}
        </div>
        <div className="job-date">
          <FiCalendar /> {formatDate(job.startDate)} - {formatDate(job.endDate)}
        </div>
      </div>

      <div className="job-card-footer">
        <Link to={`/jobs/${job._id}`} className="job-card-link">
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
