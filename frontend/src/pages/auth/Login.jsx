import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiLogIn, FiBriefcase } from 'react-icons/fi';
import './Register.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side-panel auth-side-left">
        <div className="side-panel-illustration">
          <FiLogIn size={80} strokeWidth={1.5} />
        </div>
        <h2 className="side-panel-title">Chào mừng trở lại!</h2>
        <p className="side-panel-description">
          Đăng nhập để tiếp tục kết nối với hàng nghìn cơ hội việc làm.
        </p>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-subtitle">Nhập thông tin để tiếp tục</p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>

      <div className="auth-side-panel auth-side-right">
        <div className="side-panel-illustration">
          <FiBriefcase size={80} strokeWidth={1.5} />
        </div>
        <h2 className="side-panel-title">Việc làm tốt,<br />Tương lai tài năng.</h2>
        <p className="side-panel-description">
          Tham gia cộng đồng hơn 10,000+ người dùng đang tìm kiếm cơ hội việc làm.
        </p>
        <div className="side-panel-stats">
          <div>10,000+ Công việc</div>
          <div>5,000+ Người dùng</div>
          <div>98% Hài lòng</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
