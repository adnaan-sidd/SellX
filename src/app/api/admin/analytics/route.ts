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
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Fetch analytics data in parallel
    const [
      revenueData,
      categoryData,
      userDistribution,
      dailyActiveUsers
    ] = await Promise.all([
      // Revenue over time (daily)
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as amount
        FROM payments
        WHERE type = 'LISTING_FEE'
          AND status = 'COMPLETED'
          AND created_at >= ${startDate}
          AND created_at <= ${endDate}
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `,

      // Products by category
      prisma.product.groupBy({
        by: ['categoryId'],
        where: {
          status: 'ACTIVE',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: true
      }),

      // User distribution (buyers vs sellers)
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),

      // Daily active users (simplified - users who logged in)
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(DISTINCT id) as users
        FROM users
        WHERE created_at >= ${startDate}
          AND created_at <= ${endDate}
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `
    ])

    // Process revenue data
    const revenue = (revenueData as any[]).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      }),
      amount: Number(item.amount)
    }))

    // Process category data
    const categories = categoryData.map((item: any) => ({
      category: item.category,
      count: item._count
    }))

    // Process user distribution
    const userDist = userDistribution.map((item: any) => ({
      name: item.role.toLowerCase(),
      value: item._count
    }))

    // Process daily active users
    const dailyActive = (dailyActiveUsers as any[]).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      }),
      users: Number(item.users)
    }))

    // Fill in missing dates for revenue chart
    const filledRevenue = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      })
      const existingData = revenue.find(r => r.date === dateStr)
      filledRevenue.push({
        date: dateStr,
        amount: existingData ? existingData.amount : 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Fill in missing dates for daily active users
    const filledDailyActive = []
    const currentDate2 = new Date(startDate)
    while (currentDate2 <= endDate) {
      const dateStr = currentDate2.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      })
      const existingData = dailyActive.find(d => d.date === dateStr)
      filledDailyActive.push({
        date: dateStr,
        users: existingData ? existingData.users : 0
      })
      currentDate2.setDate(currentDate2.getDate() + 1)
    }

    return NextResponse.json({
      revenue: filledRevenue,
      categories,
      userDistribution: userDist,
      dailyActive: filledDailyActive
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}