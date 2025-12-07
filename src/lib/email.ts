import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    email: process.env.FROM_EMAIL || 'noreply@sellx.com',
    name: 'SellX Team'
  },
  templates: {
    welcome: 'd-welcome-template-id',
    otp: 'd-otp-template-id',
    paymentSuccess: 'd-payment-success-template-id',
    productListed: 'd-product-listed-template-id',
    buyerInterest: 'd-buyer-interest-template-id',
    supportResponse: 'd-support-response-template-id',
    passwordReset: 'd-password-reset-template-id',
  }
}

// Email sending utility
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
  templateId?: string,
  dynamicData?: Record<string, any>
) {
  try {
    const msg = {
      to,
      from: EMAIL_CONFIG.from,
      subject,
      html,
      text,
      templateId,
      dynamicTemplateData: dynamicData,
    }

    const result = await sgMail.send(msg)
    console.log('Email sent successfully:', result[0].statusCode)
    return { success: true, messageId: result[0].headers['x-message-id'] }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Predefined email templates
export const emailTemplates = {
  // Welcome email for new users
  welcome: (user: { name: string; email: string }) => ({
    subject: 'Welcome to SellX! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to SellX, ${user.name}!</h1>
        <p>Thank you for joining India's trusted marketplace for buying and selling products.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Browse thousands of products</li>
          <li>List your items for sale</li>
          <li>Connect with buyers and sellers</li>
          <li>Enjoy secure payments</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-buyer"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Complete Your Profile
        </a>
        <p>Happy trading!</p>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Welcome to SellX, ${user.name}!

Thank you for joining India's trusted marketplace.

Complete your profile: ${process.env.NEXT_PUBLIC_APP_URL}/verify-buyer

Happy trading!
The SellX Team`
  }),

  // OTP verification email
  otp: (user: { name: string; email: string }, otp: string) => ({
    subject: 'Your SellX Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Verify Your Email</h1>
        <p>Hello ${user.name},</p>
        <p>Your verification code for SellX is:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #3B82F6; letter-spacing: 4px;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Hello ${user.name},

Your verification code for SellX is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

The SellX Team`
  }),

  // Payment success email
  paymentSuccess: (user: { name: string }, product: { title: string; id: string }, payment: { amount: number; orderId: string }) => ({
    subject: 'Payment Successful - Product Listed! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Payment Successful!</h1>
        <p>Hello ${user.name},</p>
        <p>Your payment of ₹${payment.amount} has been processed successfully.</p>
        <div style="background-color: #F0FDF4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="margin: 0 0 10px 0;">Product Listed:</h3>
          <p style="margin: 0; font-weight: bold;">${product.title}</p>
          <p style="margin: 5px 0 0 0; color: #6B7280;">Order ID: ${payment.orderId}</p>
        </div>
        <p>Your product is now live and visible to buyers!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Your Product
        </a>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Payment Successful!

Hello ${user.name},

Your payment of ₹${payment.amount} has been processed successfully.

Product Listed: ${product.title}
Order ID: ${payment.orderId}

Your product is now live! View it here: ${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}

The SellX Team`
  }),

  // Buyer interest notification
  buyerInterest: (seller: { name: string }, product: { title: string; id: string }, buyer: { name: string; phone: string }) => ({
    subject: 'Someone is interested in your product! 💬',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">New Buyer Interest!</h1>
        <p>Hello ${seller.name},</p>
        <p>Great news! A buyer is interested in your product:</p>
        <div style="background-color: #FFFBEB; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <h3 style="margin: 0 0 10px 0;">${product.title}</h3>
          <p style="margin: 0;"><strong>Buyer:</strong> ${buyer.name}</p>
          <p style="margin: 5px 0 0 0;"><strong>Phone:</strong> ${buyer.phone}</p>
        </div>
        <p>Contact the buyer to arrange the sale!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Product & Chat
        </a>
        <p>The SellX Team</p>
      </div>
    `,
    text: `New Buyer Interest!

Hello ${seller.name},

A buyer is interested in your product: ${product.title}

Buyer: ${buyer.name}
Phone: ${buyer.phone}

Contact them to arrange the sale!

View product: ${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}

The SellX Team`
  }),

  // Support ticket response
  supportResponse: (user: { name: string }, ticket: { number: string; category: string }, response: string) => ({
    subject: 'Response to your support ticket',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Support Response</h1>
        <p>Hello ${user.name},</p>
        <p>We've responded to your support ticket:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Ticket #${ticket.number}</strong></p>
          <p><strong>Category:</strong> ${ticket.category}</p>
          <div style="margin-top: 15px; padding: 15px; background-color: white; border-radius: 4px;">
            ${response.replace(/\n/g, '<br>')}
          </div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/support/tickets"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Full Conversation
        </a>
        <p>The SellX Support Team</p>
      </div>
    `,
    text: `Support Response

Hello ${user.name},

We've responded to your support ticket #${ticket.number} (${ticket.category}):

${response}

View full conversation: ${process.env.NEXT_PUBLIC_APP_URL}/support/tickets

The SellX Support Team`
  }),

  // Password reset email
  passwordReset: (user: { name: string }, resetToken: string) => ({
    subject: 'Reset your SellX password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Reset Your Password</h1>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Reset Your Password

Hello ${user.name},

You requested to reset your password. Use this link to set a new password:
${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

The SellX Team`
  }),
}

// Email queue system (simplified - in production use a proper queue)
export class EmailQueue {
  private queue: Array<{
    to: string
    subject: string
    html: string
    text?: string
    priority: 'high' | 'normal' | 'low'
    retryCount: number
  }> = []

  private isProcessing = false

  add(to: string, subject: string, html: string, text?: string, priority: 'high' | 'normal' | 'low' = 'normal') {
    this.queue.push({ to, subject, html, text, priority, retryCount: 0 })
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    this.process()
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    while (this.queue.length > 0) {
      const email = this.queue.shift()!
      try {
        await sendEmail(email.to, email.subject, email.html, email.text)
      } catch (error) {
        console.error('Failed to send email:', error)
        if (email.retryCount < 3) {
          email.retryCount++
          this.queue.push(email) // Retry later
        }
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    this.isProcessing = false
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    }
  }
}

export const emailQueue = new EmailQueue()

// Seller approval email
export async function sendSellerApprovalEmail(to: string, name: string) {
  const { subject, html, text } = {
    subject: 'Seller Account Approved! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Congratulations ${name}!</h1>
        <p>Your seller account has been approved.</p>
        <p>You can now start listing products on SellX.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Congratulations ${name}! Your seller account has been approved. You can now start listing products on SellX.`
  }
  return await sendEmail(to, subject, html, text)
}

// Seller rejection email
export async function sendSellerRejectionEmail(to: string, name: string, reason: string) {
  const { subject, html, text } = {
    subject: 'Seller Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EF4444;">Seller Application Status</h1>
        <p>Hello ${name},</p>
        <p>Unfortunately, your seller application was not approved at this time.</p>
        <div style="background-color: #FEE2E2; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>You can reapply after addressing the issues mentioned above.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Hello ${name}, your seller application was not approved. Reason: ${reason}. You can reapply after addressing the issues.`
  }
  return await sendEmail(to, subject, html, text)
}

// Account suspension email
export async function sendAccountSuspensionEmail(to: string, name: string, reason: string) {
  const { subject, html, text } = {
    subject: 'Account Suspended - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EF4444;">Account Suspended</h1>
        <p>Hello ${name},</p>
        <p>Your account has been suspended due to the following reason:</p>
        <div style="background-color: #FEE2E2; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p>${reason}</p>
        </div>
        <p>Please contact our support team to resolve this issue.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Contact Support
        </a>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Hello ${name}, your account has been suspended. Reason: ${reason}. Please contact support.`
  }
  return await sendEmail(to, subject, html, text)
}

// Product suspension email
export async function sendProductSuspensionEmail(to: string, name: string, productTitle: string, reason: string) {
  const { subject, html, text } = {
    subject: 'Product Suspended - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Product Suspended</h1>
        <p>Hello ${name},</p>
        <p>Your product "${productTitle}" has been suspended.</p>
        <div style="background-color: #FFFBEB; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>Please contact our support team for more information.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Contact Support
        </a>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Hello ${name}, your product "${productTitle}" has been suspended. Reason: ${reason}. Please contact support.`
  }
  return await sendEmail(to, subject, html, text)
}

// Support ticket response email
export async function sendSupportTicketResponse(to: string, name: string, ticketNumber: string, response: string) {
  const { subject, html, text } = emailTemplates.supportResponse(
    { name },
    { number: ticketNumber, category: 'Support' },
    response
  )
  return await sendEmail(to, subject, html, text)
}

// Fraud report resolution email
export async function sendFraudReportResolutionEmail(to: string, name: string, reportId: string, action: string, notes?: string) {
  const { subject, html, text } = {
    subject: 'Fraud Report Resolution Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Fraud Report Update</h1>
        <p>Hello ${name},</p>
        <p>Your fraud report (${reportId}) has been reviewed and ${action}.</p>
        ${notes ? `
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Admin Notes:</strong></p>
          <p>${notes}</p>
        </div>
        ` : ''}
        <p>Thank you for helping keep our marketplace safe.</p>
        <p>The SellX Team</p>
      </div>
    `,
    text: `Hello ${name}, your fraud report (${reportId}) has been reviewed and ${action}.${notes ? ' Admin Notes: ' + notes : ''} Thank you for helping keep our marketplace safe.`
  }
  return await sendEmail(to, subject, html, text)
}

// Support ticket reply email
export async function sendSupportReplyEmail(to: string, name: string, ticketNumber: string, reply: string) {
  const { subject, html, text } = {
    subject: `Support Ticket #${ticketNumber} - New Reply`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Support Ticket Reply</h1>
        <p>Hello ${name},</p>
        <p>We have replied to your support ticket #${ticketNumber}:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p>${reply.replace(/\n/g, '<br>')}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support/tickets"
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Ticket
        </a>
        <p>The SellX Support Team</p>
      </div>
    `,
    text: `Hello ${name}, we have replied to your support ticket #${ticketNumber}: ${reply}`
  }
  return await sendEmail(to, subject, html, text)
}