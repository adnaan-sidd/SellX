import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { razorpay } from '@/lib/razorpay'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      productData 
    } = await request.json()

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Verify payment with Razorpay
    let payment
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id)
    } catch (razorpayError) {
      console.error('Razorpay payment fetch error:', razorpayError)
      return NextResponse.json({
        error: 'Payment verification failed - unable to fetch payment details from Razorpay'
      }, { status: 400 })
    }

    if (payment.status !== 'captured') {
      // Create failed payment record
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          amount: 25,
          type: 'LISTING_FEE',
          razorpayOrderId: razorpay_order_id,
          status: 'FAILED'
        }
      })

      return NextResponse.json({
        error: `Payment not successful. Status: ${payment.status}. Please try again or contact support.`
      }, { status: 400 })
    }

    // Upload images to S3
    const imageUrls: string[] = []
    
    for (let i = 0; i < productData.images.length; i++) {
      const file = productData.images[i]
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

    // Create payment record
    const paymentRecord = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: 25,
        type: 'LISTING_FEE',
        razorpayOrderId: razorpay_order_id,
        status: 'COMPLETED'
      }
    })

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: session.user.id,
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price),
        condition: productData.condition,
        categoryId: productData.category,
        subcategoryId: productData.subcategory,
        images: imageUrls,
        city: productData.city,
        state: productData.state,
        pincode: productData.pincode,
        status: 'ACTIVE',
        paymentId: paymentRecord.id
      }
    })

    return NextResponse.json({
      message: 'Product created successfully',
      productId: product.id,
      paymentId: paymentRecord.id
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' }, 
      { status: 500 }
    )
  }
}