import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// POST - Add a reply to a support ticket
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ticketId } = await params
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Reply content is required' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Reply must be less than 1000 characters' }, { status: 400 })
    }

    // Check if ticket exists and belongs to the user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        userId: session.user.id
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (ticket.status === 'RESOLVED') {
      return NextResponse.json({ error: 'Cannot add replies to resolved tickets' }, { status: 400 })
    }

    // Create reply object
    const reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      isAdmin: false,
      createdAt: new Date().toISOString()
    }

    // Update ticket with new reply
    const existingReplies = ticket.replies ? JSON.parse(ticket.replies as string) : []
    const updatedReplies = [...existingReplies, reply]

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        replies: JSON.stringify(updatedReplies),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Reply added successfully',
      reply
    })

  } catch (error) {
    console.error('Add reply error:', error)
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
}