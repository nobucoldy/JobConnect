import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/job/JobCard';
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal, FiSearch, FiBriefcase, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { PiBroom } from 'react-icons/pi';
import './Home.css';

const Home = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/jobs?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    if (!isAdmin) {
      fetchRecentJobs();
      fetchCategories();
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const fetchRecentJobs = async () => {
    try {
      const response = await jobService.getAllJobs({ limit: 3, status: 'OPEN', activeOnly: 'true' });
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
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Hơn 1,200 việc làm mới hôm nay</span>
            </div>
            <h1 className="hero-title">
              Việc làm phù hợp<br />với bạn ngay hôm nay
            </h1>
            <p className="hero-subtitle">
              Kết nối người tìm việc và nhà tuyển dụng nhanh chóng, dễ dàng.
            </p>
            <div className="hero-search-bar">
              <div className="hero-search-input">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm công việc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="hero-search-input-field"
                />
              </div>
              <button onClick={handleSearch} className="hero-search-btn">
                Tìm ngay
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hero-illustration">
            <div className="hero-laptop">
              <div className="laptop-screen">
                <div className="laptop-screen-inner">
                  <div className="screen-header">
                    <span className="screen-title">Việc làm gợi ý</span>
                    <div className="screen-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div className="screen-job-list">
                    <div className="screen-job-item">
                      <div className="screen-job-icon blue"></div>
                      <div className="screen-job-info">
                        <div className="screen-job-name">Nhân viên thiết kế UI/UX</div>
                        <div className="screen-job-meta">Hà Nội · Full-time</div>
                      </div>
                      <div className="screen-job-tag new">New</div>
                    </div>
                    <div className="screen-job-item">
                      <div className="screen-job-icon green"></div>
                      <div className="screen-job-info">
                        <div className="screen-job-name">Lập trình viên Frontend</div>
                        <div className="screen-job-meta">HCM · Full-time</div>
                      </div>
                      <div className="screen-job-tag hot">Hot</div>
                    </div>
                    <div className="screen-job-item">
                      <div className="screen-job-icon orange"></div>
                      <div className="screen-job-info">
                        <div className="screen-job-name">Chuyên viên Marketing</div>
                        <div className="screen-job-meta">Đà Nẵng · Full-time</div>
                      </div>
                    </div>
                  </div>
                  <div className="screen-sidebar">
                    <div className="screen-sidebar-title">Top ngành nghề</div>
                    <div className="screen-sidebar-item">Công nghệ thông tin</div>
                    <div className="screen-sidebar-item">Kinh doanh</div>
                    <div className="screen-sidebar-item">Marketing</div>
                    <div className="screen-sidebar-item">Thiết kế</div>
                    <div className="screen-sidebar-item">Nhân sự</div>
                  </div>
                </div>
              </div>
              <div className="laptop-base"></div>
              <div className="laptop-stand"></div>
            </div>

            {/* Floating badges */}
            <div className="float-badge float-badge-1">
              <FiUsers size={14} />
            </div>
            <div className="float-badge float-badge-2">
              <span>★</span>
            </div>
            <div className="float-badge float-badge-3">
              <span>📊</span>
            </div>

            {/* Decorative shapes */}
            <div className="deco-bag"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon-wrap stat-icon-blue">
              <FiBriefcase size={18} />
            </div>
            <div>
              <div className="stat-number">36+</div>
              <div className="stat-label">VIỆC LÀM</div>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrap stat-icon-purple">
              <FiUsers size={18} />
            </div>
            <div>
              <div className="stat-number">36+</div>
              <div className="stat-label">NHÀ TUYỂN DỤNG</div>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrap stat-icon-green">
              <span style={{ fontSize: '16px' }}>🔖</span>
            </div>
            <div>
              <div className="stat-number">36%</div>
              <div className="stat-label">LÒNG HÀI HƯỚC</div>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrap stat-icon-orange">
              <FiMessageCircle size={18} />
            </div>
            <div>
              <div className="stat-number">36p</div>
              <div className="stat-label">PHẢN HỒI TRUNG BÌNH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-meta">DANH MỤC</div>
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
              <div className="section-meta">CẬP NHẬT HÔM NAY</div>
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
