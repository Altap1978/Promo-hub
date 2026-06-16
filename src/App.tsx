import { useCallback, useState, useRef } from 'react'
import { AuthProvider, useAuth } from './lib/auth-context'
import SubmitVideo from './components/SubmitVideo'
import VideoGallery from './components/VideoCard'
import Auth from './components/Auth'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  const handleVideoSubmitted = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleAuthSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">VideoPromo</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Sign in to share videos</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Promote Your Content
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your favorite TikTok and YouTube videos. Everyone can see and watch them right here.
          </p>
        </section>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            {user ? (
              <SubmitVideo onSubmitted={handleVideoSubmitted} />
            ) : (
              <Auth onSuccess={handleAuthSuccess} />
            )}
          </div>

          <div ref={galleryRef}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest Videos</h2>
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                Public Feed
              </span>
            </div>
            <VideoGallery key={refreshKey} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>Share your videos with the world. Sign in required to submit.</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
