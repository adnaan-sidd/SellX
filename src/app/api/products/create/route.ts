import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    const paymentId = formData.get('paymentId') as string

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

    // Get images from form data
    const images = formData.getAll('images') as File[]

    if (images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 })
    }

    if (images.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 })
    }

    // Validate images
    for (const file of images) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Each image must be less than 5MB' }, { status: 400 })
      }
    }

    // Upload images to S3
    const imageUrls: string[] = []

    for (let i = 0; i < images.length; i++) {
      const file = images[i]
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
      imageUrls.push(imageUrl)
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: session.user.id,
        title,
        description,
        price: priceNum,
        condition,
        category,
        subcategory,
        images: imageUrls,
        city,
        state,
        pincode,
        status: 'ACTIVE',
        paymentId: paymentId || null
      }
    })

    return NextResponse.json({
      message: 'Product created successfully',
      productId: product.id
    })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}