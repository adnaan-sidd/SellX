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

    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json({ banners })
  } catch (error) {
    console.error('Admin banners fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, imageUrl, linkUrl, displayOrder } = await request.json()

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 })
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        displayOrder: displayOrder || 0
      }
    })

    return NextResponse.json({
      message: 'Banner created successfully',
      banner
    })
  } catch (error) {
    console.error('Admin banner create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}