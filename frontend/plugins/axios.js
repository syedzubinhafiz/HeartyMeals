import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const apiClient = axios.create({
    baseURL: config.public.baseURL, // Use the base URL from runtimeConfig
  });

  // Add a request interceptor to include the access token
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add a response interceptor to handle token expiration
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Attempt to get a new access token using the refresh token
            const refreshResponse = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
            const { access_token, refresh_token, user } = refreshResponse.data || {};

            if (access_token) {
              localStorage.setItem('accessToken', access_token);
              originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
            }
            if (refresh_token) {
              localStorage.setItem('refreshToken', refresh_token);
            }
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }

            // Retry the original request with the new token
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed – clear storage and propagate error
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      }
      return Promise.reject(error);
    }
  );

  nuxtApp.provide('axios', apiClient);
});
