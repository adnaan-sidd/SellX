import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSellerApprovalEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sellerId } = await request.json()

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 })
    }

    // Update seller status
    const seller = await prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerStatus: 'APPROVED'
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
        await sendSellerApprovalEmail(seller.sellerDetails.email, seller.name || 'Seller')
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: 'Seller approved successfully',
      seller
    })
  } catch (error) {
    console.error('Approve seller error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}