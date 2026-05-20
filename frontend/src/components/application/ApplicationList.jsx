import React, { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import ApplicationCard from './ApplicationCard';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import './ApplicationList.css';

const ApplicationList = ({ jobId, onClose }) => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response = await applicationService.getApplicationsForJob(jobId, params);
      setApplications(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách ứng viên';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobId, statusFilter, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdate = () => {
    fetchApplications();
  };

  const getStatusStats = () => {
    return {
      ALL: applications.length,
      PENDING: applications.filter(app => app.status === 'PENDING').length,
      ACCEPTED: applications.filter(app => app.status === 'ACCEPTED').length,
      REJECTED: applications.filter(app => app.status === 'REJECTED').length
    };
  };

  const getFilteredApplications = () => {
    if (statusFilter === 'ALL') return applications;
    return applications.filter(app => app.status === statusFilter);
  };

  const stats = getStatusStats();
  const filteredApplications = getFilteredApplications();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content application-list-modal">
        <div className="modal-header">
          <h2>Danh sách ứng viên</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <span>⚠️ {error}</span>
              <button onClick={fetchApplications}>Thử lại</button>
            </div>
          )}

          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              Tất cả ({stats.ALL})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Chờ duyệt ({stats.PENDING})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACCEPTED')}
            >
              Đã chấp nhận ({stats.ACCEPTED})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('REJECTED')}
            >
              Đã từ chối ({stats.REJECTED})
            </button>
          </div>

          {loading ? (
            <div className="application-list-loading">
              <Spinner size="md" />
              <p>Đang tải danh sách ứng viên...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Chưa có ứng viên nào"
              message={
                applications.length === 0
                  ? 'Chưa có ai ứng tuyển vào công việc này'
                  : `Không có ứng viên ${statusFilter.toLowerCase()}`
              }
            />
          ) : (
            <div className="application-list-content">
              {filteredApplications.map(application => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onUpdate={handleUpdate}
                  isPoster={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
