"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Package, ChevronDown, ChevronRight, GripVertical } from "lucide-react"

interface Category {
  id: string
  name: string
  icon?: string
  subcategories: Subcategory[]
  productCount: number
  createdAt: string
}

interface Subcategory {
  id: string
  name: string
  categoryId: string
  productCount: number
}

export default function CategoriesSettings() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Add/Edit states
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          icon: newCategoryIcon || undefined
        })
      })

      if (response.ok) {
        setNewCategoryName("")
        setNewCategoryIcon("")
        setShowAddCategory(false)
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  const handleUpdateCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: category.name,
          icon: category.icon
        })
      })

      if (response.ok) {
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handleAddSubcategory = async (categoryId: string) => {
    if (!newSubcategoryName.trim()) return

    try {
      const response = await fetch('/api/admin/categories/subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubcategoryName,
          categoryId
        })
      })

      if (response.ok) {
        setNewSubcategoryName("")
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to add subcategory:', error)
    }
  }

  const handleUpdateSubcategory = async (subcategory: Subcategory) => {
    try {
      const response = await fetch(`/api/admin/categories/subcategory/${subcategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subcategory.name
        })
      })

      if (response.ok) {
        setEditingSubcategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to update subcategory:', error)
    }
  }

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return

    try {
      const response = await fetch(`/api/admin/categories/subcategory/${subcategoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Failed to delete subcategory:', error)
    }
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
            </div>

            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Category</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (optional)
                  </label>
                  <input
                    type="text"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., smartphone"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddCategory(false)
                    setNewCategoryName("")
                    setNewCategoryIcon("")
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Categories & Subcategories</h2>
            <p className="text-gray-600 mt-1">Organize your product catalog</p>
          </div>

          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCategoryExpansion(category.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    <Package className="w-5 h-5 text-gray-400" />

                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={editingCategory.icon || ''}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, icon: e.target.value } : null)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="icon"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.productCount} products • {category.subcategories.length} subcategories
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingCategory?.id === category.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateCategory(editingCategory)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.productCount > 0}
                          className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={category.productCount > 0 ? "Cannot delete category with products" : "Delete category"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && (
                  <div className="mt-4 ml-8 space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-gray-400" />

                          {editingSubcategory?.id === subcategory.id ? (
                            <input
                              type="text"
                              value={editingSubcategory.name}
                              onChange={(e) => setEditingSubcategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                            />
                          ) : (
                            <div>
                              <span className="font-medium text-gray-900">{subcategory.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({subcategory.productCount} products)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {editingSubcategory?.id === subcategory.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateSubcategory(editingSubcategory)}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingSubcategory(null)}
                                className="p-1 text-gray-600 hover:text-gray-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingSubcategory(subcategory)}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Edit subcategory"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                                disabled={subcategory.productCount > 0}
                                className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={subcategory.productCount > 0 ? "Cannot delete subcategory with products" : "Delete subcategory"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Subcategory */}
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="New subcategory name"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubcategory(category.id)
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddSubcategory(category.id)}
                        disabled={!newSubcategoryName.trim()}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product category.</p>
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First Category
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}