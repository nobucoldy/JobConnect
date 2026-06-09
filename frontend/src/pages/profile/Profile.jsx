import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { bookmarkService } from '../../services/bookmarkService';
import {
  FiMail, FiPhone, FiStar, FiBriefcase, FiFileText,
  FiEdit2, FiMapPin, FiBookmark, FiShare2,
  FiPlus, FiCheck, FiUsers
} from 'react-icons/fi';
import './Profile.css';

const statusLabels = {
  PENDING: 'Đang chờ',
  ACCEPTED: 'Được chấp nhận',
  REJECTED: 'Từ chối',
  WITHDRAWN: 'Đã rút',
  OPEN: 'Đang mở',
  ASSIGNED: 'Đã giao',
  COMPLETED: 'Đã hoàn thành',
  CANCELLED: 'Đã hủy'
};

const getStatusLabel = (status) => statusLabels[status] || status;

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return 'status-pending';
  if (s === 'accepted') return 'status-accepted';
  if (s === 'rejected') return 'status-rejected';
  if (s === 'open') return 'status-open';
  if (s === 'assigned') return 'status-assigned';
  if (s === 'completed') return 'status-completed';
  if (s === 'cancelled') return 'status-cancelled';
  return 'status-pending';
};

const getApplicationDisplayStatus = (application) => {
  if (application.job?.status === 'COMPLETED') return 'COMPLETED';
  if (application.job?.status === 'CANCELLED') return 'CANCELLED';
  return application.status;
};

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0);

const JobRow = ({ job, icon, showApplicants = false, footer }) => (
  <Link key={job._id} to={`/jobs/${job._id}`} className="profile-job-card">
    <div className="job-card-icon">{icon}</div>
    <div className="job-card-body">
      <div className="job-card-header">
        <h3 className="job-card-title">{job.title}</h3>
        <span className={`job-card-status ${getStatusClass(job.status)}`}>
          {getStatusLabel(job.status)}
        </span>
      </div>
      <div className="job-card-meta">
        {job.category && <span>{job.category}</span>}
        {job.category && job.location && <span>·</span>}
        {job.location && <span>{job.location}</span>}
        {showApplicants && (
          <>
            <span>·</span>
            <span className="job-card-applicants">
              <FiUsers /> {job.applicationsCount || 0} người ứng tuyển
            </span>
          </>
        )}
      </div>
      {footer && <div className="job-card-footer">{footer}</div>}
    </div>
    <div className="job-card-salary">
      {formatCurrency(job.salary)} / {job.salaryUnit || 'ngày'}
    </div>
  </Link>
);

const Profile = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isOwnProfile = !id || id === currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('posted');
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!id && !currentUser) {
      navigate('/login');
      return;
    }

    const targetId = id || currentUser?._id;
    if (!targetId) return;

    (async () => {
      try {
        setLoading(true);
        const res = await userService.getUserProfile(targetId);
        setProfile(res.data.data);
        if (!isOwnProfile) {
          setPostedJobs(res.data.data.jobsAsPoster || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser, navigate, id, isOwnProfile]);

  useEffect(() => {
    if (!currentUser || !isOwnProfile) return;

    jobService.getMyJobs()
      .then(r => setPostedJobs(r.data.data || []))
      .catch(() => {});

    applicationService.getMyApplications()
      .then(r => setAppliedJobs(r.data.data || []))
      .catch(() => {});

    bookmarkService.getSaved()
      .then(r => setSavedJobs(r.data.data || []))
      .catch(() => {});
  }, [currentUser, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile && !['posted', 'completed'].includes(activeTab)) {
      setActiveTab('posted');
    }
  }, [activeTab, isOwnProfile]);

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner" /><p>Đang tải...</p>
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <h2>Lỗi</h2><p>{error}</p>
      <button onClick={() => navigate('/')} className="btn-primary">Về trang chủ</button>
    </div>
  );

  if (!profile) return null;

  const { user, jobsAsWorker = [] } = profile;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:absolute;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const tabs = [
    { key: 'posted', label: `Việc đã đăng (${postedJobs.length})` },
    { key: 'applied', label: `Đã ứng tuyển (${appliedJobs.length})` },
    { key: 'saved', label: `Đã lưu (${savedJobs.length})` },
  ];
  const publicTabs = [
    { key: 'posted', label: `Việc đã đăng (${postedJobs.length})` },
    { key: 'completed', label: `Việc đã hoàn thành (${jobsAsWorker.length})` },
  ];

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-hero-left">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-hero-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
              </div>

              <div className="profile-meta">
                {isOwnProfile && (
                  <>
                    <div className="profile-meta-item">
                      <FiMail /><span>{user.email}</span>
                    </div>
                    <div className="profile-meta-item">
                      <FiPhone /><span>{user.phone || 'Chưa cập nhật'}</span>
                    </div>
                  </>
                )}
                {user.location && (
                  <div className="profile-meta-item">
                    <FiMapPin /><span>{user.location}</span>
                  </div>
                )}
              </div>

              <div className="profile-tags">
                {user.averageRating > 0 && (
                  <span className="profile-tag profile-tag--star">
                    <FiStar />{user.averageRating.toFixed(1)} ({user.totalReviews || 0} đánh giá)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            {isOwnProfile && (
              <Link to="/profile/edit" className="btn-edit-profile">
                <FiEdit2 />Chỉnh sửa hồ sơ
              </Link>
            )}
            <button className="btn-share-profile" onClick={handleShare}>
              {shareCopied ? <FiCheck /> : <FiShare2 />}
              {shareCopied ? 'Đã sao chép!' : 'Chia sẻ hồ sơ'}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stats-inner">
          {(isOwnProfile ? [
            { value: postedJobs.length, label: 'Việc đã đăng' },
            { value: appliedJobs.length, label: 'Đã ứng tuyển' },
            { value: savedJobs.length, label: 'Đã lưu' },
            { value: user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0', label: 'Đánh giá TB' },
          ] : [
            { value: postedJobs.length, label: 'Việc đã đăng' },
            { value: jobsAsWorker.length, label: 'Việc đã hoàn thành' },
            { value: user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0', label: 'Đánh giá TB' },
            { value: user.totalReviews || 0, label: 'Lượt đánh giá' },
          ]).map((s, i) => (
            <div key={i} className="profile-stat-item">
              <div className="profile-stat-number">{s.value}</div>
              <div className="profile-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {isOwnProfile ? (
        <div className="profile-mid-section profile-mid-section--single">
          <div className="profile-panel profile-panel--wide" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 0' }}>
              <div className="panel-header">
                <span className="panel-title"><FiBriefcase /> Việc của tôi</span>
                <Link to="/jobs/create" className="btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }}>
                  <FiPlus /> Đăng việc
                </Link>
              </div>
              <div className="profile-tabs" style={{ borderRadius: 0, border: 'none', background: 'transparent', padding: 0 }}>
                {tabs.map(t => (
                  <button
                    key={t.key}
                    className={`profile-tab ${activeTab === t.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 20px 16px' }}>
              {activeTab === 'posted' && (
                postedJobs.length === 0
                  ? <p className="panel-empty">Bạn chưa đăng công việc nào</p>
                  : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                      {postedJobs.map(job => (
                        <JobRow
                          key={job._id}
                          job={job}
                          icon={<FiBriefcase />}
                          showApplicants
                        />
                      ))}
                    </div>
              )}
              {activeTab === 'applied' && (
                appliedJobs.length === 0
                  ? <p className="panel-empty">Bạn chưa ứng tuyển công việc nào</p>
                  : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                      {appliedJobs.map(application => {
                        const displayStatus = getApplicationDisplayStatus(application);
                        return (
                          <JobRow
                            key={application._id}
                            job={{ ...application.job, status: displayStatus }}
                            icon={<FiFileText />}
                            footer={<span className="job-card-date">Ứng tuyển: {new Date(application.createdAt).toLocaleDateString('vi-VN')}</span>}
                          />
                        );
                      })}
                    </div>
              )}
              {activeTab === 'saved' && (
                savedJobs.length === 0
                  ? <p className="panel-empty">Bạn chưa lưu công việc nào</p>
                  : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                      {savedJobs.map(job => (
                        <JobRow key={job._id} job={job} icon={<FiBookmark />} />
                      ))}
                    </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-mid-section profile-mid-section--single">
          <div className="profile-panel profile-panel--wide" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 0' }}>
              <div className="panel-header">
                <span className="panel-title"><FiBriefcase /> Hoạt động công việc</span>
              </div>
              <div className="profile-tabs" style={{ borderRadius: 0, border: 'none', background: 'transparent', padding: 0 }}>
                {publicTabs.map(t => (
                  <button
                    key={t.key}
                    className={`profile-tab ${activeTab === t.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 20px 16px' }}>
              {activeTab === 'posted' && (
                postedJobs.length === 0
                  ? <p className="panel-empty">Người dùng này chưa đăng công việc nào</p>
                  : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                      {postedJobs.map(job => (
                        <JobRow key={job._id} job={job} icon={<FiBriefcase />} showApplicants />
                      ))}
                    </div>
              )}
              {activeTab === 'completed' && (
                jobsAsWorker.length === 0
                  ? <p className="panel-empty">Người dùng này chưa hoàn thành công việc nào</p>
                  : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                      {jobsAsWorker.map(job => (
                        <JobRow key={job._id} job={job} icon={<FiCheck />} />
                      ))}
                    </div>
              )}
              {activeTab !== 'posted' && activeTab !== 'completed' && (
                <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                  {postedJobs.map(job => (
                    <JobRow key={job._id} job={job} icon={<FiBriefcase />} showApplicants />
                  ))}
                </div>
              )}
              {activeTab !== 'posted' && activeTab !== 'completed' && postedJobs.length === 0 && (
                <p className="panel-empty">Người dùng này chưa đăng công việc nào</p>
              )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
