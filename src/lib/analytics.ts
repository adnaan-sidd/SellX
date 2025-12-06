'use client'

import { useEffect } from 'react'

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })

    // Make gtag available globally
    window.gtag = gtag
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined tracking events for SellX
export const analytics = {
  // User authentication events
  signup: (method: string) => trackEvent('sign_up', 'engagement', method),
  login: (method: string) => trackEvent('login', 'engagement', method),
  logout: () => trackEvent('logout', 'engagement'),

  // Product events
  viewProduct: (productId: string, productName: string) =>
    trackEvent('view_item', 'ecommerce', productName, parseInt(productId)),

  addToFavorites: (productId: string, productName: string) =>
    trackEvent('add_to_wishlist', 'ecommerce', productName),

  contactSeller: (productId: string, productName: string) =>
    trackEvent('contact_seller', 'engagement', productName),

  // Search and filter events
  search: (query: string) => trackEvent('search', 'engagement', query),
  filter: (filterType: string, value: string) =>
    trackEvent('filter', 'engagement', `${filterType}:${value}`),

  // Payment events
  initiatePayment: (amount: number) =>
    trackEvent('begin_checkout', 'ecommerce', 'product_listing', amount),

  paymentSuccess: (amount: number, orderId: string) =>
    trackEvent('purchase', 'ecommerce', orderId, amount),

  paymentFailed: (reason: string) =>
    trackEvent('payment_failed', 'ecommerce', reason),

  // Support events
  createSupportTicket: (category: string) =>
    trackEvent('support_ticket', 'engagement', category),

  // Fraud reporting
  reportFraud: (productId: string) =>
    trackEvent('fraud_report', 'engagement', productId),

  // Error tracking
  error: (errorType: string, errorMessage: string) =>
    trackEvent('exception', 'error', `${errorType}: ${errorMessage}`),

  // Performance tracking
  pageLoadTime: (time: number) =>
    trackEvent('page_load_time', 'performance', 'page_load', time),
}

// Custom hook for analytics
export const useAnalytics = () => {
  useEffect(() => {
    initGA()
  }, [])

  return analytics
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}