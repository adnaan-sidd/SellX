import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone }
        })

        if (!user || !user.isVerified) return null

        return {
          id: user.id,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isSuspended: user.isSuspended
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role
        token.isVerified = (user as any).isVerified
        token.isSuspended = (user as any).isSuspended
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = (token as any).role
        session.user.isVerified = (token as any).isVerified
        session.user.isSuspended = (token as any).isSuspended
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
}