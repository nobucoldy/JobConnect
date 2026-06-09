import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { bookmarkService } from '../../services/bookmarkService';
import {
  FiMail, FiPhone, FiStar, FiBriefcase, FiFileText,
  FiEdit2, FiMapPin, FiClock, FiBookmark, FiShare2,
  FiPlus, FiTrendingUp, FiBell, FiCheck
} from 'react-icons/fi';
import './Profile.css';

/* ─── helpers ─────────────────────────────────────────── */
const getStatusLabel = (status) => {
  const map = {
    PENDING: 'Đang chờ',
    ACCEPTED: 'Được chấp nhận',
    REJECTED: 'Từ chối',
    WITHDRAWN: 'Đã rút',
    pending: 'Đang chờ',
    accepted: 'Được chấp nhận',
    rejected: 'Từ chối',
  };
  return map[status] || status;
};

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

/* ─── Profile completion ──────────────────────────────── */
const calcCompletion = (user, skills) => {
  let score = 0;
  if (user?.name) score += 20;
  if (user?.email) score += 20;
  if (user?.phone) score += 15;
  if (user?.location) score += 15;
  if (skills?.length > 0) score += 20;
  if (user?.bio) score += 10;
  return score;
};

/* ─── Notification mock ───────────────────────────────── */
const buildNotifications = (appliedJobs) => {
  const notifs = [];
  appliedJobs.slice(0, 3).forEach((app) => {
    if (app.status === 'ACCEPTED' || app.status === 'accepted') {
      notifs.push({
        id: app._id + '_view',
        color: '#3b82f6',
        text: 'Đơn ứng tuyển đã được xem',
        sub: `${app.job?.category || 'Công việc'} · ${timeAgo(app.updatedAt)}`,
      });
    } else {
      notifs.push({
        id: app._id + '_match',
        color: '#22c55e',
        text: 'Việc mới phù hợp với bạn',
        sub: `${app.job?.title || 'Việc làm'} · ${app.job?.location || ''} · Hôm nay`,
      });
    }
  });
  return notifs.slice(0, 3);
};

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Gần đây';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Vừa xong';
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
};

/* ═══════════════════════════════════════════════════════ */
const Profile = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('posted');
  const [shareCopied, setShareCopied] = useState(false);

  /* skills – stored locally (can be extended to backend later) */
  const [skills] = useState(['React', 'Node.js', 'UI/UX']);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    (async () => {
      try {
        setLoading(true);
        const res = await userService.getUserProfile(currentUser._id);
        setProfile(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    jobService.getMyJobs()
      .then(r => setPostedJobs(r.data.data))
      .catch(() => {});

    applicationService.getMyApplications()
      .then(r => setAppliedJobs(r.data.data))
      .catch(() => {});

    bookmarkService.getSaved()
      .then(r => setSavedJobs(r.data.data || []))
      .catch(() => {});
  }, [currentUser]);

  /* ── render guards ── */
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

  const { user } = profile;
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
  const completion = calcCompletion(user, skills);
  const notifications = buildNotifications(appliedJobs);

  /* ── tab config ── */
  const tabs = [
    { key: 'posted',  label: `Việc đã đăng (${postedJobs.length})`,     icon: <FiBriefcase /> },
    { key: 'applied', label: `Đã ứng tuyển (${appliedJobs.length})`,    icon: <FiFileText /> },
    { key: 'saved',   label: `Đã lưu (${savedJobs.length})`,             icon: <FiBookmark /> },
  ];

  return (
    <div className="profile-page">

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-hero-left">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-hero-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
                {user.isNewUser && (
                  <span className="profile-badge-new">✦ Hồ sơ mới</span>
                )}
              </div>

              <div className="profile-meta">
                <div className="profile-meta-item">
                  <FiMail /><span>{user.email}</span>
                </div>
                <div className="profile-meta-item">
                  <FiPhone /><span>{user.phone || 'Chưa cập nhật'}</span>
                </div>
                {user.location && (
                  <div className="profile-meta-item">
                    <FiMapPin /><span>{user.location}</span>
                  </div>
                )}
              </div>

              <div className="profile-tags">
                {user.location && (
                  <span className="profile-tag"><FiMapPin />{user.location}</span>
                )}
                <span className="profile-tag"><FiClock />Tìm việc toàn thời gian</span>
                {user.averageRating > 0 && (
                  <span className="profile-tag profile-tag--star">
                    <FiStar />{user.averageRating.toFixed(1)} ({user.totalReviews || 0} đánh giá)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <Link to="/profile/edit" className="btn-edit-profile">
              <FiEdit2 />Chỉnh sửa hồ sơ
            </Link>
            <button className="btn-share-profile" onClick={handleShare}>
  {shareCopied ? <FiCheck /> : <FiShare2 />}
  {shareCopied ? 'Đã sao chép!' : 'Chia sẻ hồ sơ'}
</button>
          </div>
        </div>

        {/* completion bar */}
        {completion < 100 && (
          <div className="profile-completion-bar-wrap">
            <div className="profile-completion-inner">
              <div className="profile-completion-text">
                <span>
                  Hồ sơ của bạn hoàn thiện <strong>{completion}%</strong>
                  {' '}— Thêm kỹ năng và kinh nghiệm để tăng cơ hội được tuyển!
                </span>
              </div>
              <div className="profile-completion-track">
                <div
                  className="profile-completion-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

     
      {/* Main Content */}
      {/* ── Stats ── */}
      <div className="profile-stats">
        <div className="profile-stats-inner">
          {[
            { value: postedJobs.length,                                          label: 'Việc đã đăng' },
            { value: appliedJobs.length,                                         label: 'Đã ứng tuyển' },
            { value: user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0', label: 'Đánh giá TB' },
            { value: user.profileViews || 0,                                     label: 'Lượt xem hồ sơ' },
          ].map((s, i) => (
            <div key={i} className="profile-stat-item">
              <div className="profile-stat-number">{s.value}</div>
              <div className="profile-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      
      {/* ── Main container: tabs + content ── */}
      

      {/* ── Middle + Jobs section ── */}
      <div className="profile-mid-section">

        {/* Thông báo */}
        <div className="profile-panel">
          <div className="panel-header">
            <span className="panel-title"><FiBell /> Thông báo gần đây</span>
          </div>
          {notifications.length === 0 ? (
            <p className="panel-empty">Chưa có thông báo nào</p>
          ) : (
            <ul className="notif-list">
              {notifications.map(n => (
                <li key={n.id} className="notif-item">
                  <span className="notif-dot" style={{ background: n.color }} />
                  <div>
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-sub">{n.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Việc của tôi */}
        <div className="profile-panel" style={{ padding: 0, overflow: 'hidden' }}>
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
                      <Link key={job._id} to={`/jobs/${job._id}`} className="profile-job-card">
                        <div className="job-card-icon"><FiBriefcase /></div>
                        <div className="job-card-body">
                          <div className="job-card-header">
                            <h3 className="job-card-title">{job.title}</h3>
                            <span className={`job-card-status ${getStatusClass(job.status)}`}>{job.status}</span>
                          </div>
                          <div className="job-card-meta"><span>{job.category}</span><span>·</span><span>{job.location}</span></div>
                        </div>
                        <div className="job-card-salary">{new Intl.NumberFormat('vi-VN').format(job.salary)} / {job.salaryUnit || 'ngày'}</div>
                      </Link>
                    ))}
                  </div>
            )}
            {activeTab === 'applied' && (
              appliedJobs.length === 0
                ? <p className="panel-empty">Bạn chưa ứng tuyển công việc nào</p>
                : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                    {appliedJobs.map(application => (
                      <Link key={application._id} to={`/jobs/${application.job._id}`} className="profile-job-card">
                        <div className="job-card-icon"><FiFileText /></div>
                        <div className="job-card-body">
                          <div className="job-card-header">
                            <h3 className="job-card-title">{application.job.title}</h3>
                            <span className={`job-card-status ${getStatusClass(application.status)}`}>{getStatusLabel(application.status)}</span>
                          </div>
                          <div className="job-card-meta"><span>{application.job.category}</span><span>·</span><span>{application.job.location}</span></div>
                          <div className="job-card-footer">
                            <span className="job-card-date">Ứng tuyển: {new Date(application.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        <div className="job-card-salary">{new Intl.NumberFormat('vi-VN').format(application.job.salary)} / {application.job.salaryUnit || 'ngày'}</div>
                      </Link>
                    ))}
                  </div>
            )}
            {activeTab === 'saved' && (
              savedJobs.length === 0
                ? <p className="panel-empty">Bạn chưa lưu công việc nào</p>
                : <div className="profile-jobs-list" style={{ marginTop: '12px' }}>
                    {savedJobs.map(job => (
                      <Link key={job._id} to={`/jobs/${job._id}`} className="profile-job-card">
                        <div className="job-card-icon"><FiBookmark /></div>
                        <div className="job-card-body">
                          <div className="job-card-header">
                            <h3 className="job-card-title">{job.title}</h3>
                            <span className={`job-card-status ${getStatusClass(job.status)}`}>{job.status}</span>
                          </div>
                          <div className="job-card-meta"><span>{job.category}</span><span>·</span><span>{job.location}</span></div>
                        </div>
                        <div className="job-card-salary">{new Intl.NumberFormat('vi-VN').format(job.salary)} / {job.salaryUnit || 'ngày'}</div>
                      </Link>
                    ))}
                  </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;