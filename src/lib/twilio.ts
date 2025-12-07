import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null

export const sendSMS = async (to: string, message: string) => {
  if (!twilioClient) {
    console.warn("Twilio not configured")
    return null
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    return result
  } catch (error) {
    console.error("Error sending SMS:", error)
    return null
  }
}