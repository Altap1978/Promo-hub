import { useEffect, useState } from 'react'
import { supabase, type Video } from '../lib/supabase'
import VideoEmbed from './VideoEmbed'

export default function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Failed to load videos')
      setLoading(false)
      return
    }

    setVideos(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
        {error}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
        <p className="text-gray-500">Be the first to share a video!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const platformColors = {
    tiktok: 'bg-pink-500',
    youtube: 'bg-red-500',
  }

  const platformLabels = {
    tiktok: 'TikTok',
    youtube: 'YouTube',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-video">
        <VideoEmbed video={video} />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold ${platformColors[video.platform]}`}>
          {platformLabels[video.platform]}
        </div>
      </div>
      <div className="p-4">
        {video.title && (
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-2 truncate max-w-[70%]"
          >
            Open original
          </a>
          <span>{formatDate(video.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
