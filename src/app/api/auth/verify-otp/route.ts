import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signIn } from 'next-auth/react'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 })
    }

    // Find the OTP
    const otp = await prisma.oTP.findUnique({
      where: { phone }
    })

    if (!otp) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 400 })
    }

    // Check if expired
    if (otp.expiresAt < new Date()) {
      await prisma.oTP.delete({ where: { phone } })
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
    }

    // Check code
    if (otp.code !== code) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // Delete the OTP
    await prisma.oTP.delete({ where: { phone } })

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: 'BUYER', // Default role
          isVerified: true
        }
      })
    } else {
      // Update verification status
      user = await prisma.user.update({
        where: { phone },
        data: { isVerified: true }
      })
    }

    // Since this is API route, we can't use signIn directly
    // Instead, return success and let client handle signIn
    return NextResponse.json({
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}