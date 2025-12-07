import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch recent activities from different sources
    const [
      recentProducts,
      recentSellerApplications,
      recentFraudReports,
      recentSupportTickets
    ] = await Promise.all([
      // Recent products
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            select: { name: true }
          }
        }
      }),

      // Recent seller applications
      prisma.user.findMany({
        where: { role: 'SELLER' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          sellerStatus: true,
          createdAt: true
        }
      }),

      // Recent fraud reports
      prisma.fraudReport.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { name: true }
          },
          product: {
            select: { title: true }
          }
        }
      }),

      // Recent support tickets
      prisma.supportTicket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      })
    ])

    // Combine and sort all activities
    const activities = [
      ...recentProducts.map((product: any) => ({
        id: `product-${product.id}`,
        type: 'product' as const,
        title: `New product listed: ${product.title}`,
        description: `Listed by ${product.seller.name}`,
        timestamp: product.createdAt.toISOString(),
        status: product.status
      })),

      ...recentSellerApplications.map((seller: any) => ({
        id: `seller-${seller.id}`,
        type: 'seller' as const,
        title: `New seller application: ${seller.name}`,
        description: 'Seller registration pending review',
        timestamp: seller.createdAt.toISOString(),
        status: seller.sellerStatus
      })),

      ...recentFraudReports.map((report: any) => ({
        id: `fraud-${report.id}`,
        type: 'fraud' as const,
        title: `Fraud report filed`,
        description: `${report.product.title} reported by ${report.reporter.name}`,
        timestamp: report.createdAt.toISOString(),
        status: report.status
      })),

      ...recentSupportTickets.map((ticket: any) => ({
        id: `ticket-${ticket.id}`,
        type: 'ticket' as const,
        title: `Support ticket: ${ticket.category}`,
        description: `Opened by ${ticket.user.name}`,
        timestamp: ticket.createdAt.toISOString(),
        status: ticket.status
      }))
    ]

    // Sort by timestamp (most recent first) and take top 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivity = activities.slice(0, 10)

    return NextResponse.json({ activity: recentActivity })
  } catch (error) {
    console.error('Admin activity error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}