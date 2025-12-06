import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticketId = params.id

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // For now, create a mock messages array from the existing data
    // TODO: Update schema to include proper SupportTicketMessage model
    const messages = [
      {
        id: '1',
        message: ticket.description,
        isFromAdmin: false,
        createdAt: ticket.createdAt.toISOString(),
        adminNotes: null,
        attachments: ticket.screenshot ? [ticket.screenshot] : []
      }
    ]

    // Add admin reply if exists
    if (ticket.adminReply) {
      messages.push({
        id: '2',
        message: ticket.adminReply,
        isFromAdmin: true,
        createdAt: ticket.updatedAt.toISOString(),
        adminNotes: null,
        attachments: []
      })
    }

    // Add replies from JSON field if they exist
    if (ticket.replies) {
      const replies = JSON.parse(ticket.replies as string)
      replies.forEach((reply: any, index: number) => {
        messages.push({
          id: `reply_${index + 3}`,
          message: reply.message,
          isFromAdmin: reply.isFromAdmin,
          createdAt: reply.createdAt,
          adminNotes: reply.adminNotes || null,
          attachments: reply.attachments || []
        })
      })
    }

    return NextResponse.json({
      ticket: {
        ...ticket,
        messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }
    })
  } catch (error) {
    console.error('Admin ticket detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}