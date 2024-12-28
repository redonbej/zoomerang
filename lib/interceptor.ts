import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api", 
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized - logging out user...");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
