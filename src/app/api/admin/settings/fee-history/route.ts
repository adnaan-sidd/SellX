import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement fee history from database
    // For now, return mock data
    const history = [
      {
        id: '1',
        oldFee: 20,
        newFee: 25,
        changedBy: 'Admin User',
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        oldFee: 15,
        newFee: 20,
        changedBy: 'Admin User',
        changedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Admin fee history fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}