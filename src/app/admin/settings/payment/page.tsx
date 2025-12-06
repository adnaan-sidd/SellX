"use client"

import { useState, useEffect } from "react"
import { Save, Eye, EyeOff, CreditCard, Key, Webhook, Building2, AlertTriangle } from "lucide-react"

interface PaymentSettings {
  razorpayKeyId: string
  razorpayKeySecret: string
  isLiveMode: boolean
  webhookUrl: string
  bankAccountName: string
  bankAccountNumber: string
  bankIfscCode: string
  bankName: string
}

export default function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    isLiveMode: false,
    webhookUrl: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: ''
  })

  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('razorpay')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/payment')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Payment settings saved successfully!')
      } else {
        alert('Failed to save payment settings')
      }
    } catch (error) {
      console.error('Failed to save payment settings:', error)
      alert('Failed to save payment settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof PaymentSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/api/webhooks/razorpay`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment settings...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
              <p className="text-gray-600 mt-1">Configure payment gateways and banking details</p>
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
                onClick={() => setActiveTab('razorpay')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'razorpay'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Razorpay
              </button>
              <button
                onClick={() => setActiveTab('banking')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'banking'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Banking
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'razorpay' && (
              <div className="space-y-6">
                {/* Razorpay Configuration */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Razorpay Configuration</h2>

                  <div className="space-y-6">
                    {/* Environment Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Environment Mode</h3>
                        <p className="text-sm text-gray-600">
                          Switch between test and live payment processing
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-medium ${settings.isLiveMode ? 'text-gray-500' : 'text-green-600'}`}>
                          Test Mode
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.isLiveMode}
                            onChange={(e) => handleInputChange('isLiveMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className={`text-sm font-medium ${settings.isLiveMode ? 'text-red-600' : 'text-gray-500'}`}>
                          Live Mode
                        </span>
                      </div>
                    </div>

                    {/* API Keys */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key ID
                        </label>
                        <div className="relative">
                          <Key className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={settings.razorpayKeyId}
                            onChange={(e) => handleInputChange('razorpayKeyId', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder={settings.isLiveMode ? "rzp_live_..." : "rzp_test_..."}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {settings.isLiveMode ? 'Live' : 'Test'} API Key ID from Razorpay Dashboard
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key Secret
                        </label>
                        <div className="relative">
                          <Key className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type={showSecret ? "text" : "password"}
                            value={settings.razorpayKeySecret}
                            onChange={(e) => handleInputChange('razorpayKeySecret', e.target.value)}
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder={settings.isLiveMode ? "secret_live_..." : "secret_test_..."}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {settings.isLiveMode ? 'Live' : 'Test'} API Key Secret (keep secure)
                        </p>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <div className="relative">
                        <Webhook className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={settings.webhookUrl || generateWebhookUrl()}
                          onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="https://yourdomain.com/api/webhooks/razorpay"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        URL where Razorpay will send payment notifications
                      </p>
                      <button
                        type="button"
                        onClick={() => handleInputChange('webhookUrl', generateWebhookUrl())}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Generate default URL
                      </button>
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
                      <span>Save Razorpay Settings</span>
                    </button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Never share your API Key Secret publicly</li>
                          <li>Use test keys for development and staging</li>
                          <li>Enable webhook verification in Razorpay dashboard</li>
                          <li>Regularly rotate your API keys for security</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banking' && (
              <div className="space-y-6">
                {/* Bank Account Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Account Details</h2>
                  <p className="text-gray-600 mb-6">
                    These details are used for receiving payments from Razorpay settlements.
                  </p>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccountName}
                          onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={settings.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="State Bank of India"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccountNumber}
                          onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="123456789012"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={settings.bankIfscCode}
                          onChange={(e) => handleInputChange('bankIfscCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                          placeholder="SBIN0001234"
                          maxLength={11}
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
                      <span>Save Bank Details</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className={`font-medium ${settings.isLiveMode ? 'text-red-600' : 'text-green-600'}`}>
                    {settings.isLiveMode ? 'Live' : 'Test'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Key:</span>
                  <span className="font-medium font-mono text-sm">
                    {settings.razorpayKeyId ? `${settings.razorpayKeyId.substring(0, 12)}...` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Webhook:</span>
                  <span className="font-medium text-xs">
                    {settings.webhookUrl ? 'Configured' : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Account:</span>
                  <span className="font-medium">
                    {settings.bankAccountNumber ? 'Configured' : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('razorpay')}
                  className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Configure Razorpay
                </button>
                <button
                  onClick={() => setActiveTab('banking')}
                  className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Update Bank Details
                </button>
              </div>
            </div>

            {/* Test Connection */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Test Connection</h3>
              <p className="text-green-700 text-sm mb-4">
                Verify your Razorpay configuration is working correctly.
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Test Payment Gateway
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}