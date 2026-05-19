import React from 'react';
import JobCard from './JobCard';
import './JobList.css';

const JobList = ({ jobs, loading }) => {
  if (loading) {
    return (
      <div className="job-list-loading">
        <div className="spinner"></div>
        <p>Đang tải công việc...</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <div className="empty-icon">📋</div>
        <h3>Không tìm thấy công việc</h3>
        <p>Thử thay đổi bộ lọc hoặc tìm kiếm của bạn</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
