import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    role: session?.user?.role,
    isVerified: session?.user?.isVerified,
    sellerStatus: session?.user?.sellerStatus,
  }
}