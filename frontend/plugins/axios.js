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

  nuxtApp.provide('axios', apiClient);
});
