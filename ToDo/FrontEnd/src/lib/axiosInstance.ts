import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'frontend-api': import.meta.env.VITE_API_KEY
    },
});

export default axiosInstance;