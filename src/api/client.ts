import axiosLib from 'axios';

const axiosInstance = axiosLib.create({
	withCredentials: true,
});

export { axiosInstance as axios };
export default axiosInstance;
