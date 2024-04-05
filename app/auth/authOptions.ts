import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token, user }: any) {
      // user id is stored in ._id when using credentials provider
      if (token?._id) session.user._id = token._id;

      // user id is stored in ._id when using google provider
      if (token?.sub) session.user._id = token.sub;

      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
};

export default authOptions;
