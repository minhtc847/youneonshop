import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, registerNewUser } from "@/service/userServices"; // Import dịch vụ đăng nhập và đăng ký

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          return response.authentication_token;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Khi đăng nhập thành công, lưu thông tin người dùng vào JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Lưu thêm các thông tin khác vào token nếu cần
      }
      return token;
    },
    // Khi session được tạo, truyền thông tin người dùng vào session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    // Callback xử lý đăng nhập qua Google
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          // Thử đăng ký người dùng mới
          await registerNewUser({
            email: profile.email,
            first_name: profile.given_name,
            last_name: profile.family_name,
            password: "986gjhsdgfbhjgsadjhf0273842098", // Không cần mật khẩu vì user dùng Google
          });

          console.log("New user registered:", profile.email);
        } catch (error) {
          // Kiểm tra nếu lỗi là do tài khoản đã tồn tại
          if (error.response && error.response.status === 422) {
            const errorMessage = error.response.data?.error?.email;
            if (errorMessage === "a user with this email address already exists") {
              console.log("User already exists, allowing sign-in:", profile.email);
            } else {
              // Nếu lỗi không liên quan đến tài khoản tồn tại, ghi log và từ chối đăng nhập
              console.error("Unexpected error during Google sign-in:", error);
              return false;
            }
          } else {
            // Nếu là lỗi khác, từ chối đăng nhập
            console.error("Error during Google sign-in:", error);
            return false;
          }
        }

        // Dù user đã tồn tại hay được tạo mới, cho phép đăng nhập
        return true;
      }

      // Đối với các provider khác
      return true;
    }


  },
  pages: {
    signIn: "/login", // Đảm bảo trang login của bạn tồn tại
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };

