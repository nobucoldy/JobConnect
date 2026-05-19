import API from './api';

export const reviewService = {
  createReview: (data) => API.post('/reviews', data),
  getReviewsForUser: (userId, params) =>
    API.get(`/reviews/user/${userId}`, { params }),
  getReviewsForJob: (jobId) => API.get(`/reviews/job/${jobId}`)
};
