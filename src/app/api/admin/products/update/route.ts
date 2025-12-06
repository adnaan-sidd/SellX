import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, title, description, price, status } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Validate title length
    if (title && title.length > 70) {
      return NextResponse.json({ error: 'Title must be 70 characters or less' }, { status: 400 })
    }

    // Validate description length
    if (description && description.length > 5000) {
      return NextResponse.json({ error: 'Description must be 5000 characters or less' }, { status: 400 })
    }

    // Validate price
    if (price && (isNaN(price) || price <= 0)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    // Validate status
    if (status && !['ACTIVE', 'SUSPENDED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (status !== undefined) updateData.status = status

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
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

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Admin product update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}