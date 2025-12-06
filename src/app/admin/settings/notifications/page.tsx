"use client"

import { useState, useEffect } from "react"
import { Save, Mail, Bell, Eye, Edit, Send } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  isActive: boolean
  lastUpdated: string
}

interface NotificationSettings {
  welcomeEmailEnabled: boolean
  sellerApprovalEmailEnabled: boolean
  paymentConfirmationEmailEnabled: boolean
  ticketUpdateEmailEnabled: boolean
  adminEmailRecipients: string[]
}

const EMAIL_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent to new users after registration',
    defaultSubject: 'Welcome to SellX! 🎉'
  },
  {
    id: 'seller_approval',
    name: 'Seller Approval',
    description: 'Sent when seller application is approved/rejected',
    defaultSubject: 'Seller Application Update - SellX'
  },
  {
    id: 'payment_confirmation',
    name: 'Payment Confirmation',
    description: 'Sent after successful payment',
    defaultSubject: 'Payment Confirmation - SellX'
  },
  {
    id: 'ticket_update',
    name: 'Ticket Updates',
    description: 'Sent when support tickets are updated',
    defaultSubject: 'Support Ticket Update - SellX'
  }
]

export default function NotificationsSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    welcomeEmailEnabled: true,
    sellerApprovalEmailEnabled: true,
    paymentConfirmationEmailEnabled: true,
    ticketUpdateEmailEnabled: true,
    adminEmailRecipients: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [editingSubject, setEditingSubject] = useState("")
  const [editingContent, setEditingContent] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")

  useEffect(() => {
    fetchTemplates()
    fetchSettings()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/notifications/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/notifications/settings')
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

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setActiveTemplate(templateId)
      setEditingSubject(template.subject)
      setEditingContent(template.htmlContent)
    }
  }

  const handleSaveTemplate = async () => {
    if (!activeTemplate) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/notifications/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeTemplate,
          subject: editingSubject,
          htmlContent: editingContent
        })
      })

      if (response.ok) {
        await fetchTemplates()
        setActiveTemplate(null)
        setEditingSubject("")
        setEditingContent("")
      }
    } catch (error) {
      console.error('Failed to save template:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Notification settings saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddAdminEmail = () => {
    if (newAdminEmail && !settings.adminEmailRecipients.includes(newAdminEmail)) {
      setSettings(prev => ({
        ...prev,
        adminEmailRecipients: [...prev.adminEmailRecipients, newAdminEmail]
      }))
      setNewAdminEmail("")
    }
  }

  const handleRemoveAdminEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      adminEmailRecipients: prev.adminEmailRecipients.filter(e => e !== email)
    }))
  }

  const handleTestEmail = async (templateId: string) => {
    try {
      const response = await fetch('/api/admin/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId })
      })

      if (response.ok) {
        alert('Test email sent successfully!')
      } else {
        alert('Failed to send test email')
      }
    } catch (error) {
      console.error('Failed to send test email:', error)
    }
  }

  const getTemplateInfo = (id: string) => {
    return EMAIL_TEMPLATES.find(t => t.id === id) || { name: id, description: '', defaultSubject: '' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Manage email templates and notification settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h2>
              <div className="space-y-3">
                {EMAIL_TEMPLATES.map((template) => {
                  const templateData = templates.find(t => t.id === template.id)
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleEditTemplate(template.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        activeTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          {templateData && (
                            <p className="text-xs text-gray-500 mt-1">
                              Updated {new Date(templateData.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTestEmail(template.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Send test email"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTemplate(template.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Template Editor / Settings */}
          <div className="lg:col-span-2">
            {activeTemplate ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit {getTemplateInfo(activeTemplate).name}
                    </h2>
                    <p className="text-gray-600 mt-1">{getTemplateInfo(activeTemplate).description}</p>
                  </div>
                  <button
                    onClick={handleSaveTemplate}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Template</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={editingSubject}
                      onChange={(e) => setEditingSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Content (HTML)
                    </label>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Enter HTML email content"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use HTML formatting. Available variables: &#123;&#123;userName&#125;&#125;, &#123;&#123;productTitle&#125;&#125;, etc.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Email Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Welcome Emails</h3>
                        <p className="text-sm text-gray-600">Send welcome emails to new users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.welcomeEmailEnabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, welcomeEmailEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Seller Approval Emails</h3>
                        <p className="text-sm text-gray-600">Notify users about seller application status</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.sellerApprovalEmailEnabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, sellerApprovalEmailEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Payment Confirmations</h3>
                        <p className="text-sm text-gray-600">Send payment confirmation emails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentConfirmationEmailEnabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, paymentConfirmationEmailEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Support Ticket Updates</h3>
                        <p className="text-sm text-gray-600">Notify users about ticket status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.ticketUpdateEmailEnabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, ticketUpdateEmailEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>

                {/* Admin Email Recipients */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Admin Email Recipients
                  </h2>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@sellx.com"
                      />
                      <button
                        onClick={handleAddAdminEmail}
                        disabled={!newAdminEmail.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {settings.adminEmailRecipients.map((email) => (
                        <div key={email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{email}</span>
                          <button
                            onClick={() => handleRemoveAdminEmail(email)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {settings.adminEmailRecipients.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No admin email recipients configured</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}