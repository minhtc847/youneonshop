import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, registerNewUser } from "@/service/userServices";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });
          console.log("Response from authorize function:", response);
          return response;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        const defaultPassword = "986gjhsdgfbhjgsadjhf0273842098"; // Mật khẩu mặc định cho user dùng Google

        try {
          // Đăng ký tài khoản nếu chưa tồn tại
          await registerNewUser({
            email: profile.email,
            first_name: profile.given_name,
            last_name: profile.family_name,
            password: defaultPassword,
          });
          console.log("New user registered with Google:", profile.email);
        } catch (error) {
          // Kiểm tra nếu lỗi là do tài khoản đã tồn tại
          if (error.response && error.response.status === 422) {
            const errorMessage = error.response.data?.error?.email;
            if (errorMessage !== "a user with this email address already exists") {
              console.error("Unexpected error during Google registration:", error);
              return false;
            }
          } else {
            console.error("Error during Google registration:", error);
            return false;
          }
        }

        try {
          // Đăng nhập bằng API loginUser với mật khẩu mặc định
          const response = await loginUser({
            email: profile.email,
            password: defaultPassword,
          });

          // Gắn token vào profile để lưu vào session
          if (response.authentication_token) {
            profile.authentication_token = response.authentication_token;
          }

          console.log("Google login successful:", response);
          return !!response; // Nếu login thành công, cho phép đăng nhập
        } catch (error) {
          console.error("Error during Google login:", error);
          return false;
        }
      }

      return true; // Cho phép đăng nhập cho các provider khác
    },
    async jwt({ token, user, profile }) {
      if (user && user.authentication_token) {
        token.authentication_token = user.authentication_token;
      }

      if (profile && profile.authentication_token) {
        token.authentication_token = profile.authentication_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.authentication_token = token.authentication_token; // Gắn token vào session
      return session;
    },
  },
  pages: {

  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
