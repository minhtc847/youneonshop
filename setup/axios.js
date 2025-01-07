// setup/externalAxios.js
import axios from 'axios'
import { toast } from 'react-toastify'

// Tạo một instance của Axios cho API bên ngoài
const externalAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000", // Thay đổi baseURL nếu cần
    //withCredentials: true, // Gửi cookies cùng với mỗi yêu cầu
    headers: {
        'Content-Type': 'application/json',
    },
})

// setup/externalAxios.js

externalAxios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            if (error.response.status === 401) {
                // Người dùng chưa đăng nhập
                console.console.log();
                ('Người dùng chưa đăng nhập.');
                // Có thể chuyển hướng đến trang đăng nhập
                // router.replace('/login'); (sử dụng useRouter trong component)
            } else if (error.response.data && error.response.data.message) {
                console.log(error.response.data.message);
            } else {
                console.log('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } else {
            console.log('Không nhận được phản hồi từ server.');
        }
        return Promise.reject(error);
    }
);

export default externalAxios