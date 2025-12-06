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

    // Get date for "today" calculations
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch all statistics in parallel
    const [
      totalBuyers,
      verifiedBuyers,
      sellerStats,
      productStats,
      totalRevenue,
      openFraudReports,
      ticketStats,
      todaySignups,
      todayListings
    ] = await Promise.all([
      // Total buyers
      prisma.user.count({
        where: { role: 'BUYER' }
      }),

      // Verified buyers
      prisma.user.count({
        where: {
          role: 'BUYER',
          isVerified: true
        }
      }),

      // Seller statistics
      prisma.user.groupBy({
        by: ['sellerStatus'],
        where: { role: 'SELLER' },
        _count: true
      }),

      // Product statistics
      prisma.product.groupBy({
        by: ['status'],
        _count: true
      }),

      // Total revenue from listing fees
      prisma.payment.aggregate({
        where: {
          type: 'LISTING_FEE',
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),

      // Open fraud reports
      prisma.fraudReport.count({
        where: { status: 'OPEN' }
      }),

      // Support ticket statistics
      prisma.supportTicket.groupBy({
        by: ['status'],
        _count: true
      }),

      // Today's signups
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),

      // Today's listings
      prisma.product.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ])

    // Process seller stats
    const sellerStatsMap = sellerStats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat.sellerStatus || 'PENDING'] = stat._count
      return acc
    }, {} as Record<string, number>)

    // Process product stats
    const productStatsMap = productStats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)

    // Process ticket stats
    const ticketStatsMap = ticketStats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)

    const stats = {
      totalBuyers,
      verifiedBuyers,
      totalSellers: sellerStats.reduce((sum: number, stat: any) => sum + stat._count, 0),
      pendingSellers: sellerStatsMap['PENDING'] || 0,
      approvedSellers: sellerStatsMap['APPROVED'] || 0,
      rejectedSellers: sellerStatsMap['REJECTED'] || 0,
      totalProducts: productStats.reduce((sum: number, stat: any) => sum + stat._count, 0),
      activeProducts: productStatsMap['ACTIVE'] || 0,
      suspendedProducts: productStatsMap['SUSPENDED'] || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
      openFraudReports,
      openTickets: ticketStatsMap['OPEN'] || 0,
      inProgressTickets: ticketStatsMap['IN_PROGRESS'] || 0,
      todaySignups,
      todayListings
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}