"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  Download
} from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        setTimeout(() => setSubscribed(false), 3000)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 - SellX */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">SellX</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Buy/Sell */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Buy/Sell</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-to-buy" className="text-gray-300 hover:text-white transition-colors">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link href="/how-to-sell" className="text-gray-300 hover:text-white transition-colors">
                  How to Sell
                </Link>
              </li>
              <li>
                <Link href="/safety-tips" className="text-gray-300 hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/report-issue" className="text-gray-300 hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/support/tickets" className="text-gray-300 hover:text-white transition-colors">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/safety-center" className="text-gray-300 hover:text-white transition-colors">
                  Safety Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:support@sellx.com" className="text-gray-300 hover:text-white transition-colors">
                  support@sellx.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="tel:+91-XXXXXXXXXX" className="text-gray-300 hover:text-white transition-colors">
                  +91-XXXXXXXXXX
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Newsletter</h4>
              {subscribed ? (
                <div className="text-green-400 text-sm">
                  ✓ Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-r transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SellX. All rights reserved.
            </div>

            {/* Language & App Links */}
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Language:</span>
                <select className="bg-gray-800 text-white text-sm border border-gray-700 rounded px-2 py-1">
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">தెలుగు</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>

              {/* App Download Links */}
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">Download App:</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}