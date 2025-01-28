import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
	_retryCount?: number;
}

const REFRESH_ENDPOINT = '/api/user/refresh';
const BLACKLISTED_ENDPOINTS = [REFRESH_ENDPOINT, '/api/user/login'];
const MAX_RETRY_ATTEMPTS = 1;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});
	failedQueue = [];
};

const axiosInstance: AxiosInstance = axios.create({
	baseURL: `${import.meta.env.VITE_BACKEND_API}`,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest: CustomAxiosRequestConfig = error.config;

		if (
			!originalRequest ||
			BLACKLISTED_ENDPOINTS.includes(originalRequest.url || '')
		) {
			return Promise.reject(error);
		}

		originalRequest._retryCount = originalRequest._retryCount || 0;

		if (
			error?.response?.status === 401 &&
			!originalRequest._retry &&
			originalRequest._retryCount < MAX_RETRY_ATTEMPTS
		) {
			originalRequest._retry = true;
			originalRequest._retryCount++;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => axiosInstance(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			isRefreshing = true;

			try {
				await axiosInstance.post(REFRESH_ENDPOINT);
				processQueue();
				isRefreshing = false;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				isRefreshing = false;
				// window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
