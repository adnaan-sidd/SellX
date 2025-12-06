import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      phone: string
      role: string
      isVerified: boolean
      isSuspended: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    phone: string
    role: string
    isVerified: boolean
    isSuspended: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    isVerified: boolean
    isSuspended: boolean
  }
}