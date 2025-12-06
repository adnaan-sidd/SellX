import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get general settings from database or return defaults
    const settings = {
      listingFee: 25,
      platformCommission: 0,
      supportEmail: '',
      supportPhone: '',
      officeAddress: ''
    }

    // TODO: Implement database storage for settings
    // For now, return default values

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Admin general settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingFee, platformCommission, supportEmail, supportPhone, officeAddress } = await request.json()

    // Validate inputs
    if (listingFee < 0 || platformCommission < 0 || platformCommission > 100) {
      return NextResponse.json({ error: 'Invalid fee values' }, { status: 400 })
    }

    // TODO: Save to database and implement audit logs
    // For now, just log the changes
    console.log('General settings updated:', {
      listingFee,
      platformCommission,
      supportEmail,
      supportPhone,
      officeAddress,
      updatedBy: session.user.id,
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: 'General settings updated successfully',
      settings: {
        listingFee,
        platformCommission,
        supportEmail,
        supportPhone,
        officeAddress
      }
    })
  } catch (error) {
    console.error('Admin general settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}