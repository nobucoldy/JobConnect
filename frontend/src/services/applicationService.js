import API from './api';

export const applicationService = {
  // Apply to a job
  applyJob: (data) => API.post('/applications', data),

  // Get applications for a specific job (poster only)
  getApplicationsForJob: (jobId, params) =>
    API.get(`/applications/job/${jobId}`, { params }),

  // Get my applications (worker)
  getMyApplications: (params) => API.get('/applications/my', { params }),

  // Accept an application (poster only)
  acceptApplication: (id) => API.put(`/applications/${id}/accept`),

  // Reject an application (poster only)
  rejectApplication: (id) => API.put(`/applications/${id}/reject`),

  // Withdraw application (worker only)
  withdrawApplication: (id) => API.delete(`/applications/${id}`)
};
