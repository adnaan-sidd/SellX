import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, message } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        sellerId: true,
        title: true,
        status: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cannot start chat for inactive product' }, { status: 400 })
    }

    // Check if user is the seller (sellers can't chat with themselves)
    if (product.sellerId === session.user.id) {
      return NextResponse.json({ error: 'Cannot start chat with your own product' }, { status: 400 })
    }

    // Check if buyer is verified
    const buyerVerification = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isVerified: true }
    })

    if (!buyerVerification?.isVerified) {
      return NextResponse.json({
        error: 'Buyer verification required to start chat',
        code: 'VERIFICATION_REQUIRED'
      }, { status: 403 })
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        productId: productId,
        buyerId: session.user.id
      }
    })

    if (existingChat) {
      return NextResponse.json({
        chat: existingChat,
        message: 'Chat already exists'
      })
    }

    // Create initial message if provided
    let initialMessage = null
    if (message && message.trim()) {
      const { encryptMessage } = await import('@/app/api/socket/route')
      initialMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: session.user.id,
        message: encryptMessage(message.trim()),
        imageUrl: null,
        timestamp: new Date().toISOString(),
        isRead: false
      }
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        buyerId: session.user.id,
        sellerId: product.sellerId,
        productId: productId,
        messages: initialMessage ? JSON.stringify([initialMessage]) : JSON.stringify([]),
        lastMessage: message ? message.substring(0, 100) : null,
        lastActivity: new Date(),
        buyerUnread: 0,
        sellerUnread: initialMessage ? 1 : 0,
        buyerBlocked: false,
        sellerBlocked: false
      },
      include: {
        product: {
          select: {
            title: true,
            images: true,
            price: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      chat,
      message: 'Chat created successfully'
    })

  } catch (error) {
    console.error('Create chat error:', error)
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
  }
}