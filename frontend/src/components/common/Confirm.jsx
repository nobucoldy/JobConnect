import React from 'react';
import Button from './Button';
import './Confirm.css';

const Confirm = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', variant = 'danger' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <h3 className="confirm-title">{title}</h3>
          <button className="confirm-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="confirm-body">
          <p className="confirm-message">{message}</p>
        </div>
        <div className="confirm-footer">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
