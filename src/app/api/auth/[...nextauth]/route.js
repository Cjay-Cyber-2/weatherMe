import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByUsername, getUsersFromRequest } from "@/lib/authStore";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "user" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const username = credentials?.username?.trim();
        const password = credentials?.password ?? "";

        if (!username || !password) {
          return null;
        }

        const users = getUsersFromRequest(request);
        const existingUser = findUserByUsername(users, username);

        if (!existingUser || existingUser.password !== password) {
          return null;
        }

        return {
          id: username.toLowerCase(),
          name: existingUser.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  jwt: {
    maxAge: 60 * 60 * 12,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.name) {
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.name) {
        session.user.name = token.name;
      }

      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET || "fallback-secret-for-learning-purposes-only",
};

export { authOptions };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
