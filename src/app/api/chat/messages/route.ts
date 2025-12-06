import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decryptMessage } from '@/app/api/socket/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cannot access chat for inactive product' }, { status: 400 })
    }

    // Find existing chat or create new one
    let chat = await prisma.chat.findFirst({
      where: {
        productId: productId,
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        product: {
          select: {
            title: true,
            images: true,
            price: true,
            city: true,
            state: true
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
            name: true,
            phone: true
          }
        }
      }
    })

    // If no chat exists, create one
    if (!chat) {
      // Check buyer verification
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

      chat = await prisma.chat.create({
        data: {
          buyerId: session.user.id,
          sellerId: product.sellerId,
          productId: productId,
          messages: JSON.stringify([]),
          buyerUnread: 0,
          sellerUnread: 0,
          buyerBlocked: false,
          sellerBlocked: false
        },
        include: {
          product: {
            select: {
              title: true,
              images: true,
              price: true,
              city: true,
              state: true
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
              name: true,
              phone: true
            }
          }
        }
      })
    }

    // Decrypt messages for the user
    const rawMessages = chat.messages ? JSON.parse(chat.messages) : []
    const decryptedMessages = rawMessages.map((msg: any) => ({
      ...msg,
      message: msg.message ? decryptMessage(msg.message) : ''
    }))

    // Check if user is blocked
    const isBuyer = chat.buyerId === session.user.id
    const isBlocked = isBuyer ? chat.sellerBlocked : chat.buyerBlocked
    const blockedByMe = isBuyer ? chat.buyerBlocked : chat.sellerBlocked

    return NextResponse.json({
      chat,
      messages: decryptedMessages,
      isBlocked,
      blockedByMe
    })

  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json({ error: 'Failed to load chat' }, { status: 500 })
  }
}