import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = normalizeEmail(credentials.email as string);

        const user = await db.query.users.findFirst({
          where: eq(users.email, normalizedEmail),
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        user.email = normalizeEmail(user.email);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
        
        // Safety Check: Verify user still exists in database
        // This prevents "Ghost Sessions" where a deleted user stays logged in due to active JWT
        try {
          const userExists = await db.query.users.findFirst({
            where: eq(users.id, token.sub),
            columns: { id: true }
          });
          
          if (!userExists) {
            return null as any; // Force sign out if user no longer exists
          }
        } catch (e) {
          console.error("Session verification error:", e);
        }
      }
      return session;
    },
  },
});
