import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import knex from "@/lib/knex";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(app, { user }) {
      try {
        let existingUser = await app.knex("users").where({ email: user.email }).first();

        if (!existingUser) {
          const [newUser] = await knex("users")
            .insert({
              name: user.name,
              email: user.email,
              image: user.image,
            })
            .returning("*"); // Returns inserted user data

          existingUser = newUser;
        }

        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      const jwtToken = jwt.sign(
        { id: session.user.id, email: session.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      session.jwt = jwtToken;
      return session;
    },
  },
});
