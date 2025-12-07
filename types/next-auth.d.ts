import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      phone: string
      role: string
      isVerified: boolean
      sellerStatus?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    phone: string
    role: string
    isVerified: boolean
    sellerStatus?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    phone: string
    role: string
    isVerified: boolean
    sellerStatus?: string
  }
}