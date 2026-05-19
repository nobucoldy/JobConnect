import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiTarget, FiTrendingUp } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
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
      await register(formData.email, formData.password, formData.name, formData.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side-panel auth-side-left">
        <div className="side-panel-illustration">
          <FiTarget size={80} strokeWidth={1.5} />
        </div>
        <h2 className="side-panel-title">Kết nối tài năng,<br />bứt phá sự nghiệp.</h2>
        <p className="side-panel-description">
          Tạo tài khoản ngay để khám phá hàng ngàn cơ hội việc làm phù hợp với bạn.
        </p>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Đăng ký tài khoản</h1>
        <p className="auth-subtitle">Tạo tài khoản mới để bắt đầu</p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Họ và tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
            required
          />

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
            label="Số điện thoại"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123456789"
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ít nhất 6 ký tự"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>

      <div className="auth-side-panel auth-side-right">
        <div className="side-panel-illustration">
          <FiTrendingUp size={80} strokeWidth={1.5} />
        </div>
        <h2 className="side-panel-title">Cơ hội việc làm<br />không giới hạn</h2>
        <p className="side-panel-description">
          Hàng nghìn nhà tuyển dụng đang chờ đợi để kết nối với tài năng như bạn.
        </p>
        <div className="side-panel-stats">
          <div>Đa dạng ngành nghề</div>
          <div>Phản hồi nhanh chóng</div>
          <div>Ứng tuyển dễ dàng</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
