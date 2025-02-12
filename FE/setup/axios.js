import axios, { isAxiosError } from 'axios';
import { redirectToLogin } from '@/utils/auth';
import {toast} from "react-toastify";

// Create an instance of Axios for external API
const externalAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000", // Change baseURL if needed
    headers: {
        'Content-Type': 'application/json',
    },
});

externalAxios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (isAxiosError(error) && error.response && error.response.status === 401) {
            // User is not logged in
            toast("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            redirectToLogin();
        } else if (error.response && error.response.data.message) {
            toast(error.response.data.message+""+error.response.status);
            console.log(error.response.data.message);
        } else {
            toast("Đã xảy ra lỗi. Vui lòng thử lại.");
            console.log('An error occurred. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default externalAxios;