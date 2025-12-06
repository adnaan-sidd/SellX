import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSupportReplyEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId, message, adminNotes } = await request.json()

    if (!ticketId || !message) {
      return NextResponse.json({ error: 'Ticket ID and message are required' }, { status: 400 })
    }

    // Get the ticket
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

    // Create new reply object
    const newReply = {
      id: `reply_${Date.now()}`,
      message,
      isFromAdmin: true,
      createdAt: new Date().toISOString(),
      adminNotes: adminNotes || null,
      attachments: []
    }

    // Update ticket with new reply
    const existingReplies = ticket.replies ? JSON.parse(ticket.replies as string) : []
    const updatedReplies = [...existingReplies, newReply]

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        adminReply: message, // Keep for backward compatibility
        status: 'IN_PROGRESS' // Set to in progress when admin replies
      },
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

    // Send email notification to user
    try {
      await sendSupportReplyEmail(
        ticket.email,
        ticket.user.name || 'User',
        ticket.ticketNumber,
        message
      )
    } catch (emailError) {
      console.error('Failed to send support reply email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Reply sent successfully',
      ticket: updatedTicket
    })
  } catch (error) {
    console.error('Admin ticket reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}