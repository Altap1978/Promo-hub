import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Platform = 'tiktok' | 'youtube' | ''

export default function SubmitVideo({ onSubmitted }: { onSubmitted: () => void }) {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState<Platform>('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const detectPlatform = (inputUrl: string): Platform => {
    if (inputUrl.includes('tiktok.com')) return 'tiktok'
    if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) return 'youtube'
    return ''
  }

  const handleUrlChange = (inputUrl: string) => {
    setUrl(inputUrl)
    const detected = detectPlatform(inputUrl)
    setPlatform(detected)
    if (detected && !error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!url.trim()) {
      setError('Please enter a video URL')
      return
    }

    const detectedPlatform = detectPlatform(url)
    if (!detectedPlatform) {
      setError('Please enter a valid TikTok or YouTube URL')
      return
    }

    setLoading(true)

    const { error: insertError } = await supabase.from('videos').insert({
      url: url.trim(),
      platform: detectedPlatform,
      title: title.trim() || null,
    })

    setLoading(false)

    if (insertError) {
      if (insertError.code === '42501' || insertError.message.includes('policy')) {
        setError('You must be signed in to share videos.')
      } else {
        setError('Failed to submit video. Please try again.')
      }
      return
    }

    setSuccess(true)
    setUrl('')
    setTitle('')
    setPlatform('')
    onSubmitted()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Promote Your Video</h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste your TikTok or YouTube link..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          {platform && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  platform === 'tiktok'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {platform === 'tiktok' ? 'TikTok' : 'YouTube'}
              </span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your video a catchy title..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            Video submitted successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          {loading ? 'Submitting...' : 'Share Video'}
        </button>
      </div>
    </form>
  )
}
