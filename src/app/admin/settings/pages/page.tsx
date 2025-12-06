"use client"

import { useState, useEffect } from "react"
import { Save, FileText, Eye, Edit, Globe } from "lucide-react"

interface StaticPage {
  id: string
  slug: string
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
  isPublished: boolean
  lastUpdated: string
}

const PAGES = [
  { slug: 'terms', title: 'Terms & Conditions', description: 'Legal terms for using the platform' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'How we handle user data and privacy' },
  { slug: 'about', title: 'About Us', description: 'Information about SellX and our mission' },
  { slug: 'contact', title: 'Contact Us', description: 'Contact information and support details' },
  { slug: 'faq', title: 'FAQ', description: 'Frequently asked questions and answers' }
]

export default function PagesSettings() {
  const [pages, setPages] = useState<StaticPage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePage, setActivePage] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingMetaTitle, setEditingMetaTitle] = useState("")
  const [editingMetaDescription, setEditingMetaDescription] = useState("")

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPage = (pageSlug: string) => {
    const page = pages.find(p => p.slug === pageSlug)
    if (page) {
      setActivePage(pageSlug)
      setEditingContent(page.content)
      setEditingMetaTitle(page.metaTitle || '')
      setEditingMetaDescription(page.metaDescription || '')
    }
  }

  const handleSavePage = async () => {
    if (!activePage) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/pages/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: activePage,
          content: editingContent,
          metaTitle: editingMetaTitle || undefined,
          metaDescription: editingMetaDescription || undefined
        })
      })

      if (response.ok) {
        await fetchPages()
        setActivePage(null)
        setEditingContent("")
        setEditingMetaTitle("")
        setEditingMetaDescription("")
      }
    } catch (error) {
      console.error('Failed to save page:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewPage = (pageSlug: string) => {
    const page = pages.find(p => p.slug === pageSlug)
    if (page) {
      window.open(`/${pageSlug}`, '_blank')
    }
  }

  const getPageInfo = (slug: string) => {
    return PAGES.find(p => p.slug === slug) || { title: slug, description: '' }
  }

  const getPageData = (slug: string) => {
    return pages.find(p => p.slug === slug) || {
      content: '',
      metaTitle: '',
      metaDescription: '',
      isPublished: false,
      lastUpdated: ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pages...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Static Pages</h1>
              <p className="text-gray-600 mt-1">Manage website content and SEO settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pages</h2>
              <div className="space-y-2">
                {PAGES.map((page) => {
                  const pageData = getPageData(page.slug)
                  return (
                    <button
                      key={page.slug}
                      onClick={() => handleEditPage(page.slug)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activePage === page.slug
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{page.title}</h3>
                          <p className="text-sm text-gray-600">{page.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePreviewPage(page.slug)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Preview page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditPage(page.slug)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit page"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {pageData.lastUpdated && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated {new Date(pageData.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Page Editor */}
          <div className="lg:col-span-3">
            {activePage ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit {getPageInfo(activePage).title}
                    </h2>
                    <p className="text-gray-600 mt-1">{getPageInfo(activePage).description}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePreviewPage(activePage)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={handleSavePage}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* SEO Settings */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      SEO Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={editingMetaTitle}
                          onChange={(e) => setEditingMetaTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`SellX - ${getPageInfo(activePage).title}`}
                          maxLength={60}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {editingMetaTitle.length}/60 characters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={editingMetaDescription}
                          onChange={(e) => setEditingMetaDescription(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Learn about ${getPageInfo(activePage).title.toLowerCase()} on SellX`}
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {editingMetaDescription.length}/160 characters
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Content
                    </label>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Enter page content here..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports basic HTML formatting
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a page to edit</h3>
                <p className="text-gray-600">
                  Choose a page from the list to start editing its content and SEO settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}