import api from './api';

export const bookmarkService = {
  toggle: (jobId) => api.post(`/bookmarks/${jobId}/toggle`),
  getSaved: ()     => api.get('/bookmarks'),
};