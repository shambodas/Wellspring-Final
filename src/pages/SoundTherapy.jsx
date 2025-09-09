import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Shuffle, Repeat, Heart, Clock, Waves, Headphones } from 'lucide-react'
import * as Tone from 'tone'

const SoundTherapy = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentPlaylist, setCurrentPlaylist] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none')
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Audio synthesis references
  const synthRef = useRef(null)
  const noiseRef = useRef(null)
  const filterRef = useRef(null)
  const reverbRef = useRef(null)
  const binauralOscRef = useRef([null, null])
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const playlists = [
    {
      id: 1,
      name: "Nature Sounds",
      description: "Authentic nature recordings for deep relaxation",
      color: "from-green-400 to-emerald-500",
      tracks: [
        { 
          id: 1, 
          name: "Rain Forest", 
          artist: "Nature Therapy", 
          duration: "15:00", 
          type: "rain",
          frequency: null,
          description: "Gentle raindrops with forest ambience"
        },
        { 
          id: 2, 
          name: "Ocean Waves", 
          artist: "Coastal Sounds", 
          duration: "20:00", 
          type: "ocean",
          frequency: null,
          description: "Rhythmic ocean waves on sandy shore"
        },
        { 
          id: 3, 
          name: "Forest Birds", 
          artist: "Dawn Chorus", 
          duration: "12:00", 
          type: "birds",
          frequency: null,
          description: "Morning bird songs in peaceful forest"
        },
        { 
          id: 4, 
          name: "Mountain Stream", 
          artist: "Water Therapy", 
          duration: "18:00", 
          type: "stream",
          frequency: null,
          description: "Babbling brook with gentle water flow"
        }
      ]
    },
    {
      id: 2,
      name: "Tibetan Bowls",
      description: "Sacred singing bowls for meditation and healing",
      color: "from-orange-400 to-red-500",
      tracks: [
        { 
          id: 5, 
          name: "Deep Bowl (256Hz)", 
          artist: "Himalayan Healing", 
          duration: "10:00", 
          type: "singing_bowl",
          frequency: 256,
          description: "Large Tibetan bowl with deep resonance"
        },
        { 
          id: 6, 
          name: "Heart Bowl (341Hz)", 
          artist: "Sacred Sounds", 
          duration: "12:00", 
          type: "singing_bowl",
          frequency: 341.3,
          description: "Heart chakra healing frequency"
        },
        { 
          id: 7, 
          name: "Throat Bowl (426Hz)", 
          artist: "Chakra Healing", 
          duration: "8:00", 
          type: "singing_bowl",
          frequency: 426.7,
          description: "Throat chakra communication frequency"
        },
        { 
          id: 8, 
          name: "Crown Bowl (480Hz)", 
          artist: "Higher Consciousness", 
          duration: "15:00", 
          type: "singing_bowl",
          frequency: 480,
          description: "Crown chakra spiritual connection"
        }
      ]
    },
    {
      id: 3,
      name: "Crystal Bowls",
      description: "Pure quartz crystal bowl frequencies",
      color: "from-purple-400 to-indigo-500",
      tracks: [
        { 
          id: 9, 
          name: "Root Crystal (194Hz)", 
          artist: "Crystal Healing", 
          duration: "14:00", 
          type: "crystal_bowl",
          frequency: 194.18,
          description: "Root chakra grounding frequency"
        },
        { 
          id: 10, 
          name: "Solar Crystal (320Hz)", 
          artist: "Pure Resonance", 
          duration: "11:00", 
          type: "crystal_bowl",
          frequency: 320,
          description: "Solar plexus personal power"
        },
        { 
          id: 11, 
          name: "Third Eye Crystal (448Hz)", 
          artist: "Intuition Sounds", 
          duration: "13:00", 
          type: "crystal_bowl",
          frequency: 448,
          description: "Third eye chakra intuition enhancement"
        },
        { 
          id: 12, 
          name: "Pure Quartz (528Hz)", 
          artist: "DNA Repair", 
          duration: "16:00", 
          type: "crystal_bowl",
          frequency: 528,
          description: "Love frequency for transformation"
        }
      ]
    },
    {
      id: 4,
      name: "Binaural Beats",
      description: "Brainwave entrainment for altered states",
      color: "from-cyan-400 to-blue-500",
      tracks: [
        { 
          id: 13, 
          name: "Delta Waves (2Hz)", 
          artist: "Deep Sleep", 
          duration: "30:00", 
          type: "binaural",
          frequency: 2,
          baseFreq: 200,
          description: "Deep sleep and regeneration"
        },
        { 
          id: 14, 
          name: "Theta Waves (6Hz)", 
          artist: "Meditation Zone", 
          duration: "25:00", 
          type: "binaural",
          frequency: 6,
          baseFreq: 200,
          description: "Deep meditation and creativity"
        },
        { 
          id: 15, 
          name: "Alpha Waves (10Hz)", 
          artist: "Relaxed Focus", 
          duration: "20:00", 
          type: "binaural",
          frequency: 10,
          baseFreq: 200,
          description: "Relaxed alertness and learning"
        },
        { 
          id: 16, 
          name: "Beta Waves (15Hz)", 
          artist: "Active Mind", 
          duration: "15:00", 
          type: "binaural",
          frequency: 15,
          baseFreq: 200,
          description: "Focus and concentration"
        }
      ]
    },
    {
      id: 5,
      name: "Tuning Forks",
      description: "Precise healing frequencies from tuning forks",
      color: "from-yellow-400 to-orange-500",
      tracks: [
        { 
          id: 17, 
          name: "OM Tuning (136Hz)", 
          artist: "Sacred Geometry", 
          duration: "12:00", 
          type: "tuning_fork",
          frequency: 136.1,
          description: "Universal OM frequency"
        },
        { 
          id: 18, 
          name: "Schumann (7.83Hz)", 
          artist: "Earth Resonance", 
          duration: "22:00", 
          type: "tuning_fork",
          frequency: 7.83,
          baseFreq: 250,
          description: "Earth's natural frequency"
        },
        { 
          id: 19, 
          name: "Solfeggio 396Hz", 
          artist: "Liberation Frequency", 
          duration: "16:00", 
          type: "tuning_fork",
          frequency: 396,
          description: "Liberating guilt and fear"
        },
        { 
          id: 20, 
          name: "Solfeggio 528Hz", 
          artist: "Love Frequency", 
          duration: "18:00", 
          type: "tuning_fork",
          frequency: 528,
          description: "Transformation and DNA repair"
        }
      ]
    },
    {
      id: 6,
      name: "Human Chanting",
      description: "Sacred vocal harmonics and mantras",
      color: "from-pink-400 to-rose-500",
      tracks: [
        { 
          id: 21, 
          name: "AUM Chant", 
          artist: "Vocal Meditation", 
          duration: "10:00", 
          type: "chant_om",
          frequency: 136.1,
          description: "Sacred AUM mantra vibration"
        },
        { 
          id: 22, 
          name: "Tibetan Throat Singing", 
          artist: "Monastery Monks", 
          duration: "15:00", 
          type: "throat_singing",
          frequency: 110,
          description: "Deep harmonic throat singing"
        },
        { 
          id: 23, 
          name: "Gregorian Chant", 
          artist: "Sacred Harmony", 
          duration: "12:00", 
          type: "gregorian",
          frequency: 256,
          description: "Ancient sacred vocal harmonies"
        },
        { 
          id: 24, 
          name: "Sanskrit Mantra", 
          artist: "Vedic Sounds", 
          duration: "14:00", 
          type: "sanskrit",
          frequency: 432,
          description: "Traditional Sanskrit healing mantras"
        }
      ]
    }
  ]

  const currentPlaylistData = playlists[currentPlaylist]
  const currentTrackData = currentPlaylistData.tracks[currentTrack]

  // Initialize Tone.js
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (Tone.context.state !== 'running') {
          await Tone.start()
        }
        
        // Create audio nodes
        reverbRef.current = new Tone.Reverb(4).toDestination()
        filterRef.current = new Tone.Filter(800, "lowpass").connect(reverbRef.current)
        
        console.log('Audio context initialized')
      } catch (error) {
        console.error('Failed to initialize audio:', error)
        setError('Failed to initialize audio system')
      }
    }

    initAudio()
    
    return () => {
      // Cleanup
      if (synthRef.current) {
        if (Array.isArray(synthRef.current)) {
          synthRef.current.forEach(item => {
            if (item.osc) item.osc.dispose()
            if (item.env) item.env.dispose()
          })
        } else {
          synthRef.current.dispose()
        }
      }
      if (noiseRef.current) noiseRef.current.dispose()
      if (filterRef.current) filterRef.current.dispose()
      if (reverbRef.current) reverbRef.current.dispose()
      if (binauralOscRef.current[0]) binauralOscRef.current[0].dispose()
      if (binauralOscRef.current[1]) binauralOscRef.current[1].dispose()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Generate specific sound types
  const generateSound = useCallback(async (track) => {
    try {
      await Tone.start()
      setIsLoading(true)
      setError(null)
      
      // Stop any existing sounds
      stopCurrentSound()
      
      const now = Tone.now()
      startTimeRef.current = Date.now()
      
      switch (track.type) {
        case 'rain':
          // Generate rain sound using filtered noise
          noiseRef.current = new Tone.Noise("pink")
          const rainFilter = new Tone.Filter(800, "lowpass")
          const rainGain = new Tone.Gain(0.3)
          
          noiseRef.current.connect(rainFilter)
          rainFilter.connect(rainGain)
          rainGain.connect(reverbRef.current)
          
          noiseRef.current.start(now)
          break
          
        case 'ocean':
          // Ocean waves using LFO-modulated noise
          noiseRef.current = new Tone.Noise("pink")
          const oceanFilter = new Tone.Filter(400, "lowpass")
          const oceanLFO = new Tone.LFO(0.1, 0.1, 0.8)
          const oceanGain = new Tone.Gain(0.4)
          
          noiseRef.current.connect(oceanFilter)
          oceanFilter.connect(oceanGain)
          oceanLFO.connect(oceanGain.gain)
          oceanGain.connect(reverbRef.current)
          
          noiseRef.current.start(now)
          oceanLFO.start(now)
          break
          
        case 'birds':
          // Bird sounds using multiple oscillators with random modulation
          const birdSynths = []
          for (let i = 0; i < 4; i++) {
            const synth = new Tone.Oscillator()
            const env = new Tone.AmplitudeEnvelope(0.1, 0.2, 0.3, 0.4)
            const filter = new Tone.Filter(2000, "highpass")
            const gain = new Tone.Gain(0.15)
            
            synth.connect(env)
            env.connect(filter)
            filter.connect(gain)
            gain.connect(reverbRef.current)
            
            birdSynths.push({ synth, env, gain })
          }
          
          // Random bird chirping pattern
          const birdPattern = () => {
            if (!isPlaying) return
            const synth = birdSynths[Math.floor(Math.random() * birdSynths.length)]
            const freq = 800 + Math.random() * 1200
            synth.synth.frequency.value = freq
            synth.synth.start()
            synth.env.triggerAttackRelease(0.2 + Math.random() * 0.3)
            setTimeout(() => synth.synth.stop(), 500)
            
            setTimeout(birdPattern, 1000 + Math.random() * 3000)
          }
          
          setTimeout(birdPattern, 1000)
          synthRef.current = birdSynths
          break
          
        case 'stream':
          // Babbling stream using filtered noise with modulation
          noiseRef.current = new Tone.Noise("white")
          const streamFilter = new Tone.Filter(1200, "bandpass")
          const streamLFO = new Tone.LFO(0.3, 600, 1200)
          const streamGain = new Tone.Gain(0.3)
          
          noiseRef.current.connect(streamFilter)
          streamLFO.connect(streamFilter.frequency)
          streamFilter.connect(streamGain)
          streamGain.connect(reverbRef.current)
          
          noiseRef.current.start(now)
          streamLFO.start(now)
          break
          
        case 'singing_bowl':
          // Tibetan singing bowl using multiple harmonics
          const fundamentalFreq = track.frequency
          synthRef.current = []
          
          // Create harmonic series
          const harmonics = [1, 2.1, 3.2, 4.8, 6.1]
          harmonics.forEach((harmonic, index) => {
            const osc = new Tone.Oscillator(fundamentalFreq * harmonic, "sine")
            const env = new Tone.AmplitudeEnvelope(2, 8, 0.8, 4)
            const gain = new Tone.Gain(0.3 / (index + 1))
            
            osc.connect(env)
            env.connect(gain)
            gain.connect(reverbRef.current)
            
            synthRef.current.push({ osc, env })
            osc.start(now)
            env.triggerAttack(now)
          })
          break
          
        case 'crystal_bowl':
          // Crystal bowl with pure sine waves and shimmer
          const crystalFreq = track.frequency
          const mainOsc = new Tone.Oscillator(crystalFreq, "sine")
          const shimmerOsc = new Tone.Oscillator(crystalFreq * 2.01, "sine")
          const env = new Tone.AmplitudeEnvelope(3, 10, 0.9, 6)
          const shimmerGain = new Tone.Gain(0.1)
          const mainGain = new Tone.Gain(0.4)
          
          mainOsc.connect(env)
          shimmerOsc.connect(shimmerGain)
          env.connect(mainGain)
          mainGain.connect(reverbRef.current)
          shimmerGain.connect(reverbRef.current)
          
          synthRef.current = [{ osc: mainOsc, env }, { osc: shimmerOsc }]
          mainOsc.start(now)
          shimmerOsc.start(now)
          env.triggerAttack(now)
          break
          
        case 'binaural':
          // Binaural beats
          const baseFreq = track.baseFreq || 200
          const beatFreq = track.frequency
          
          const leftOsc = new Tone.Oscillator(baseFreq, "sine")
          const rightOsc = new Tone.Oscillator(baseFreq + beatFreq, "sine")
          const leftGain = new Tone.Gain(0.3)
          const rightGain = new Tone.Gain(0.3)
          const merger = new Tone.Merge()
          
          leftOsc.connect(leftGain)
          rightOsc.connect(rightGain)
          leftGain.connect(merger.left)
          rightGain.connect(merger.right)
          merger.toDestination()
          
          binauralOscRef.current = [leftOsc, rightOsc]
          leftOsc.start(now)
          rightOsc.start(now)
          break
          
        case 'tuning_fork':
          // Pure tuning fork frequency
          const forkFreq = track.frequency
          if (track.baseFreq) {
            // For very low frequencies like Schumann, use carrier frequency
            const carrier = new Tone.Oscillator(track.baseFreq, "sine")
            const modulator = new Tone.LFO(forkFreq, 0, 0.5)
            const forkGain = new Tone.Gain(0.4)
            
            modulator.connect(forkGain.gain)
            carrier.connect(forkGain)
            forkGain.connect(reverbRef.current)
            
            synthRef.current = [{ osc: carrier }]
            carrier.start(now)
            modulator.start(now)
          } else {
            const forkOsc = new Tone.Oscillator(forkFreq, "sine")
            const forkEnv = new Tone.AmplitudeEnvelope(0.1, 15, 0.7, 5)
            const forkGain = new Tone.Gain(0.4)
            
            forkOsc.connect(forkEnv)
            forkEnv.connect(forkGain)
            forkGain.connect(reverbRef.current)
            
            synthRef.current = [{ osc: forkOsc, env: forkEnv }]
            forkOsc.start(now)
            forkEnv.triggerAttack(now)
          }
          break
          
        case 'chant_om':
          // OM chant using formant frequencies
          const omFund = 136.1
          const formants = [
            { freq: omFund, gain: 0.4 },
            { freq: omFund * 2, gain: 0.2 },
            { freq: omFund * 3, gain: 0.1 },
            { freq: omFund * 4, gain: 0.05 }
          ]
          
          synthRef.current = []
          formants.forEach(formant => {
            const osc = new Tone.Oscillator(formant.freq, "sawtooth")
            const filter = new Tone.Filter(formant.freq * 2, "lowpass")
            const env = new Tone.AmplitudeEnvelope(1, 4, 0.8, 2)
            const gain = new Tone.Gain(formant.gain)
            
            osc.connect(filter)
            filter.connect(env)
            env.connect(gain)
            gain.connect(reverbRef.current)
            
            synthRef.current.push({ osc, env })
            osc.start(now)
            env.triggerAttack(now)
          })
          break
          
        case 'throat_singing':
          // Throat singing with subharmonics
          const throatFund = 110
          const subharmonics = [1, 0.5, 1.5, 2, 2.5, 3]
          
          synthRef.current = []
          subharmonics.forEach((ratio, index) => {
            const osc = new Tone.Oscillator(throatFund * ratio, "sawtooth")
            const filter = new Tone.Filter(400 + index * 200, "bandpass")
            const env = new Tone.AmplitudeEnvelope(2, 8, 0.9, 3)
            const gain = new Tone.Gain(0.2 / (index + 1))
            
            osc.connect(filter)
            filter.connect(env)
            env.connect(gain)
            gain.connect(reverbRef.current)
            
            synthRef.current.push({ osc, env })
            osc.start(now)
            env.triggerAttack(now)
          })
          break
          
        case 'gregorian':
          // Gregorian chant harmonies
          const gregFund = 256
          const gregorianHarmonies = [1, 1.25, 1.5, 2]
          
          synthRef.current = []
          gregorianHarmonies.forEach((ratio, index) => {
            const osc = new Tone.Oscillator(gregFund * ratio, "triangle")
            const env = new Tone.AmplitudeEnvelope(2, 6, 0.8, 4)
            const gain = new Tone.Gain(0.25)
            
            osc.connect(env)
            env.connect(gain)
            gain.connect(reverbRef.current)
            
            synthRef.current.push({ osc, env })
            osc.start(now + index * 0.2)
            env.triggerAttack(now + index * 0.2)
          })
          break
          
        case 'sanskrit':
          // Sanskrit mantra with 432Hz tuning
          const sanskritFreq = 432
          const mantras = [1, 1.33, 1.67, 2.25]
          
          synthRef.current = []
          mantras.forEach((ratio, index) => {
            const osc = new Tone.Oscillator(sanskritFreq * ratio, "sine")
            const env = new Tone.AmplitudeEnvelope(1.5, 5, 0.7, 3)
            const gain = new Tone.Gain(0.2)
            
            osc.connect(env)
            env.connect(gain)
            gain.connect(reverbRef.current)
            
            synthRef.current.push({ osc, env })
            osc.start(now + index * 0.5)
            env.triggerAttack(now + index * 0.5)
          })
          break
      }
      
      // Set up duration and time tracking
      const durationParts = track.duration.split(':')
      const durationInSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1] || 0)
      setDuration(durationInSeconds)
      
      // Start time tracking
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        setCurrentTime(elapsed)
        
        if (elapsed >= durationInSeconds) {
          stopCurrentSound()
          nextTrack()
        }
      }, 100)
      
      setIsLoading(false)
      setIsPlaying(true)
      
    } catch (error) {
      console.error('Error generating sound:', error)
      setError('Failed to generate sound. Please try again.')
      setIsLoading(false)
      setIsPlaying(false)
    }
  }, [])

  const stopCurrentSound = useCallback(() => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Stop and dispose of synths
    if (synthRef.current) {
      if (Array.isArray(synthRef.current)) {
        synthRef.current.forEach(item => {
          if (item.osc) {
            try {
              item.osc.stop()
              item.osc.dispose()
            } catch (e) {}
          }
          if (item.env) {
            try {
              item.env.triggerRelease()
            } catch (e) {}
          }
        })
      } else {
        try {
          synthRef.current.stop()
          synthRef.current.dispose()
        } catch (e) {}
      }
      synthRef.current = null
    }
    
    // Stop noise
    if (noiseRef.current) {
      try {
        noiseRef.current.stop()
        noiseRef.current.dispose()
        noiseRef.current = null
      } catch (e) {}
    }
    
    // Stop binaural oscillators
    binauralOscRef.current.forEach(osc => {
      if (osc) {
        try {
          osc.stop()
          osc.dispose()
        } catch (e) {}
      }
    })
    binauralOscRef.current = [null, null]
    
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stopCurrentSound()
    } else {
      await generateSound(currentTrackData)
    }
  }, [isPlaying, currentTrackData, generateSound, stopCurrentSound])

  const nextTrack = useCallback(() => {
    stopCurrentSound()
    const playlist = currentPlaylistData.tracks
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1)
    } else if (repeatMode === 'all') {
      setCurrentTrack(0)
    }
    setCurrentTime(0)
  }, [currentTrack, currentPlaylistData, repeatMode, stopCurrentSound])

  const prevTrack = useCallback(() => {
    stopCurrentSound()
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1)
    } else {
      setCurrentTrack(currentPlaylistData.tracks.length - 1)
    }
    setCurrentTime(0)
  }, [currentTrack, currentPlaylistData, stopCurrentSound])

  const selectTrack = useCallback((playlistIndex, trackIndex) => {
    stopCurrentSound()
    setCurrentPlaylist(playlistIndex)
    setCurrentTrack(trackIndex)
    setCurrentTime(0)
    setDuration(0)
  }, [stopCurrentSound])

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

  // Update master volume
  useEffect(() => {
    if (Tone.Destination) {
      Tone.Destination.volume.value = Tone.gainToDb(volume)
    }
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentSound()
    }
  }, [stopCurrentSound])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Therapeutic Sounds
          </h1>
          <p className="text-slate-600">
            Authentic therapeutic sounds generated in real-time for healing and relaxation
          </p>
        </div>

        {/* Current Player */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Track Info */}
            <div className="flex items-center space-x-4">
              <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${currentPlaylistData.color} flex items-center justify-center relative`}>
                <Waves className="w-12 h-12 text-white animate-pulse" />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-xl border-4 border-white/30 animate-ping" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-slate-800 truncate">
                  {currentTrackData.name}
                </h3>
                <p className="text-slate-600">{currentTrackData.artist}</p>
                <p className="text-sm text-slate-500">{currentPlaylistData.name}</p>
                <p className="text-xs text-slate-400 mt-1">{currentTrackData.description}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrackData.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  favorites.includes(currentTrackData.id)
                    ? 'text-red-500 bg-red-50'
                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(currentTrackData.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-500 w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      const newTime = parseFloat(e.target.value)
                      setCurrentTime(newTime)
                      startTimeRef.current = Date.now() - (newTime * 1000)
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100 || 0}%, #e2e8f0 ${(currentTime / duration) * 100 || 0}%, #e2e8f0 100%)`
                    }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-12">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isShuffled ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                    isLoading 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
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
                  className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={cycleRepeatMode}
                  className={`p-2 rounded-lg transition-colors duration-200 relative ${
                    repeatMode !== 'none' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                  {repeatMode === 'one' && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-slate-400 hover:text-slate-600"
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-8">{Math.round(volume * 100)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Tracks Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">All Therapeutic Sounds ({playlists.reduce((total, playlist) => total + playlist.tracks.length, 0)} tracks)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist, playlistIndex) => 
              playlist.tracks.map((track, trackIndex) => (
                <div
                  key={track.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    currentPlaylist === playlistIndex && currentTrack === trackIndex
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                  }`}
                  onClick={() => selectTrack(playlistIndex, trackIndex)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center relative flex-shrink-0`}>
                      {currentPlaylist === playlistIndex && currentTrack === trackIndex && isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : currentPlaylist === playlistIndex && currentTrack === trackIndex && isPlaying ? (
                        <>
                          <Pause className="w-6 h-6 text-white" />
                          <div className="absolute inset-0 rounded-lg border-2 border-white/50 animate-pulse" />
                        </>
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">{track.name}</h3>
                          <p className="text-sm text-slate-600 truncate">{track.artist}</p>
                          <p className="text-xs text-blue-600 font-medium">{playlist.name}</p>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{track.description}</p>
                          {track.frequency && (
                            <p className="text-xs text-emerald-600 font-medium mt-1">
                              {track.frequency}Hz {track.type === 'binaural' ? `(${track.baseFreq}Hz base)` : ''}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1 ml-2">
                          <span className="text-sm text-slate-500">{track.duration}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(track.id)
                            }}
                            className={`p-1 rounded transition-colors duration-200 ${
                              favorites.includes(track.id)
                                ? 'text-red-500'
                                : 'text-slate-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Playlists by Category */}
        <div className="space-y-8">
          {playlists.map((playlist, playlistIndex) => (
            <div
              key={playlist.id}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">{playlist.name}</h2>
                  <p className="text-slate-600">{playlist.description} • {playlist.tracks.length} tracks</p>
                </div>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                  {playlistIndex === 0 && <Headphones className="w-8 h-8 text-white" />}
                  {playlistIndex === 1 && <Heart className="w-8 h-8 text-white" />}
                  {playlistIndex === 2 && <Clock className="w-8 h-8 text-white" />}
                  {playlistIndex === 3 && <Waves className="w-8 h-8 text-white" />}
                  {playlistIndex === 4 && <Volume2 className="w-8 h-8 text-white" />}
                  {playlistIndex === 5 && <Headphones className="w-8 h-8 text-white" />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playlist.tracks.map((track, trackIndex) => (
                  <div
                    key={track.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-102 ${
                      currentPlaylist === playlistIndex && currentTrack === trackIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => selectTrack(playlistIndex, trackIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center relative`}>
                          {currentPlaylist === playlistIndex && currentTrack === trackIndex && isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : currentPlaylist === playlistIndex && currentTrack === trackIndex && isPlaying ? (
                            <>
                              <Pause className="w-6 h-6 text-white" />
                              <div className="absolute inset-0 rounded-lg border-2 border-white/50 animate-pulse" />
                            </>
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">{track.name}</h3>
                          <p className="text-sm text-slate-600">{track.artist}</p>
                          <p className="text-xs text-slate-400">{track.description}</p>
                          {track.frequency && (
                            <p className="text-xs text-blue-600 font-medium">
                              {track.frequency}Hz {track.type === 'binaural' ? `(${track.baseFreq}Hz base)` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-500">{track.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(track.id)
                          }}
                          className={`p-1 rounded transition-colors duration-200 ${
                            favorites.includes(track.id)
                              ? 'text-red-500'
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            Benefits of Sound Therapy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Stress Reduction</h3>
              <p className="text-sm text-slate-600">
                Therapeutic frequencies help lower cortisol levels and activate the parasympathetic nervous system
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Brainwave Entrainment</h3>
              <p className="text-sm text-slate-600">
                Binaural beats synchronize brainwaves to promote specific mental states and consciousness
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Improved Sleep</h3>
              <p className="text-sm text-slate-600">
                Low-frequency sounds and nature sounds help regulate circadian rhythms and promote deep sleep
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Emotional Balance</h3>
              <p className="text-sm text-slate-600">
                Sacred frequencies and harmonic resonance help balance emotions and promote inner peace
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 opacity-0 animate-[fadeInUp_0.6s_ease-out_1.2s_forwards]">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">How to Use Therapeutic Sounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🌿 Nature Sounds</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Use headphones for immersive experience</li>
                <li>• Set volume to comfortable background level</li>
                <li>• Great for focus, studying, or relaxation</li>
                <li>• Can mask distracting environmental noise</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🎵 Singing Bowls</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Use during meditation or yoga</li>
                <li>• Focus on the harmonic overtones</li>
                <li>• Each frequency targets different chakras</li>
                <li>• Allow sounds to fade naturally</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🧠 Binaural Beats</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• MUST use headphones for effectiveness</li>
                <li>• Delta (2Hz): Deep sleep, healing</li>
                <li>• Theta (6Hz): Meditation, creativity</li>
                <li>• Alpha (10Hz): Relaxed focus</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🔱 Tuning Forks</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Pure frequencies for specific healing</li>
                <li>• 528Hz: DNA repair and transformation</li>
                <li>• 432Hz: Natural harmonic resonance</li>
                <li>• Listen with intention and focus</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🕉 Sacred Chanting</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Use for spiritual practice and prayer</li>
                <li>• Can chant along or listen passively</li>
                <li>• Focus on vibrations in your body</li>
                <li>• Regular practice enhances benefits</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">💎 Crystal Bowls</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Pure quartz frequencies</li>
                <li>• Excellent for energy clearing</li>
                <li>• Use in quiet, sacred space</li>
                <li>• Notice physical sensations</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> All sounds are generated in real-time using advanced web audio synthesis. 
              For binaural beats to work effectively, you must use headphones as each ear receives a different frequency. 
              Start with lower volumes and adjust to your comfort level. Regular use enhances therapeutic benefits.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export default SoundTherapy