import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Define an interface for your custom configuration if needed
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create an axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API}`,
  // other default configurations
  withCredentials: true,
});

// Axios Interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await axiosInstance.post("/api/user/refresh");

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        // FIXME
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
