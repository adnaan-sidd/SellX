export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">SellX</h1>
            <nav className="space-x-4">
              <a href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</a>
              <a href="/home" className="text-blue-600 hover:text-blue-800">Home</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome to SellX</h2>
          <p className="mt-4 text-lg text-gray-600">Buy and sell products in your local area</p>
        </div>
      </main>
    </div>
  )
}
