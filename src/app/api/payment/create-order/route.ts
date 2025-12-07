import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRazorpay } from '@/lib/razorpay'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Convert amount to paise (Razorpay expects amount in paise)
    const amountInPaise = Math.round(amount * 100)

    // Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}_${session.user.id}`,
      notes: {
        userId: session.user.id,
        purpose: 'product_listing_fee'
      }
    }

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create(orderOptions)

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error('Create payment order error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' }, 
      { status: 500 }
    )
  }
}