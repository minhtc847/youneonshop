import NextAuth, {User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Account, Profile as NextAuthProfile } from "next-auth";
import {getLoggedUser, loginUser} from "@/service/userServices"; // Removed registerNewUserimport { Account, Profile as NextAuthProfile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User as NextAuthUser } from "next-auth";
import { Session as NextAuthSession } from "next-auth";
import {toast} from "react-toastify";
import {redirect} from "next/navigation";

interface CustomUser {
  id: string;
  email: string;
  authentication_token: string;
  first_name?: string;
  last_name?: string;
  telephone?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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

          const loggedUser = await getLoggedUser(response.authentication_token);

          if (loggedUser.user) {
            const user: CustomUser = {
              id: loggedUser.user.id,
              email: loggedUser.user.email,
              authentication_token: response.authentication_token,
              first_name: loggedUser.user["first-name"],
              last_name: loggedUser.user["last_name"],
              telephone: loggedUser.user.telephone,
            };
            return user;
          }
          return null;
        } catch (error) {
          console.error("Error in credentials authorize function:", error);

          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // 🔥 Giữ session bằng JWT (không mất sau reload)
    maxAge: 30 * 24 * 60 * 60, // Session tồn tại 30 ngày
  },
  callbacks: {
    async signIn({ account, profile }: { account: Account | null; profile?: Profile }) {
      if (account?.provider === "google" && profile) {
        const defaultPassword = "986gjhsdgfbhjgsadjhf0273842098"; // Default password for Google users

        try {
          const response = await loginUser({
            email: profile.email,
            password: defaultPassword,
          });

          if (response.authentication_token) {
            profile.authentication_token = response.authentication_token;
          }

          console.log("Google login successful:", response);
          return !!response;
        } catch (error) {
          console.error("Error during Google login:", error);
          return "/login?error=not signed in";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.authentication_token = user?.authentication_token;
      }
      return token;

    },

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    async session({ session, token }) {
      session.user = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
        name: token.id,
        email: token.email,
        authentication_token: token.authentication_token,
      };
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };