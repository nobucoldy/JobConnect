import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Rating from '../components/common/Rating';
import ReviewList from '../components/review/ReviewList';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser && userId === currentUser._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserProfile(userId);
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

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

  if (!profile) {
    return null;
  }

  const { user, jobsAsPoster, jobsAsWorker, reviews } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-rating">
            <Rating value={user.averageRating} readOnly size="md" />
            <span className="profile-rating-text">
              {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'Chưa có'} ({user.totalReviews} đánh giá)
            </span>
          </div>
        </div>
        {isOwnProfile && (
          <Link to="/profile/edit" className="btn-edit-profile">
            Chỉnh sửa
          </Link>
        )}
      </div>

      <div className="profile-details">
        <div className="profile-detail-item">
          <span className="profile-detail-label">Email:</span>
          <span className="profile-detail-value">{user.email}</span>
        </div>
        <div className="profile-detail-item">
          <span className="profile-detail-label">Số điện thoại:</span>
          <span className="profile-detail-value">{user.phone}</span>
        </div>
      </div>

      <div className="profile-sections">
        {jobsAsPoster.length > 0 && (
          <section className="profile-section">
            <h2 className="profile-section-title">Công việc đã đăng ({jobsAsPoster.length})</h2>
            <div className="profile-jobs-list">
              {jobsAsPoster.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="profile-job-card"
                >
                  <h3>{job.title}</h3>
                  <span className={`job-status status-${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                  <span className="job-date">
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {jobsAsWorker.length > 0 && (
          <section className="profile-section">
            <h2 className="profile-section-title">Công việc đã làm ({jobsAsWorker.length})</h2>
            <div className="profile-jobs-list">
              {jobsAsWorker.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="profile-job-card"
                >
                  <h3>{job.title}</h3>
                  <p className="job-poster">Đăng bởi: {job.poster?.name}</p>
                  <span className="job-date">
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="profile-section">
          <h2 className="profile-section-title">Đánh giá ({reviews.length})</h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>
    </div>
  );
};

export default Profile;
