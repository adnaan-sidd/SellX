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

    // Get all tickets for stats calculation
    const tickets = await prisma.supportTicket.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true
      }
    })

    const stats = {
      total: tickets.length,
      open: tickets.filter((t: any) => t.status === 'OPEN').length,
      inProgress: tickets.filter((t: any) => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t: any) => t.status === 'RESOLVED').length,
      slaBreached: tickets.filter((t: any) => {
        if (t.status === 'RESOLVED') return false
        const hoursDiff = (new Date().getTime() - t.createdAt.getTime()) / (1000 * 60 * 60)
        return hoursDiff > 48
      }).length
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Admin ticket stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}