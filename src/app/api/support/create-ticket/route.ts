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
    const name = formData.get('name') as string
    const mobile = formData.get('mobile') as string
    const email = formData.get('email') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const screenshotFile = formData.get('screenshot') as File | null

    // Validate required fields
    if (!name || !mobile || !email || !category || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate category
    const validCategories = [
      'Account Issues',
      'Payment Problems',
      'Verification Issues',
      'Product Listing Issues',
      'Chat Problems',
      'Report Fraud',
      'Other'
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category selected' }, { status: 400 })
    }

    // Validate description length
    if (description.length > 1000) {
      return NextResponse.json({ error: 'Description must be less than 1000 characters' }, { status: 400 })
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
      const fileName = `support-ticket-${session.user.id}-${Date.now()}.${fileExtension}`
      const key = `support-screenshots/${fileName}`

      const buffer = Buffer.from(await screenshotFile.arrayBuffer())

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: screenshotFile.type,
        ServerSideEncryption: 'AES256',
        Metadata: {
          userId: session.user.id,
          ticketType: 'support_screenshot'
        }
      })

      await s3.send(command)
      screenshotUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }

    // Generate unique ticket number: TKT-YYYYMMDD-XXXXX
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
    const randomNum = Math.floor(10000 + Math.random() * 90000) // 5-digit random number
    const ticketNumber = `TKT-${dateStr}-${randomNum}`

    // Create support ticket
    const supportTicket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        ticketNumber,
        email,
        category,
        description,
        screenshot: screenshotUrl,
        status: 'OPEN'
      }
    })

    // TODO: Send confirmation email to user
    // TODO: Notify admin about new ticket

    return NextResponse.json({
      message: 'Support ticket created successfully',
      ticketId: supportTicket.id,
      ticketNumber: supportTicket.ticketNumber
    })

  } catch (error) {
    console.error('Create support ticket error:', error)
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 })
  }
}