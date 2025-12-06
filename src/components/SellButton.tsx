"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Package } from 'lucide-react'

interface SellButtonProps {
  className?: string
}

export default function SellButton({ className = '' }: SellButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSellClick = async () => {
    if (!isAuthenticated) {
      router.push('/signup')
      return
    }

    if (user?.role !== 'SELLER') {
      router.push('/become-seller')
      return
    }

    // Check seller status
    setLoading(true)
    try {
      const response = await fetch('/api/seller/status')
      const data = await response.json()

      if (response.ok) {
        if (data.sellerStatus === 'APPROVED') {
          router.push('/post-product')
        } else if (data.sellerStatus === 'PENDING') {
          router.push('/seller-status')
        } else if (data.sellerStatus === 'REJECTED') {
          router.push('/become-seller')
        } else {
          router.push('/become-seller')
        }
      } else {
        router.push('/become-seller')
      }
    } catch (error) {
      console.error('Failed to check seller status:', error)
      router.push('/become-seller')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSellClick}
      disabled={loading}
      className={`
        bg-blue-600 text-white px-4 py-2 rounded-lg font-medium 
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors flex items-center space-x-2 ${className}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Package className="w-4 h-4" />
          <span>SELL</span>
        </>
      )}
    </button>
  )
}