import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { FiMail, FiPhone, FiStar, FiBriefcase, FiFileText, FiEdit2 } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('posted');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const response = await userService.getUserProfile(currentUser._id);
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await jobService.getMyJobs();
        setPostedJobs(response.data.data);
      } catch (err) {
        console.error('Failed to fetch posted jobs:', err);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const response = await applicationService.getMyApplications();
        setAppliedJobs(response.data.data);
      } catch (err) {
        console.error('Failed to fetch applied jobs:', err);
      }
    };

    if (currentUser) {
      fetchPostedJobs();
      fetchAppliedJobs();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const { user } = profile;

  return (
    <div className="profile-page">

      {/* Hero Banner */}
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-hero-left">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-hero-info">
              <h1 className="profile-name">{user.name}</h1>
              <div className="profile-rating">
                <FiStar />
                <span className="rating-value">
                  {user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0'}
                </span>
                <span className="rating-count">
                  ({user.totalReviews || 0} đánh giá)
                </span>
              </div>
              <div className="profile-meta">
                <div className="profile-meta-item">
                  <FiMail />
                  <span>{user.email}</span>
                </div>
                <div className="profile-meta-item">
                  <FiPhone />
                  <span>{user.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/profile/edit" className="btn-edit-profile">
            <FiEdit2 />
            Chỉnh sửa hồ sơ
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="profile-stats">
        <div className="profile-stats-inner">
          <div className="profile-stat-item">
            <div className="profile-stat-number">{postedJobs.length}</div>
            <div className="profile-stat-label">Việc đã đăng</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-number">{appliedJobs.length}</div>
            <div className="profile-stat-label">Đã ứng tuyển</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-number">
              {user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="profile-stat-label">Đánh giá</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-number">{user.totalReviews || 0}</div>
            <div className="profile-stat-label">Lượt đánh giá</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-container">

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'posted' ? 'active' : ''}`}
            onClick={() => setActiveTab('posted')}
          >
            <FiBriefcase />
            Việc đã đăng ({postedJobs.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied')}
          >
            <FiFileText />
            Việc đã ứng tuyển ({appliedJobs.length})
          </button>
        </div>

        {/* Posted Jobs */}
        {activeTab === 'posted' && (
          <div className="profile-jobs">
            <div className="profile-jobs-header">
              <h2 className="profile-jobs-title">Việc đã đăng</h2>
              <Link to="/jobs/create" className="btn-primary">+ Đăng việc mới</Link>
            </div>
            {postedJobs.length === 0 ? (
              <div className="profile-jobs-empty">
                <p>Bạn chưa đăng công việc nào</p>
                <Link to="/jobs/create" className="btn-primary">Đăng việc mới</Link>
              </div>
            ) : (
              <div className="profile-jobs-list">
                {postedJobs.map(job => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="profile-job-card">
                    <div className="job-card-icon">
                      <FiBriefcase />
                    </div>
                    <div className="job-card-body">
                      <div className="job-card-header">
                        <h3 className="job-card-title">{job.title}</h3>
                        <span className={`job-card-status status-${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="job-card-meta">
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="job-card-salary">
                      {new Intl.NumberFormat('vi-VN').format(job.salary)} / {job.salaryUnit || 'ngày'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applied Jobs */}
        {activeTab === 'applied' && (
          <div className="profile-jobs">
            <div className="profile-jobs-header">
              <h2 className="profile-jobs-title">Việc đã ứng tuyển</h2>
              <Link to="/jobs" className="btn-primary">Tìm việc</Link>
            </div>
            {appliedJobs.length === 0 ? (
              <div className="profile-jobs-empty">
                <p>Bạn chưa ứng tuyển công việc nào</p>
                <Link to="/jobs" className="btn-primary">Tìm việc</Link>
              </div>
            ) : (
              <div className="profile-jobs-list">
                {appliedJobs.map(application => (
                  <Link key={application._id} to={`/jobs/${application.job._id}`} className="profile-job-card">
                    <div className="job-card-icon">
                      <FiFileText />
                    </div>
                    <div className="job-card-body">
                      <div className="job-card-header">
                        <h3 className="job-card-title">{application.job.title}</h3>
                        <span className={`job-card-status status-${application.status.toLowerCase()}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="job-card-meta">
                        <span>{application.job.category}</span>
                        <span>•</span>
                        <span>{application.job.location}</span>
                      </div>
                      <div className="job-card-footer">
                        <span className="job-card-date">
                          Ứng tuyển: {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className="job-card-salary">
                      {new Intl.NumberFormat('vi-VN').format(application.job.salary)} / {application.job.salaryUnit || 'ngày'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;