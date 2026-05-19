import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './EmptyState.css';

const EmptyState = ({ icon, title, message, action }) => {
  const IconComponent = icon || FiInbox;

  return (
    <div className="empty-state">
      <div className="empty-icon">
        {typeof IconComponent === 'function' ? <IconComponent size={64} strokeWidth={1.5} /> : IconComponent}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
