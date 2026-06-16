import { useEffect, useState } from 'react'
import type { Video } from '../lib/supabase'

export default function VideoEmbed({ video }: { video: Video }) {
  const [embedId, setEmbedId] = useState<string | null>(null)

  useEffect(() => {
    setEmbedId(extractEmbedId(video.url, video.platform))
  }, [video.url, video.platform])

  if (video.platform === 'youtube') {
    if (!embedId) {
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <span className="text-gray-400">Invalid YouTube URL</span>
        </div>
      )
    }

    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${embedId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (video.platform === 'tiktok') {
    return (
      <div className="w-full h-full relative">
        <iframe
          className="w-full h-full"
          src={`https://www.tiktok.com/embed/v2/${embedId}`}
          title="TikTok video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    )
  }

  return null
}

function extractEmbedId(url: string, platform: 'tiktok' | 'youtube'): string | null {
  try {
    if (platform === 'youtube') {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    }

    if (platform === 'tiktok') {
      const patterns = [
        /tiktok\.com\/@[^/]+\/video\/(\d+)/,
        /tiktok\.com\/t\/([a-zA-Z0-9]+)/,
        /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    }

    return null
  } catch {
    return null
  }
}
