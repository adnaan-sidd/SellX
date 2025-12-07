import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        _count: {
          select: {
            chats: true
          }
        }
      }
    })

    // Fetch payment separately if paymentId exists
    let payment = null
    if (product?.paymentId) {
      payment = await prisma.payment.findUnique({
        where: { id: product.paymentId },
        select: {
          id: true,
          amount: true,
          razorpayOrderId: true,
          status: true,
          createdAt: true
        }
      })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: { ...product, payment } })
  } catch (error) {
    console.error('Admin product detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}