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
    const productId = formData.get('productId') as string
    const reason = formData.get('reason') as string
    const description = formData.get('description') as string
    const screenshotFile = formData.get('screenshot') as File | null

    if (!productId || !reason) {
      return NextResponse.json({ error: 'Product ID and reason are required' }, { status: 400 })
    }

    // Validate reason
    const validReasons = ['fake_product', 'fraud_seller', 'wrong_information', 'overpriced_product', 'scam_misleading', 'other']
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason selected' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reported this product
    const existingReport = await prisma.fraudReport.findFirst({
      where: {
        reporterId: session.user.id,
        productId: productId
      }
    })

    if (existingReport) {
      return NextResponse.json({ error: 'You have already reported this product' }, { status: 400 })
    }

    // Rate limiting: max 5 reports per day per user
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dailyReportsCount = await prisma.fraudReport.count({
      where: {
        reporterId: session.user.id,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (dailyReportsCount >= 5) {
      return NextResponse.json({ error: 'You have reached the daily limit of 5 reports' }, { status: 429 })
    }

    // Handle screenshot upload if provided
    let screenshotUrl: string | null = null
    if (screenshotFile) {
      // Validate screenshot
      if (screenshotFile.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json({ error: 'Screenshot must be less than 5MB' }, { status: 400 })
      }
      if (!screenshotFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Screenshot must be a valid image file' }, { status: 400 })
      }

      // Upload to S3
      const fileExtension = screenshotFile.name.split('.').pop()
      const fileName = `fraud-report-${session.user.id}-${Date.now()}.${fileExtension}`
      const key = `fraud-reports/${fileName}`

      const buffer = Buffer.from(await screenshotFile.arrayBuffer())

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: screenshotFile.type,
        ServerSideEncryption: 'AES256',
        Metadata: {
          userId: session.user.id,
          productId: productId,
          reportType: 'fraud_screenshot'
        }
      })

      await s3.send(command)
      screenshotUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }

    // Create fraud report
    const fraudReport = await prisma.fraudReport.create({
      data: {
        reporterId: session.user.id,
        productId: productId,
        reason: reason,
        description: description || null,
        screenshot: screenshotUrl
      }
    })

    // TODO: Send notification to admin (email/SMS)
    // This would typically integrate with an email service like SendGrid or AWS SES

    return NextResponse.json({
      message: 'Fraud report submitted successfully',
      reportId: fraudReport.id
    })

  } catch (error) {
    console.error('Create fraud report error:', error)
    return NextResponse.json({ error: 'Failed to submit fraud report' }, { status: 500 })
  }
}