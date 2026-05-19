import API from './api';

export const jobService = {
  getAllJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: (params) => API.get('/jobs/my/posted', { params }),
  markJobComplete: (id) => API.put(`/jobs/${id}/complete`)
};
