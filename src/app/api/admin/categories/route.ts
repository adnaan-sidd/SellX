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

    // Get categories with subcategories and product counts
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            _count: {
              select: { products: true }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform data for frontend
    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      productCount: cat._count.products,
      subcategories: cat.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        productCount: sub._count.products
      })),
      createdAt: cat.createdAt.toISOString()
    }))

    return NextResponse.json({ categories: transformedCategories })
  } catch (error) {
    console.error('Admin categories fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, icon } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        icon: icon?.trim() || null
      }
    })

    return NextResponse.json({
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Admin category create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}