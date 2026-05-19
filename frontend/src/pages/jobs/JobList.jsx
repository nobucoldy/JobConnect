import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import JobList from '../../components/job/JobList';
import Button from '../../components/common/Button';
import './JobList.css';

const JobListPage = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    status: 'OPEN'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 0
  });

  // Lấy category từ URL query params khi component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        category: decodeURIComponent(categoryParam)
      }));
    }
    setInitialized(true);
  }, [location.search]);

  useEffect(() => {
    if (initialized) {
      fetchJobs();
    }
  }, [filters, pagination.page, initialized]);

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
        <div className="jobs-toolbar">
          <div className="jobs-count">
            <strong>{pagination.total}</strong> việc làm
          </div>

          <div className="toolbar-filters">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tất cả danh mục</option>
              <option value="Giao hàng">Giao hàng</option>
              <option value="Dọn dẹp">Dọn dẹp</option>
              <option value="Gia sư">Gia sư</option>
              <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
              <option value="Khác">Khác</option>
            </select>

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Tìm kiếm theo địa chỉ..."
              className="filter-input"
            />
          </div>
        </div>

        {error && <div className="error-alert">{error}</div>}

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
