import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Start a transaction to delete all user data
    await prisma.$transaction(async (tx) => {
      // Delete favorites
      await tx.favorite.deleteMany({
        where: { userId }
      })

      // Delete fraud reports (both as reporter and against user's products)
      await tx.fraudReport.deleteMany({
        where: { reporterId: userId }
      })

      // Delete support tickets
      await tx.supportTicket.deleteMany({
        where: { userId }
      })

      // Delete chats (as buyer and seller)
      await tx.chat.deleteMany({
        where: {
          OR: [
            { buyerId: userId },
            { sellerId: userId }
          ]
        }
      })

      // Delete payments
      await tx.payment.deleteMany({
        where: { userId }
      })

      // Delete products (this will cascade to fraud reports on products)
      await tx.product.deleteMany({
        where: { sellerId: userId }
      })

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId }
      })
    })

    return NextResponse.json({
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}