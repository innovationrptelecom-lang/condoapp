
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Usuário demo em memória (substituir por DB real)
const demoUser = {
  id: "1",
  email: "admin@condoapp.com",
  // senha: admin123
  passwordHash: bcrypt.hashSync("admin123", 10),
};

export default NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "changeme",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        if (credentials.email !== demoUser.email) return null;
        const ok = await bcrypt.compare(credentials.password, demoUser.passwordHash);
        if (!ok) return null;
        return { id: demoUser.id, email: demoUser.email };
      },
    }),
  ],
});
