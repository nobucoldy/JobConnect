import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/job/JobCard';
import { FiPackage, FiBook, FiMonitor, FiMoreHorizontal } from 'react-icons/fi';
import { PiBroom } from 'react-icons/pi';
import './Home.css';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchRecentJobs();
    fetchCategories();
  }, []);

  const fetchRecentJobs = async () => {
    try {
      const response = await jobService.getAllJobs({ limit: 3, status: 'OPEN' });
      setRecentJobs(response.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchCategories = async () => {
    // Định nghĩa các category với icon
    const categoryConfig = [
      { icon: FiPackage, name: 'Giao hàng', category: 'Delivery' },
      { icon: PiBroom, name: 'Dọn dẹp', category: 'Cleaning' },
      { icon: FiBook, name: 'Gia sư', category: 'Tutoring' },
      { icon: FiMonitor, name: 'Hỗ trợ kỹ thuật', category: 'Tech Support' },
      { icon: FiMoreHorizontal, name: 'Khác', category: 'Other' },
    ];

    setCategories(categoryConfig);
  };

  return (
    <div className="home-page">
      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-header">
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
                    <div className="service-icon">
                      <IconComponent />
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
            <h2>Việc làm mới nhất</h2>
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
