import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api", 
});


const requestDecorator = (next) => (config) => {
    console.log("Request Decorator: Adding Authorization Token");
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return next(config);
};

const responseDecorator = (next) => (response) => {
    console.log("Response Decorator: Intercepting response");
    return next(response);
};

const errorDecorator = (next) => (error) => {
    if (error.response?.status === 401) {
        console.error("Unauthorized - logging out user...");
    }
    return next(error);
};


axiosInstance.interceptors.request.use(requestDecorator((config) => config));
axiosInstance.interceptors.response.use(
    responseDecorator((response) => response),
    errorDecorator((error) => Promise.reject(error))
);

export default axiosInstance;
