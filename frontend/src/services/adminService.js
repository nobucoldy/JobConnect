import API from './api';

export const adminService = {
  getAllUsers: (params) => API.get('/admin/users', { params }),
  getAllJobs: (params) => API.get('/admin/jobs', { params }),
  getStatistics: () => API.get('/admin/statistics')
};
