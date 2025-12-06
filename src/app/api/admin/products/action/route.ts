import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendProductSuspensionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, productId } = await request.json()

    if (!action || !productId) {
      return NextResponse.json({ error: 'Action and productId are required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let updateData: any = {}
    let actionMessage = ''

    switch (action) {
      case 'suspend':
        updateData.status = 'SUSPENDED'
        actionMessage = 'Product suspended successfully'
        break
      case 'activate':
        updateData.status = 'ACTIVE'
        actionMessage = 'Product activated successfully'
        break
      case 'delete':
        updateData.status = 'DELETED'
        actionMessage = 'Product deleted successfully'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
            sellerDetails: true
          }
        }
      }
    })

    // Send email notification for suspension
    if (action === 'suspend' && updatedProduct.seller.sellerDetails?.email) {
      try {
        await sendProductSuspensionEmail(
          updatedProduct.seller.sellerDetails.email,
          updatedProduct.seller.name || 'Seller',
          updatedProduct.title
        )
      } catch (emailError) {
        console.error('Failed to send suspension email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: actionMessage,
      product: updatedProduct
    })
  } catch (error) {
    console.error('Admin product action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}