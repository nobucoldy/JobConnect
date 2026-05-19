import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { FiMapPin, FiCalendar, FiMail, FiPhone, FiStar } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const { user } = profile;

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `Tham gia từ T${month}/${year}`;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-info">
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
                  <FiMapPin />
                  <span>Quận 1, TP. Hồ Chí Minh</span>
                </div>
                <div className="profile-meta-item">
                  <FiCalendar />
                  <span>{formatJoinDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/profile/edit" className="btn-edit-profile">
            Chỉnh sửa hồ sơ
          </Link>
        </div>

        <div className="profile-contact">
          <h2 className="profile-contact-title">Thông tin liên hệ</h2>
          <div className="profile-contact-list">
            <div className="profile-contact-item">
              <div className="contact-icon">
                <FiMail />
              </div>
              <div className="contact-info">
                <span className="contact-label">Email</span>
                <span className="contact-value">{user.email}</span>
              </div>
            </div>
            <div className="profile-contact-item">
              <div className="contact-icon">
                <FiPhone />
              </div>
              <div className="contact-info">
                <span className="contact-label">Số điện thoại</span>
                <span className="contact-value">{user.phone || '090 ••• ••••'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
