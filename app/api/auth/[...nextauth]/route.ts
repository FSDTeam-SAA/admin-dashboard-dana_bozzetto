import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrId: { label: "Email / Client ID / Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrId || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                emailOrId: credentials.emailOrId,
                password: credentials.password,
                rememberMe:
                  credentials.rememberMe === true ||
                  credentials.rememberMe === "true",
              }),
            }
          );

          if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || "Invalid credentials");
          }

          const data = await response.json();

          return {
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            accessToken: data.token,
            refreshToken: data.refreshToken,
            avatar: data.avatar,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.avatar = token.avatar;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST };
