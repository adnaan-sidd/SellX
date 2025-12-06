import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, userIds, userType } = await request.json()

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0 || !userType) {
      return NextResponse.json({ error: 'Action, userIds array, and userType are required' }, { status: 400 })
    }

    // Validate users exist and have correct role
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        role: userType === 'buyer' ? 'BUYER' : 'SELLER'
      },
      select: { id: true, role: true }
    })

    if (users.length !== userIds.length) {
      return NextResponse.json({ error: 'Some users not found or have incorrect role' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData.isSuspended = true
        break
      case 'unsuspend':
        updateData.isSuspended = false
        break
      case 'approve':
        if (userType !== 'seller') {
          return NextResponse.json({ error: 'Approve action only available for sellers' }, { status: 400 })
        }
        updateData.sellerStatus = 'APPROVED'
        break
      case 'reject':
        if (userType !== 'seller') {
          return NextResponse.json({ error: 'Reject action only available for sellers' }, { status: 400 })
        }
        updateData.sellerStatus = 'REJECTED'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Perform bulk update
    const result = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        role: userType === 'buyer' ? 'BUYER' : 'SELLER'
      },
      data: updateData
    })

    return NextResponse.json({
      message: `${result.count} users ${action}ed successfully`,
      updatedCount: result.count
    })
  } catch (error) {
    console.error('Bulk user action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}