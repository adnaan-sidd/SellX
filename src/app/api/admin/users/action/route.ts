import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAccountSuspensionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, userId, userType } = await request.json()

    if (!action || !userId || !userType) {
      return NextResponse.json({ error: 'Action, userId, and userType are required' }, { status: 400 })
    }

    // Validate user exists and has correct role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isSuspended: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userType === 'buyer' && user.role !== 'BUYER') {
      return NextResponse.json({ error: 'User is not a buyer' }, { status: 400 })
    }

    if (userType === 'seller' && user.role !== 'SELLER') {
      return NextResponse.json({ error: 'User is not a seller' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData.isSuspended = true
        break
      case 'unsuspend':
        updateData.isSuspended = false
        break
      case 'delete':
        // Soft delete - we don't actually delete users, just mark as suspended
        // In a real app, you might want to anonymize data instead
        updateData.isSuspended = true
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        isSuspended: true,
        role: true,
        sellerDetails: true
      }
    })

    // Send email notification for suspension
    if (action === 'suspend') {
      const email = userType === 'seller' && updatedUser.sellerDetails && typeof updatedUser.sellerDetails === 'object' && 'email' in updatedUser.sellerDetails
        ? (updatedUser.sellerDetails as any).email
        : null // Buyers don't have email in sellerDetails

      if (email) {
        try {
          await sendAccountSuspensionEmail(
            email,
            updatedUser.name || 'User'
          )
        } catch (emailError) {
          console.error('Failed to send suspension email:', emailError)
          // Don't fail the request if email fails
        }
      }
    }

    return NextResponse.json({
      message: `User ${action}ed successfully`,
      user: updatedUser
    })
  } catch (error) {
    console.error('User action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}