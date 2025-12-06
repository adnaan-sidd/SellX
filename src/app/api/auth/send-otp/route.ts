import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTP } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // Check rate limiting: max 3 OTP requests per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    const recentOTPs = await prisma.oTP.count({
      where: {
        phone,
        createdAt: {
          gte: tenMinutesAgo
        }
      }
    })

    if (recentOTPs >= 3) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any existing OTP for this phone
    await prisma.oTP.deleteMany({
      where: { phone }
    })

    // Create new OTP
    await prisma.oTP.create({
      data: {
        phone,
        code,
        expiresAt
      }
    })

    // Send OTP via Twilio
    await sendOTP(phone, code)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}