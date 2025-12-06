import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSellerRejectionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sellerId, reason } = await request.json()

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 })
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
    }

    // Update seller status and store rejection reason
    const seller = await prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerStatus: 'REJECTED',
        sellerDetails: {
          rejectionReason: reason,
          rejectedAt: new Date().toISOString(),
          rejectedBy: session.user.id
        }
      },
      select: {
        id: true,
        name: true,
        sellerDetails: true
      }
    })

    // Send email notification
    if (seller.sellerDetails?.email) {
      try {
        await sendSellerRejectionEmail(seller.sellerDetails.email, seller.name || 'Seller', reason)
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: 'Seller rejected successfully',
      seller
    })
  } catch (error) {
    console.error('Reject seller error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}