import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Shuffle, Repeat, Heart, Clock, Waves, Headphones } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const SoundTherapy = () => {
  const { t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentPlaylist, setCurrentPlaylist] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none') // 'none', 'one', 'all'
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const [audioReady, setAudioReady] = useState(false)

  // Using base64 encoded audio data or local audio files for better reliability
  const playlists = [
    {
      id: 1,
      name: "Calm Focus",
      description: "Gentle sounds for concentration and productivity",
      color: "from-blue-400 to-cyan-500",
      tracks: [
        { 
          id: 1, 
          name: "Peaceful Rain", 
          artist: "Nature Sounds", 
          duration: "10:00", 
          url: "/audio/rain.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 2, 
          name: "Ocean Waves", 
          artist: "Relaxing Nature", 
          duration: "15:30", 
          url: "/audio/ocean.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 3, 
          name: "Forest Birds", 
          artist: "Natural Harmony", 
          duration: "12:15", 
          url: "/audio/birds.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 4, 
          name: "Gentle Stream", 
          artist: "Water Sounds", 
          duration: "20:00", 
          url: "/audio/stream.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        }
      ]
    },
    {
      id: 2,
      name: "Deep Relaxation",
      description: "Soothing melodies for stress relief and unwinding",
      color: "from-purple-400 to-indigo-500",
      tracks: [
        { 
          id: 5, 
          name: "Tibetan Bowls", 
          artist: "Meditation Masters", 
          duration: "18:45", 
          url: "/audio/tibetan-bowls.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 6, 
          name: "Soft Piano", 
          artist: "Peaceful Melodies", 
          duration: "14:20", 
          url: "/audio/piano.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 7, 
          name: "Wind Chimes", 
          artist: "Zen Garden", 
          duration: "16:30", 
          url: "/audio/wind-chimes.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 8, 
          name: "Whale Songs", 
          artist: "Ocean Deep", 
          duration: "22:10", 
          url: "/audio/whale.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        }
      ]
    },
    {
      id: 3,
      name: "Sleep & Dreams",
      description: "Gentle sounds to help you fall asleep peacefully",
      color: "from-indigo-400 to-purple-500",
      tracks: [
        { 
          id: 9, 
          name: "Night Rain", 
          artist: "Sleep Sounds", 
          duration: "45:00", 
          url: "/audio/night-rain.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 10, 
          name: "Lullaby Hum", 
          artist: "Dream Therapy", 
          duration: "30:15", 
          url: "/audio/lullaby.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 11, 
          name: "White Noise", 
          artist: "Sound Masking", 
          duration: "60:00", 
          url: "/audio/white-noise.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 12, 
          name: "Cricket Symphony", 
          artist: "Night Nature", 
          duration: "35:30", 
          url: "/audio/crickets.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        }
      ]
    },
    {
      id: 4,
      name: "Energy Boost",
      description: "Uplifting sounds to energize and motivate",
      color: "from-green-400 to-teal-500",
      tracks: [
        { 
          id: 13, 
          name: "Morning Birds", 
          artist: "Dawn Chorus", 
          duration: "12:45", 
          url: "/audio/morning-birds.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 14, 
          name: "Upbeat Nature", 
          artist: "Energy Flow", 
          duration: "8:30", 
          url: "/audio/upbeat-nature.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 15, 
          name: "Flowing Water", 
          artist: "River Rush", 
          duration: "15:20", 
          url: "/audio/flowing-water.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 16, 
          name: "Wind Through Trees", 
          artist: "Forest Energy", 
          duration: "11:10", 
          url: "/audio/wind-trees.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        }
      ]
    },
    {
      id: 5,
      name: "Anxiety Relief",
      description: "Calming frequencies designed to reduce anxiety",
      color: "from-pink-400 to-rose-500",
      tracks: [
        { 
          id: 17, 
          name: "432Hz Healing", 
          artist: "Frequency Healing", 
          duration: "25:00", 
          url: "/audio/432hz.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 18, 
          name: "Breath Sync", 
          artist: "Mindful Audio", 
          duration: "10:30", 
          url: "/audio/breath-sync.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 19, 
          name: "Calm Waves", 
          artist: "Peace Sounds", 
          duration: "18:15", 
          url: "/audio/calm-waves.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        },
        { 
          id: 20, 
          name: "Heart Coherence", 
          artist: "Balance Tones", 
          duration: "20:45", 
          url: "/audio/heart-coherence.mp3",
          fallback: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
        }
      ]
    }
  ]

  const currentPlaylistData = playlists[currentPlaylist]
  const currentTrackData = currentPlaylistData.tracks[currentTrack]

  // Memoized event handlers to prevent unnecessary re-renders
  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const updateDuration = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      audioRef.current?.play()
    } else {
      nextTrack()
    }
  }, [repeatMode])

  const handleError = useCallback((e) => {
    console.error('Audio error:', e)
    setIsPlaying(false)
    setIsLoading(false)
    setError('Failed to load audio file. Trying fallback...')
    
    // Try fallback audio
    if (audioRef.current && currentTrackData.fallback) {
      audioRef.current.src = currentTrackData.fallback
      audioRef.current.load()
      audioRef.current.play().catch(error => {
        console.error('Fallback audio also failed:', error)
        setError('Audio file unavailable. Please try another track.')
      })
    } else {
      setError('Audio file unavailable. Please try another track.')
    }
  }, [currentTrackData])

  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
    setError(null)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Set up audio element with proper event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set initial volume
    audio.volume = volume

    // Add event listeners
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleTrackEnd)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    // Cleanup function
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleTrackEnd)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [updateTime, updateDuration, handleTrackEnd, handleError, handleLoadStart, handleCanPlay, volume])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Load new track when current track changes
  useEffect(() => {
    if (audioRef.current && currentTrackData) {
      setIsLoading(true)
      setError(null)
      audioRef.current.src = currentTrackData.url
      audioRef.current.load()
    }
  }, [currentTrack, currentPlaylist])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audio.play().catch(error => {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
        setIsLoading(false)
        setError('Failed to play audio. Please try again.')
      })
    }
  }, [isPlaying])

  const nextTrack = useCallback(() => {
    const playlist = currentPlaylistData.tracks
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1)
    } else if (repeatMode === 'all') {
      setCurrentTrack(0)
    } else {
      setIsPlaying(false)
    }
  }, [currentTrack, currentPlaylistData, repeatMode])

  const prevTrack = useCallback(() => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1)
    } else {
      setCurrentTrack(currentPlaylistData.tracks.length - 1)
    }
  }, [currentTrack, currentPlaylistData])

  const selectTrack = useCallback((playlistIndex, trackIndex) => {
    setCurrentPlaylist(playlistIndex)
    setCurrentTrack(trackIndex)
    setIsPlaying(false)
    setIsLoading(true)
    setError(null)
  }, [])

  const toggleFavorite = useCallback((trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }, [])

  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const cycleRepeatMode = useCallback(() => {
    const modes = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }, [repeatMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
            {t('soundTherapy.title')}
          </h1>
          <p className="text-secondary-600">
            {t('soundTherapy.subtitle')}
          </p>
        </motion.div>

        {/* Current Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card mb-8 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Album Art & Info */}
            <div className="flex items-center space-x-4">
              <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${currentPlaylistData.color} flex items-center justify-center`}>
                <Waves className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-secondary-800 truncate">
                  {currentTrackData.name}
                </h3>
                <p className="text-secondary-600">{currentTrackData.artist}</p>
                <p className="text-sm text-secondary-500">{currentPlaylistData.name}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrackData.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  favorites.includes(currentTrackData.id)
                    ? 'text-red-500 bg-red-50'
                    : 'text-secondary-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(currentTrackData.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-secondary-500 w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      const audio = audioRef.current
                      if (audio) {
                        audio.currentTime = e.target.value
                        setCurrentTime(e.target.value)
                      }
                    }}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(currentTime / duration) * 100}%, #e2e8f0 ${(currentTime / duration) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </div>
                <span className="text-sm text-secondary-500 w-12">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isShuffled ? 'text-primary-600 bg-primary-50' : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                    isLoading 
                      ? 'bg-secondary-400 cursor-not-allowed' 
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={cycleRepeatMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    repeatMode !== 'none' ? 'text-primary-600 bg-primary-50' : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                  {repeatMode === 'one' && <span className="absolute -mt-1 -mr-1 text-xs">1</span>}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            preload="metadata"
            crossOrigin="anonymous"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </motion.div>

        {/* Playlists */}
        <div className="space-y-8">
          {playlists.map((playlist, playlistIndex) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: playlistIndex * 0.1 }}
              className="floating-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-secondary-800">{playlist.name}</h2>
                  <p className="text-secondary-600">{playlist.description}</p>
                </div>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                  {playlistIndex === 0 && <Headphones className="w-8 h-8 text-white" />}
                  {playlistIndex === 1 && <Heart className="w-8 h-8 text-white" />}
                  {playlistIndex === 2 && <Clock className="w-8 h-8 text-white" />}
                  {playlistIndex === 3 && <Waves className="w-8 h-8 text-white" />}
                  {playlistIndex === 4 && <Volume2 className="w-8 h-8 text-white" />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playlist.tracks.map((track, trackIndex) => (
                  <motion.div
                    key={track.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      currentPlaylist === playlistIndex && currentTrack === trackIndex
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                    }`}
                    onClick={() => selectTrack(playlistIndex, trackIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                          {currentPlaylist === playlistIndex && currentTrack === trackIndex && isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : currentPlaylist === playlistIndex && currentTrack === trackIndex && isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-secondary-800">{track.name}</h3>
                          <p className="text-sm text-secondary-600">{track.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-secondary-500">{track.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(track.id)
                          }}
                          className={`p-1 rounded transition-colors duration-200 ${
                            favorites.includes(track.id)
                              ? 'text-red-500'
                              : 'text-secondary-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 floating-card"
        >
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">
            Benefits of Sound Therapy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Stress Reduction</h3>
              <p className="text-sm text-secondary-600">
                Calming sounds help lower cortisol levels and promote relaxation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Better Focus</h3>
              <p className="text-sm text-secondary-600">
                Background sounds improve concentration and cognitive performance
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Improved Sleep</h3>
              <p className="text-sm text-secondary-600">
                Gentle sounds help regulate sleep cycles and improve rest quality
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Emotional Balance</h3>
              <p className="text-sm text-secondary-600">
                Therapeutic frequencies help stabilize mood and reduce anxiety
              </p>
            </div>
          </div>
        </motion.div>

        {/* Usage Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 floating-card bg-gradient-to-r from-primary-25 to-accent-25"
        >
          <h2 className="text-xl font-semibold text-primary-800 mb-4">How to Get the Most from Sound Therapy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-primary-700 mb-2">🎧 For Focus & Study</h3>
              <ul className="text-sm text-primary-600 space-y-1">
                <li>• Use nature sounds or white noise</li>
                <li>• Keep volume at 50-70% for optimal concentration</li>
                <li>• Try 25-minute focused sessions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-primary-700 mb-2">😴 For Sleep & Relaxation</h3>
              <ul className="text-sm text-primary-600 space-y-1">
                <li>• Choose slower, deeper sounds</li>
                <li>• Set a timer to fade out gradually</li>
                <li>• Start 30 minutes before desired sleep time</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-primary-700 mb-2">🧘 For Meditation</h3>
              <ul className="text-sm text-primary-600 space-y-1">
                <li>• Use Tibetan bowls or pure frequencies</li>
                <li>• Find a comfortable, consistent volume</li>
                <li>• Practice daily for best results</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-primary-700 mb-2">💪 For Energy & Motivation</h3>
              <ul className="text-sm text-primary-600 space-y-1">
                <li>• Choose upbeat nature sounds</li>
                <li>• Use in morning or during low-energy periods</li>
                <li>• Combine with light stretching or movement</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SoundTherapy