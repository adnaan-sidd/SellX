import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendFraudReportResolutionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, reportId, notes } = await request.json()

    if (!action || !reportId) {
      return NextResponse.json({ error: 'Action and reportId are required' }, { status: 400 })
    }

    // Check if report exists
    const report = await prisma.fraudReport.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        product: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.status === 'CLOSED') {
      return NextResponse.json({ error: 'Report is already closed' }, { status: 400 })
    }

    let updateData: any = {
      status: 'CLOSED',
      adminAction: action,
      adminNotes: notes || null
    }

    let actionMessage = ''

    // Perform actions based on the selected action
    switch (action) {
      case 'suspend_product':
        // Suspend the product
        await prisma.product.update({
          where: { id: report.productId },
          data: { status: 'SUSPENDED' }
        })
        actionMessage = 'Product suspended and report closed'
        break

      case 'suspend_seller':
        // Suspend the seller
        await prisma.user.update({
          where: { id: report.product.sellerId },
          data: { isSuspended: true }
        })
        actionMessage = 'Seller suspended and report closed'
        break

      case 'close_no_action':
        actionMessage = 'Report closed with no action taken'
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update the report
    const updatedReport = await prisma.fraudReport.update({
      where: { id: reportId },
      data: updateData,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      }
    })

    // Send email notification to reporter
    // Note: In a real implementation, you'd need to get the reporter's email
    // For now, we'll just log it since buyers don't have email in the current schema
    console.log(`Fraud report ${reportId} resolved with action: ${action}`)

    // TODO: Send email to reporter when email field is added to User model for buyers
    // if (report.reporter.email) {
    //   try {
    //     await sendFraudReportResolutionEmail(
    //       report.reporter.email,
    //       report.reporter.name || 'Reporter',
    //       report.product.title,
    //       actionMessage,
    //       notes
    //     )
    //   } catch (emailError) {
    //     console.error('Failed to send resolution email:', emailError)
    //   }
    // }

    return NextResponse.json({
      message: actionMessage,
      report: updatedReport
    })
  } catch (error) {
    console.error('Admin fraud report action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}