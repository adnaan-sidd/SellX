import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { twilioClient } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database (expires in 5 minutes)
    await prisma.oTP.upsert({
      where: { phone },
      update: {
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
      create: {
        phone,
        code: otp,
        purpose: 'VERIFICATION',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    // Send OTP via SMS
    try {
      if (!twilioClient) {
        throw new Error('SMS service not configured')
      }
      await twilioClient.messages.create({
        body: `Your SellX verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })
    } catch (smsError) {
      console.error('SMS sending failed:', smsError)
      return NextResponse.json(
        { error: 'Failed to send SMS. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
