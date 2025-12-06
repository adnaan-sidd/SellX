"use client"

interface Filters {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  condition: string
  city: string
  sort: string
}

interface ProductFiltersProps {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
  onApply: () => void
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Vehicles', label: 'Vehicles' },
  { value: 'Home & Furniture', label: 'Home & Furniture' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Books & Sports', label: 'Books & Sports' },
  { value: 'Pets', label: 'Pets' }
]

const conditions = [
  { value: '', label: 'Any Condition' },
  { value: 'New', label: 'New' },
  { value: 'Used', label: 'Used' }
]

export default function ProductFilters({ filters, onChange, onApply }: ProductFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={filters.condition}
            onChange={(e) => onChange({ condition: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {conditions.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={() => onChange({
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            city: ''
          })}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </form>
    </div>
  )
}