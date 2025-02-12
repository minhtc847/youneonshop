import axios from "../setup/axios"
import { signIn as nextAuthSignIn } from "next-auth/react"

const registerNewUser = async ({ email, first_name, last_name, password }) => {
    try {
        const response = await axios.post("/users", {
            email,
            first_name,
            last_name,
            password,
        })
        console.log("Registration successful:", response.data)
        return response.data
    } catch (error) {
        console.log("Registration failed:", error.response?.data || error.message)
        throw error
    }
}

const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post("/users/login", {
            email,
            password,
        })
        console.log("Login successful:", response.data)
        return response.data
    } catch (error) {
        console.log("Login failed:", error.response?.data || error.message)
        throw error
    }
}

const logoutUser = async () => {
    try {
        const response = await axios.post("/users/logout")
        console.log("Logout successful:", response.data)
        return response.data
    } catch (error) {
        console.log("Logout failed:", error.response?.data || error.message)
        throw error
    }
}

const createGoogleUser = async ({ email, name, password }) => {
    try {
        const [first_name, last_name] = name.split(" ")
        const response = await axios.post("/users", {
            email,
            first_name,
            last_name,
            password,
        })
        console.log("Google user creation successful:", response.data)
        return response.data
    } catch (error) {
        console.log("Google user creation failed:", error.response?.data || error.message)
        throw error
    }
}

const signIn = async (provider, credentials) => {
    try {
        if (provider === "credentials") {
            // Use the existing loginUser function for credential-based auth
            const response = await loginUser(credentials)
            console.log("Sign-in successful:", response)
            // After successful login, update NextAuth session
            await nextAuthSignIn("credentials", {
                redirect: false,
                email: credentials.email,
                password: credentials.password,
            })
            return response
        } else if (provider === "google") {
            // For Google auth, we'll use NextAuth's signIn method
            return await nextAuthSignIn("google", { callbackUrl: "/account" })
        } else {
            throw new Error(`Unsupported provider: ${provider}`)
        }
    } catch (error) {
        console.error("Sign-in failed:", error)
        throw error
    }
}

const registerGoogleUser = async (email, name) => {
    try {
        const [first_name, last_name] = name.split(" ");
        await createGoogleUser({
            email,
            first_name,
            last_name,
            password: "google_oauth_dummy_password", // Dummy password
        });
        return await loginUser({
            email,
            password: "google_oauth_dummy_password",
        });
    } catch (error) {
        console.error("Error in registering Google user:", error);
        throw error;
    }
};

export { registerNewUser, loginUser, logoutUser, createGoogleUser, signIn, registerGoogleUser }

