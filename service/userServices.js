import axios from '../setup/axios';

const registerNewUser = async ({ email, first_name, last_name, password }) => {
    try {
        const response = await axios.post('/users', {
            email,
            first_name,
            last_name,
            password,
        })
        console.log('Registration successful:', response.data)
        return response.data
    } catch (error) {
        console.log('Registration failed:', error.response?.data || error.message)
        throw error
    }
}


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
export {
    registerNewUser,
    loginUser,
    logoutUser,
};