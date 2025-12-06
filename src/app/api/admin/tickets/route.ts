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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    const priority = searchParams.get('priority') || 'all'
    const dateRange = searchParams.get('dateRange') || 'all'
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Status filter
    if (status !== 'all') {
      where.status = status
    }

    // Category filter
    if (category !== 'all') {
      where.category = category
    }

    // Priority filter
    if (priority !== 'all') {
      where.priority = priority
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      where.createdAt = {
        gte: startDate
      }
    }

    // Build orderBy
    let orderBy: any = { updatedAt: 'desc' }
    if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder === 'asc' ? 'asc' : 'desc' }
    } else if (sortBy === 'priority') {
      // Custom priority ordering: High -> Medium -> Low
      const priorityOrder = sortOrder === 'asc' ? ['Low', 'Medium', 'High'] : ['High', 'Medium', 'Low']
      // Note: This is a simplified approach. In a real app, you might use a priority score field
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy,
      take: 100 // Limit results
    })

    // For now, just return tickets with a placeholder message count
    // TODO: Update schema to include proper message model
    const ticketsWithCount = tickets.map((ticket: any) => ({
      ...ticket,
      _count: {
        messages: 1 // Placeholder - will be updated when schema is changed
      }
    }))

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Admin tickets fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}