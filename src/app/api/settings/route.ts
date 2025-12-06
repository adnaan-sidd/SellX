import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user settings - for now, return defaults since we don't have a settings table
    const settings = {
      showPhoneToVerifiedOnly: true,
      emailNotifications: true,
      chatNotifications: true,
      marketingEmails: false
    }

    // TODO: Implement database storage for user settings
    // For now, return default values

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { showPhoneToVerifiedOnly, emailNotifications, chatNotifications, marketingEmails } = await request.json()

    // TODO: Save to database
    // For now, just log the changes
    console.log('User settings updated:', {
      userId: session.user.id,
      showPhoneToVerifiedOnly,
      emailNotifications,
      chatNotifications,
      marketingEmails,
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: {
        showPhoneToVerifiedOnly,
        emailNotifications,
        chatNotifications,
        marketingEmails
      }
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}