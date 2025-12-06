import twilio from 'twilio'

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export const sendOTP = async (phone: string, code: string) => {
  try {
    await twilioClient.messages.create({
      body: `Your SellX verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw new Error('Failed to send OTP')
  }
}