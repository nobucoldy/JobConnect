import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <EmptyState
        icon="🔍"
        title="404 - Không tìm thấy trang"
        message="Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã bị xóa."
        action={
          <div className="not-found-actions">
            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;
