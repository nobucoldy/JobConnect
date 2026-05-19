import API from './api';

export const adminService = {
  getAllUsers: (params) => API.get('/admin/users', { params }),
  createUser: (data) => API.post('/admin/users', data),
  getAllJobs: (params) => API.get('/admin/jobs', { params }),
  deleteJob: (id) => API.delete(`/admin/jobs/${id}`),
  getStatistics: () => API.get('/admin/statistics')
};
