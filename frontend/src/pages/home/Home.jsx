import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/job/JobCard';
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal, FiSearch } from 'react-icons/fi';
import { PiBroom } from 'react-icons/pi';
import './Home.css';

const Home = () => {
  const { isAdmin } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      fetchRecentJobs();
      fetchCategories();
    }
  }, [isAdmin]);

  // Nếu là admin, chuyển hướng đến trang admin
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const fetchRecentJobs = async () => {
    try {
      const response = await jobService.getAllJobs({ limit: 3, status: 'OPEN' });
      setRecentJobs(response.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchCategories = async () => {
    const categoryConfig = [
      { icon: FiPackage, name: 'Giao hàng', category: 'Giao hàng' },
      { icon: PiBroom, name: 'Dọn dẹp', category: 'Dọn dẹp' },
      { icon: FiBook, name: 'Gia sư', category: 'Gia sư' },
      { icon: FiMonitor, name: 'Hỗ trợ kỹ thuật', category: 'Hỗ trợ kỹ thuật' },
      { icon: FiMoreHorizontal, name: 'Khác', category: 'Khác' },
    ];
    setCategories(categoryConfig);
  };

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Hơn 1,200 việc làm mới hôm nay</span>
          </div>
          <h1 className="hero-title">
            Tìm việc làm phù hợp<br />với bạn ngay hôm nay
          </h1>
          <p className="hero-subtitle">
            Kết nối người tìm việc và nhà tuyển dụng nhanh chóng, dễ dàng.
          </p>
          <div className="hero-search-bar">
            <div className="hero-search-input">
              <FiSearch />
              <span>Tìm kiếm công việc...</span>
            </div>
            <Link to="/jobs" className="hero-search-btn">
              Tìm ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">36+</div>
            <div className="stat-label">Việc làm</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">36+</div>
            <div className="stat-label">Nhà tuyển dụng</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">36%</div>
            <div className="stat-label">Hài lòng</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">36p</div>
            <div className="stat-label">Phản hồi trung bình</div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-meta">Danh mục</div>
            <h2>Dịch vụ phổ biến</h2>
          </div>
          <div className="service-grid">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={index}
                  to={`/jobs?category=${encodeURIComponent(category.category)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="service-card">
                    <div className="service-icon-wrap">
                      <div className="service-icon">
                        <IconComponent />
                      </div>
                    </div>
                    <div className="service-name">{category.name}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="jobs-section">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <div className="section-meta">Cập nhật hôm nay</div>
              <h2>Việc làm mới nhất</h2>
            </div>
            <Link to="/jobs" className="view-all-link">
              Xem tất cả →
            </Link>
          </div>
          <div className="job-cards-grid">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;