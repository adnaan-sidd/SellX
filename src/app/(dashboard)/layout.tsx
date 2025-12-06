export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-500 text-white p-4">
        <h1>SellX</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}