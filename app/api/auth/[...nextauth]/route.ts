import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Account, Profile as NextAuthProfile } from "next-auth";
import { loginUser } from "@/service/userServices"; // Removed registerNewUserimport { Account, Profile as NextAuthProfile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User as NextAuthUser } from "next-auth";
import { Session as NextAuthSession } from "next-auth";

export interface Session extends NextAuthSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    authentication_token?: string;
  };
}
interface User extends NextAuthUser {
  authentication_token?: string;
}
interface Profile extends NextAuthProfile {
  authentication_token?: string;
}

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
    async jwt({ token, user, profile }: { token: JWT; user?: User; profile?: Profile }) {
      if (user && 'authentication_token' in user) {
        token.authentication_token = user.authentication_token;
      }

      if (profile && 'authentication_token' in profile) {
        token.authentication_token = profile.authentication_token;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = session.user || {};
      const expiresIn = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      session.expires = new Date(Date.now() + expiresIn).toISOString();
      session.user.authentication_token = token.authentication_token;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };