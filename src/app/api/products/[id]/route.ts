import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Fetch a single product
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const productId = id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
            sellerStatus: true,
            createdAt: true,
            _count: {
              select: {
                products: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a product (full update)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = id

    // Check if product exists and belongs to the user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const condition = formData.get('condition') as string
    const category = formData.get('category') as string
    const subcategory = formData.get('subcategory') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const pincode = formData.get('pincode') as string

    // Validate required fields
    if (!title || !description || !price || !condition || !category || !subcategory ||
        !city || !state || !pincode) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate title length
    if (title.length > 70) {
      return NextResponse.json({ error: 'Title must be 70 characters or less' }, { status: 400 })
    }

    // Validate description length
    if (description.length > 5000) {
      return NextResponse.json({ error: 'Description must be 5000 characters or less' }, { status: 400 })
    }

    // Validate price
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    // Validate condition
    if (!['New', 'Used'].includes(condition)) {
      return NextResponse.json({ error: 'Invalid condition' }, { status: 400 })
    }

    // Handle images
    const existingImages = formData.getAll('existingImages') as string[]
    const newImages = formData.getAll('images') as File[]

    let finalImageUrls = existingImages

    // Upload new images if any
    if (newImages.length > 0) {
      // Validate new images
      for (const file of newImages) {
        if (!file.type.startsWith('image/')) {
          return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
        }
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: 'Each image must be less than 5MB' }, { status: 400 })
        }
      }

      // Upload new images to S3
      const { s3 } = await import('@/lib/s3')
      const { PutObjectCommand } = await import('@aws-sdk/client-s3')

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i]
        const fileExtension = file.name.split('.').pop()
        const fileName = `${session.user.id}-product-${Date.now()}-${i}.${fileExtension}`
        const key = `product-images/${fileName}`

        const buffer = Buffer.from(await file.arrayBuffer())

        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ServerSideEncryption: 'AES256',
          Metadata: {
            userId: session.user.id,
            productImage: `image_${i}`
          }
        })

        await s3.send(command)
        const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        finalImageUrls.push(imageUrl)
      }
    }

    // Find category and subcategory IDs
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category }
    })
    const subcategoryRecord = await prisma.subcategory.findFirst({
      where: { name: subcategory }
    })

    if (!categoryRecord || !subcategoryRecord) {
      return NextResponse.json({ error: 'Invalid category or subcategory' }, { status: 400 })
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: priceNum,
        condition,
        categoryId: categoryRecord.id,
        subcategoryId: subcategoryRecord.id,
        images: finalImageUrls,
        city,
        state,
        pincode
      }
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - Delete a product (soft delete by setting status to DELETED)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = id

    // Check if product exists and belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Soft delete by setting status to DELETED
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'DELETED' }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update product status (mark as sold)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = id
    const { status } = await request.json()

    // Check if product exists and belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Validate status
    const validStatuses = ['ACTIVE', 'SUSPENDED', 'SOLD']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status: status as any }
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}