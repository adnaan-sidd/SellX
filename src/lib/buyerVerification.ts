import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function checkBuyerVerification() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return {
      isAuthenticated: false,
      isVerified: false,
      needsVerification: true
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      isVerified: true,
      buyerIdUrl: true,
      role: true
    }
  })

  if (!user) {
    return {
      isAuthenticated: true,
      isVerified: false,
      needsVerification: true
    }
  }

  return {
    isAuthenticated: true,
    isVerified: user.isVerified,
    needsVerification: !user.isVerified && user.role === 'BUYER',
    user
  }
}

export function generateVerificationError(message?: string) {
  return {
    error: 'VERIFICATION_REQUIRED',
    message: message || 'Buyer verification required to access this feature',
    redirectTo: '/verify-buyer'
  }
}

export function verifyBuyerAccess(isVerified: boolean, feature: string) {
  if (!isVerified) {
    throw generateVerificationError(`Please complete buyer verification to access ${feature}`)
  }
}