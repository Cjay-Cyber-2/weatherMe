import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "user" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Initialize mock DB if it doesn't exist yet on first boot
        if (!global.mockUsersDB) {
          global.mockUsersDB = [{ username: "user", password: "password" }];
        }

        // Validate credentials against our in-memory "database"
        const existingUser = global.mockUsersDB.find(
          (u) => u.username.toLowerCase() === credentials.username.toLowerCase() && u.password === credentials.password
        );

        if (existingUser) {
          return { id: Math.random().toString(), name: existingUser.username };
        }
        
        // If it doesn't match an actual registered user, reject login
        return null; 
      }
    })
  ],
  pages: {
    signIn: '/login', // Set the custom login page
  },
  session: {
    strategy: "jwt", // Use JWT since we don't have a database
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-learning-purposes-only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
