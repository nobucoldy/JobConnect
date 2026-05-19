import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import JobList from '../components/job/JobList';
import Button from '../components/common/Button';
import './JobList.css';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: 'OPEN'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await jobService.getAllJobs(params);
      setJobs(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="job-list-page">
      <div className="job-list-container">
        <div className="page-header">
          <h1>Tìm việc làm</h1>
          <p>Khám phá các công việc phù hợp với bạn</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tất cả</option>
              <option value="Delivery">Delivery</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Tech Support">Tech Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="location">Địa điểm</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Tìm theo địa điểm..."
              className="filter-input"
            />
          </div>
        </div>

        <div className="jobs-count">
          Tìm thấy {pagination.total} công việc
        </div>

        <JobList jobs={jobs} loading={loading} />

        {pagination.pages > 1 && (
          <div className="pagination">
            <Button
              variant="secondary"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              ← Trang trước
            </Button>
            <span className="page-info">
              Trang {pagination.page} / {pagination.pages}
            </span>
            <Button
              variant="secondary"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Trang sau →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;
