import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:12897/api/'
});

// Alter defaults after instance has been created
axiosInstance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;