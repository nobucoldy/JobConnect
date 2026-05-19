import API from './api';

export const userService = {
  getUserProfile: (userId) => API.get(`/users/${userId}`),
  updateProfile: (data) => API.put('/users/profile', data)
};
