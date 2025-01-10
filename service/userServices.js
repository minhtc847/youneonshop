import axios from '../setup/axios';
import { signIn as nextAuthSignIn } from 'next-auth/react';

const registerNewUser = async ({ email, first_name, last_name, password }) => {
    try {
        // Gửi yêu cầu đăng ký người dùng mới tới API /users
        const response = await axios.post("/users", {
            email,
            first_name,
            last_name,
            password, // Nếu người dùng chưa tạo mật khẩu, bạn có thể để trống hoặc tạo mật khẩu ngẫu nhiên
        });

        console.log("Registration successful:", response.data);
        return response.data; // Trả về dữ liệu người dùng đã đăng ký
    } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);

        // Nếu có lỗi, trả về thông báo lỗi từ API
        throw error; // Ném lỗi để NextAuth có thể xử lý
    }
};


const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post('/users/login', {
            email,
            password,
        });
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.log('Login failed:', error.response?.data || error.message);
        throw error;
    }
}

const logoutUser = async () => {
    try {
        const response = await axios.post('/users/logout');
        console.log('Logout successful:', response.data);
        return response.data;
    } catch (error) {
        console.log('Logout failed:', error.response?.data || error.message);
        throw error;
    }
}

const signIn = async (provider, credentials) => {
    try {
        if (provider === 'credentials') {
            // Use the existing loginUser function for credential-based auth
            const response = await loginUser(credentials);
            console.log('Sign-in successful:', response);
            // After successful login, update NextAuth session
            await nextAuthSignIn('credentials', {
                redirect: false,
                email: credentials.email,
                password: credentials.password,
            });
            return response;
        } else {
            // For provider-based auth (e.g., Google, Facebook)
            return await nextAuthSignIn(provider, { callbackUrl: '/account' });
        }
    } catch (error) {
        console.error('Sign-in failed:', error);
        throw error;
    }
}

export {
    registerNewUser,
    loginUser,
    logoutUser,
    signIn,
};

