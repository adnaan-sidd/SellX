import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    role: (session?.user as any)?.role,
    isVerified: (session?.user as any)?.isVerified,
    isSuspended: (session?.user as any)?.isSuspended
  }
}