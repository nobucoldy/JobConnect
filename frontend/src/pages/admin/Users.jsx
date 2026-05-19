import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { FiStar, FiPlus, FiX } from 'react-icons/fi';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (roleFilter) {
        params.role = roleFilter;
      }

      const response = await adminService.getAllUsers(params);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo(0, 0);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      await adminService.createUser(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user'
      });
      fetchUsers();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Không thể tạo người dùng');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-users-loading">
        <div className="spinner"></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <h1 className="admin-users-title">Quản lý người dùng</h1>
        <div className="admin-users-actions">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="filter-select"
          >
            <option value="">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-create-user"
          >
            <FiPlus />
            Thêm người dùng
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-users-error">
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {users.length === 0 && !loading ? (
        <div className="admin-users-empty">
          <p>Không tìm thấy người dùng</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Đánh giá</th>
                  <th>Số review</th>
                  <th>Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="user-name-cell">
                      <div className="user-avatar-small">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <div className="rating-cell">
                        <FiStar />
                        <span className="rating-value">
                          {user.averageRating > 0 ? user.averageRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="text-center">{user.totalReviews}</td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                ← Trước
              </button>
              <span className="pagination-info">
                Trang {pagination.page} / {pagination.pages} ({pagination.total} người dùng)
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="pagination-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Thêm người dùng mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="modal-close"
              >
                <FiX />
              </button>
            </div>

            {createError && (
              <div className="create-error">{createError}</div>
            )}

            <form onSubmit={handleCreateUser} className="create-user-form">
              <div className="form-group">
                <label htmlFor="name">Họ tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Nhập họ tên"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="0901234567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-cancel"
                  disabled={createLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={createLoading}
                >
                  {createLoading ? 'Đang tạo...' : 'Tạo người dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
