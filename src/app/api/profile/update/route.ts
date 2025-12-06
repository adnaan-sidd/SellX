import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, city, state, bio, profilePhoto } = await request.json()

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        bio: bio?.trim() || null,
        profilePhoto: profilePhoto?.trim() || null
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profilePhoto: true,
        city: true,
        state: true,
        bio: true,
        role: true,
        isVerified: true,
        buyerIdUrl: true,
        sellerStatus: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedUser
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}