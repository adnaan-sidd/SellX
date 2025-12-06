"use client"

import { useState, useEffect } from "react"
import { Save, DollarSign, Phone, Mail, MapPin, History, TrendingUp } from "lucide-react"

interface GeneralSettings {
  listingFee: number
  platformCommission: number
  supportEmail: string
  supportPhone: string
  officeAddress: string
}

interface FeeHistory {
  id: string
  oldFee: number
  newFee: number
  changedBy: string
  changedAt: string
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>({
    listingFee: 25,
    platformCommission: 0,
    supportEmail: '',
    supportPhone: '',
    officeAddress: ''
  })

  const [feeHistory, setFeeHistory] = useState<FeeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('fees')

  useEffect(() => {
    fetchSettings()
    fetchFeeHistory()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/general')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeeHistory = async () => {
    try {
      const response = await fetch('/api/admin/settings/fee-history')
      if (response.ok) {
        const data = await response.json()
        setFeeHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch fee history:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        await fetchFeeHistory() // Refresh history if fee changed
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof GeneralSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
              <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('fees')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'fees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Fees & Revenue
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Contact Information
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'fees' && (
              <div className="space-y-6">
                {/* Listing Fee Configuration */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Listing Fee Configuration</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Fee (₹)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={settings.listingFee}
                          onChange={(e) => handleInputChange('listingFee', parseFloat(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Amount charged per product listing</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Commission (%)
                      </label>
                      <div className="relative">
                        <TrendingUp className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={settings.platformCommission}
                          onChange={(e) => handleInputChange('platformCommission', parseFloat(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Commission on successful transactions</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Update Settings</span>
                    </button>
                  </div>
                </div>

                {/* Fee Change History */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Fee Change History
                  </h2>

                  <div className="space-y-4">
                    {feeHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No fee changes recorded yet</p>
                    ) : (
                      feeHistory.map((change) => (
                        <div key={change.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              Fee changed from ₹{change.oldFee} to ₹{change.newFee}
                            </p>
                            <p className="text-sm text-gray-600">
                              Changed by {change.changedBy} on {new Date(change.changedAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            change.newFee > change.oldFee
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {change.newFee > change.oldFee ? '+' : ''}₹{change.newFee - change.oldFee}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="support@sellx.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Phone
                      </label>
                      <div className="relative">
                        <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={settings.supportPhone}
                          onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Office Address
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <textarea
                          value={settings.officeAddress}
                          onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                          rows={4}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Business Street, Tech City, State - 123456"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Update Contact Info</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing Fee:</span>
                  <span className="font-medium">₹{settings.listingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Commission:</span>
                  <span className="font-medium">{settings.platformCommission}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support Email:</span>
                  <span className="font-medium text-sm">{settings.supportEmail || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support Phone:</span>
                  <span className="font-medium text-sm">{settings.supportPhone || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('fees')}
                  className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Configure Fees
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Update Contact Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}