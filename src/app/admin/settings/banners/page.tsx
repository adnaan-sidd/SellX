"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff, Image as ImageIcon, Link } from "lucide-react"

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  displayOrder: number
  createdAt: string
}

export default function BannersSettings() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddBanner, setShowAddBanner] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  // Form states
  const [bannerTitle, setBannerTitle] = useState("")
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [bannerLink, setBannerLink] = useState("")
  const [bannerOrder, setBannerOrder] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data.banners)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBanner = async () => {
    if (!bannerTitle.trim() || !bannerImage) return

    setUploading(true)
    try {
      // First upload the image
      const formData = new FormData()
      formData.append('file', bannerImage)
      formData.append('folder', 'banners')

      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadData = await uploadResponse.json()

      // Then create the banner
      const bannerResponse = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bannerTitle,
          imageUrl: uploadData.url,
          linkUrl: bannerLink || undefined,
          displayOrder: bannerOrder
        })
      })

      if (bannerResponse.ok) {
        setShowAddBanner(false)
        resetForm()
        fetchBanners()
      }
    } catch (error) {
      console.error('Failed to add banner:', error)
      alert('Failed to add banner')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateBanner = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: banner.title,
          linkUrl: banner.linkUrl,
          isActive: banner.isActive,
          displayOrder: banner.displayOrder
        })
      })

      if (response.ok) {
        setEditingBanner(null)
        fetchBanners()
      }
    } catch (error) {
      console.error('Failed to update banner:', error)
    }
  }

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Failed to delete banner:', error)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    const updatedBanner = { ...banner, isActive: !banner.isActive }
    await handleUpdateBanner(updatedBanner)
  }

  const resetForm = () => {
    setBannerTitle("")
    setBannerImage(null)
    setBannerLink("")
    setBannerOrder(0)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      setBannerImage(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banners...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
              <p className="text-gray-600 mt-1">Manage homepage banner images and links</p>
            </div>

            <button
              onClick={() => setShowAddBanner(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Banner Modal */}
        {showAddBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Banner</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Summer Sale Banner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="banner-image"
                    />
                    <label htmlFor="banner-image" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {bannerImage ? bannerImage.name : 'Click to upload banner image'}
                      </p>
                      <p className="text-xs text-gray-500">Max 5MB, JPG/PNG/WEBP</p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL (optional)
                  </label>
                  <div className="relative">
                    <Link className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={bannerLink}
                      onChange={(e) => setBannerLink(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://sellx.com/sale"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={bannerOrder}
                    onChange={(e) => setBannerOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddBanner(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBanner}
                  disabled={uploading || !bannerTitle.trim() || !bannerImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Add Banner'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Banner Image */}
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`p-1 rounded-full ${
                      banner.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                    title={banner.isActive ? 'Active' : 'Inactive'}
                  >
                    {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Order: {banner.displayOrder}
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4">
                {editingBanner?.id === banner.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingBanner.title}
                      onChange={(e) => setEditingBanner(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="url"
                      value={editingBanner.linkUrl || ''}
                      onChange={(e) => setEditingBanner(prev => prev ? { ...prev, linkUrl: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Link URL"
                    />
                    <input
                      type="number"
                      value={editingBanner.displayOrder}
                      onChange={(e) => setEditingBanner(prev => prev ? { ...prev, displayOrder: parseInt(e.target.value) || 0 } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdateBanner(editingBanner)}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingBanner(null)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{banner.title}</h3>
                    {banner.linkUrl && (
                      <p className="text-sm text-blue-600 mb-2 truncate">
                        <Link className="w-3 h-3 inline mr-1" />
                        {banner.linkUrl}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingBanner(banner)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Edit banner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first homepage banner.</p>
            <button
              onClick={() => setShowAddBanner(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Banner
            </button>
          </div>
        )}
      </div>
    </div>
  )
}