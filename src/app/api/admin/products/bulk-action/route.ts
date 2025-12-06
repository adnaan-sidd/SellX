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

    const { action, productIds } = await request.json()

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Action and productIds array are required' }, { status: 400 })
    }

    let updateData: any = {}
    let actionMessage = ''

    switch (action) {
      case 'suspend':
        updateData.status = 'SUSPENDED'
        actionMessage = `${productIds.length} products suspended successfully`
        break
      case 'activate':
        updateData.status = 'ACTIVE'
        actionMessage = `${productIds.length} products activated successfully`
        break
      case 'delete':
        updateData.status = 'DELETED'
        actionMessage = `${productIds.length} products deleted successfully`
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Perform bulk update
    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds }
      },
      data: updateData
    })

    return NextResponse.json({
      message: actionMessage,
      updatedCount: result.count
    })
  } catch (error) {
    console.error('Admin bulk product action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}