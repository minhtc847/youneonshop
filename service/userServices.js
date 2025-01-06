import axios from '../setup/axios';

const registerNewUser = async (email, first_name, last_name, password) => {
    console.log(email, first_name, last_name, password);
    try {
        const response = await axios.post('/users', {
            email, first_name, last_name, password
        });
        console.log('Registration successful:', username);
        return response.data;
    } catch (error) {
        console.log('Registration failed:', error.response?.data || error.message);
        throw error;
    }
};


const loginUser = (username, password) => {
    console.log(username, password);
    return axios.post('/auth/token', {
        username, password
    });
}



export {
    registerNewUser,
    loginUser
};