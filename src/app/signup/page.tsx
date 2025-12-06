"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSendOTP = async () => {
    if (!phone) return

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("OTP sent successfully!")
        // Redirect to verify-otp with phone
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`)
      } else {
        setMessage(data.error || "Failed to send OTP")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSendOTP}
          disabled={loading || !phone}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  )
}