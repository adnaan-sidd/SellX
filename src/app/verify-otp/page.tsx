"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = 'force-dynamic'

function VerifyOTPContent() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone")

  useEffect(() => {
    if (!phone) {
      router.push("/signup")
    }
  }, [phone, router])

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) return

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp })
      })

      const data = await response.json()

      if (response.ok) {
        // Sign in with NextAuth
        const result = await signIn("credentials", {
          phone,
          redirect: false
        })

        if (result?.ok) {
          router.push("/home")
        } else {
          setMessage("Failed to sign in")
        }
      } else {
        setMessage(data.error || "Invalid OTP")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("OTP resent successfully!")
      } else {
        setMessage(data.error || "Failed to resend OTP")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>
        <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to {phone}</p>
        <div className="mb-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="w-full p-2 border rounded text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50 mb-2"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          onClick={handleResendOTP}
          disabled={resendLoading}
          className="w-full p-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  )
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-gray-600">Loading...</div></div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}