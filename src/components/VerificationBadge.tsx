"use client"

import { CheckCircle } from 'lucide-react'

interface VerificationBadgeProps {
  isVerified: boolean
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function VerificationBadge({ 
  isVerified, 
  size = 'md', 
  showText = true, 
  className = '' 
}: VerificationBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <CheckCircle className={`${sizeClasses[size]} text-green-500 fill-current`} />
      {showText && (
        <span className={`font-medium text-green-600 ${textSizeClasses[size]}`}>
          Verified Buyer
        </span>
      )}
    </div>
  )
}