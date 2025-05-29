export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors">
        Return Home
      </a>
    </div>
  )
}
