import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, TrendingUp, BarChart3, Plus, CheckCircle, AlertCircle, TreePine, Leaf, Flower2, Sprout } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval as eachDayOfMonth } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'

const MoodTracker = () => {
  const { t } = useLanguage()
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodNote, setMoodNote] = useState('')
  const [moodEntries, setMoodEntries] = useState([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showSuccess, setShowSuccess] = useState(false)
  const [showMoodTree, setShowMoodTree] = useState(false)

  const moods = [
    { id: 1, emoji: '😢', label: 'Very Sad', value: 1, color: 'from-red-400 to-red-500' },
    { id: 2, emoji: '😔', label: 'Sad', value: 2, color: 'from-orange-400 to-red-400' },
    { id: 3, emoji: '😐', label: 'Neutral', value: 3, color: 'from-yellow-400 to-yellow-500' },
    { id: 4, emoji: '🙂', label: 'Good', value: 4, color: 'from-green-400 to-green-500' },
    { id: 5, emoji: '😊', label: 'Very Happy', value: 5, color: 'from-green-500 to-emerald-500' }
  ]

  const moodInsights = {
    1: {
      title: "Supporting Difficult Days",
      suggestions: ["Consider talking to someone you trust", "Try gentle breathing exercises", "Remember that this feeling will pass"],
      resources: [
        { text: "Chat with AI Support", link: "/chat" },
        { text: "Book Therapy", link: "/therapy-booking" },
        { text: "Crisis Resources", link: "/resources" }
      ]
    },
    2: {
      title: "Gentle Self-Care",
      suggestions: ["Practice self-compassion", "Engage in a comforting activity", "Reach out to a friend"],
      resources: [
        { text: "Calming Music", link: "/sound-therapy" },
        { text: "Breathing Exercises", link: "/breathing-exercises" },
        { text: "Journal Your Feelings", link: "/journal" }
      ]
    },
    3: {
      title: "Building Momentum",
      suggestions: ["Set small, achievable goals", "Try a new activity", "Connect with others"],
      resources: [
        { text: "Community Support", link: "/community" },
        { text: "Mood-boosting Music", link: "/sound-therapy" },
        { text: "Mindfulness Exercises", link: "/breathing-exercises" }
      ]
    },
    4: {
      title: "Maintaining Positivity",
      suggestions: ["Savor this good feeling", "Share joy with others", "Reflect on what's working well"],
      resources: [
        { text: "Gratitude Journal", link: "/journal" },
        { text: "Share with Community", link: "/community" },
        { text: "Uplifting Music", link: "/sound-therapy" }
      ]
    },
    5: {
      title: "Celebrating Success",
      suggestions: ["Acknowledge your growth", "Help others feel good too", "Document what made today great"],
      resources: [
        { text: "Share Your Story", link: "/community" },
        { text: "Capture Memories", link: "/journal" },
        { text: "Energizing Playlists", link: "/sound-therapy" }
      ]
    }
  }

  useEffect(() => {
    // Load mood entries from localStorage
    const savedEntries = localStorage.getItem('moodEntries')
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries).map(entry => ({
        ...entry,
        date: new Date(entry.date)
      })))
    }
  }, [])

  const saveMoodEntry = () => {
    if (!selectedMood) return

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: moodNote,
      date: new Date(),
      timestamp: new Date().toISOString()
    }

    const updatedEntries = [...moodEntries, newEntry]
    setMoodEntries(updatedEntries)
    
    // Save to localStorage
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries))
    
    // Reset form
    setSelectedMood(null)
    setMoodNote('')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getWeekDays = (weekStart) => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 })
    const end = endOfWeek(weekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  const getMoodForDate = (date) => {
    return moodEntries.find(entry => isSameDay(entry.date, date))
  }

  const getChartData = () => {
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const moodEntry = moodEntries.find(entry => isSameDay(entry.date, date))
      last30Days.push({
        date: format(date, 'MMM dd'),
        mood: moodEntry ? moodEntry.mood.value : null,
        fullDate: date
      })
    }
    return last30Days.filter(day => day.mood !== null)
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood.value, 0)
    return (sum / moodEntries.length).toFixed(1)
  }

  const getMoodStreak = () => {
    if (moodEntries.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      
      const hasEntry = moodEntries.some(entry => isSameDay(entry.date, checkDate))
      if (hasEntry) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getMonthDays = () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    return eachDayOfMonth({ start, end })
  }

  const getMoodTreeData = () => {
    const monthDays = getMonthDays()
    const treeData = monthDays.map(day => {
      const moodEntry = moodEntries.find(entry => isSameDay(entry.date, day))
      return {
        date: day,
        mood: moodEntry ? moodEntry.mood.value : null,
        hasEntry: !!moodEntry
      }
    })
    return treeData
  }

  const getTreeGrowth = () => {
    const positiveMoods = moodEntries.filter(entry => entry.mood.value >= 4).length
    const totalEntries = moodEntries.length
    
    if (totalEntries === 0) return 0
    return Math.min(100, (positiveMoods / totalEntries) * 100)
  }

  const getTreeElements = () => {
    const growth = getTreeGrowth()
    const elements = []
    
    // Base trunk
    elements.push({
      type: 'trunk',
      x: 50,
      y: 80,
      size: 20 + (growth / 10),
      color: '#8B4513'
    })
    
    // Branches based on growth
    if (growth > 20) {
      elements.push({
        type: 'branch',
        x: 35,
        y: 60,
        rotation: -30,
        size: 15 + (growth / 15),
        color: '#654321'
      })
      elements.push({
        type: 'branch',
        x: 65,
        y: 60,
        rotation: 30,
        size: 15 + (growth / 15),
        color: '#654321'
      })
    }
    
    // Leaves based on positive moods
    const positiveMoods = moodEntries.filter(entry => entry.mood.value >= 4)
    positiveMoods.forEach((entry, index) => {
      if (index < 20) { // Limit to 20 leaves
        elements.push({
          type: 'leaf',
          x: 40 + Math.random() * 20,
          y: 30 + Math.random() * 30,
          rotation: Math.random() * 360,
          size: 8 + Math.random() * 4,
          color: ['#228B22', '#32CD32', '#90EE90'][Math.floor(Math.random() * 3)]
        })
      }
    })
    
    // Flowers based on very happy moods
    const veryHappyMoods = moodEntries.filter(entry => entry.mood.value === 5)
    veryHappyMoods.forEach((entry, index) => {
      if (index < 10) { // Limit to 10 flowers
        elements.push({
          type: 'flower',
          x: 45 + Math.random() * 10,
          y: 25 + Math.random() * 25,
          rotation: Math.random() * 360,
          size: 6 + Math.random() * 4,
          color: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'][Math.floor(Math.random() * 4)]
        })
      }
    })
    
    return elements
  }

  const weekDays = getWeekDays(currentWeek)
  const chartData = getChartData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
            {t('moodTracker.title')}
          </h1>
          <p className="text-secondary-600">
            {t('moodTracker.subtitle')}
          </p>
        </motion.div>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{t('moodTracker.moodSavedSuccess')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Tree Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowMoodTree(!showMoodTree)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <TreePine className="w-5 h-5" />
            <span>{showMoodTree ? 'Hide Mood Tree' : 'Show Mood Tree'}</span>
          </button>
        </div>

        {/* Mood Tree Visualization */}
        {showMoodTree && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-card mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-2">Your Monthly Mood Tree</h2>
              <p className="text-secondary-600">Watch your tree grow with positive moods!</p>
            </div>
            
            <div className="relative h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-xl overflow-hidden">
              {/* Sky gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-100"></div>
              
              {/* Tree elements */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {getTreeElements().map((element, index) => {
                  if (element.type === 'trunk') {
                    return (
                      <rect
                        key={index}
                        x={element.x - element.size/2}
                        y={element.y - element.size/2}
                        width={element.size}
                        height={element.size * 2}
                        fill={element.color}
                        rx={element.size/4}
                      />
                    )
                  } else if (element.type === 'branch') {
                    return (
                      <rect
                        key={index}
                        x={element.x - element.size/2}
                        y={element.y - element.size/2}
                        width={element.size}
                        height={element.size * 1.5}
                        fill={element.color}
                        rx={element.size/4}
                        transform={`rotate(${element.rotation} ${element.x} ${element.y})`}
                      />
                    )
                  } else if (element.type === 'leaf') {
                    return (
                      <ellipse
                        key={index}
                        cx={element.x}
                        cy={element.y}
                        rx={element.size}
                        ry={element.size * 0.6}
                        fill={element.color}
                        transform={`rotate(${element.rotation} ${element.x} ${element.y})`}
                      />
                    )
                  } else if (element.type === 'flower') {
                    return (
                      <g key={index} transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                          <ellipse
                            key={i}
                            cx={0}
                            cy={-element.size * 0.8}
                            rx={element.size * 0.4}
                            ry={element.size * 0.6}
                            fill={element.color}
                            transform={`rotate(${angle})`}
                          />
                        ))}
                        <circle cx="0" cy="0" r={element.size * 0.3} fill="#FFD700" />
                      </g>
                    )
                  }
                  return null
                })}
              </svg>
              
              {/* Growth indicator */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-secondary-800">Tree Growth</div>
                    <div className="text-lg font-bold text-green-600">{Math.round(getTreeGrowth())}%</div>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-center">
                  <div className="text-sm font-medium text-secondary-800">Positive Days</div>
                  <div className="text-lg font-bold text-green-600">
                    {moodEntries.filter(entry => entry.mood.value >= 4).length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Monthly calendar view */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4 text-center">Monthly Mood Calendar</h3>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-secondary-600 py-2">
                    {day}
                  </div>
                ))}
                {getMonthDays().map((day, index) => {
                  const moodEntry = moodEntries.find(entry => isSameDay(entry.date, day))
                  const isToday = isSameDay(day, new Date())
                  
                  return (
                    <div key={index} className="text-center p-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto ${
                        isToday ? 'border-2 border-primary-500 bg-primary-50' : ''
                      }`}>
                        {moodEntry ? (
                          <div className="text-lg" title={`${moodEntry.mood.label} - ${moodEntry.mood.emoji}`}>
                            {moodEntry.mood.emoji}
                          </div>
                        ) : (
                          <div className="text-xs text-secondary-400">
                            {format(day, 'd')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Logger */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="floating-card"
            >
              <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-primary-600" />
                {t('moodTracker.logTodayMood')}
              </h2>

              {/* Mood Selection */}
              <div className="space-y-4 mb-6">
                <p className="text-sm text-secondary-600 mb-3">{t('moodTracker.howAreYouFeeling')}</p>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMood?.id === mood.id
                          ? 'border-primary-500 bg-primary-50 scale-105'
                          : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs font-medium text-secondary-700">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('moodTracker.addNote')}
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder={t('moodTracker.notePlaceholder')}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveMoodEntry}
                disabled={!selectedMood}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('moodTracker.saveMood')}
              </button>

              {/* Today's Insights */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-primary-25 to-accent-25 rounded-xl border border-primary-100"
                >
                  <h3 className="font-semibold text-primary-800 mb-2">
                    {moodInsights[selectedMood.id].title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {moodInsights[selectedMood.id].suggestions.map((suggestion, index) => (
                      <p key={index} className="text-sm text-primary-700">• {suggestion}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {moodInsights[selectedMood.id].resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.link}
                        className="block text-sm bg-white hover:bg-primary-50 text-primary-600 px-3 py-2 rounded-lg border border-primary-200 hover:border-primary-300 transition-all duration-200"
                      >
                        {resource.text}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Stats and Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="floating-card text-center"
              >
                <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-800">{getAverageMood()}</div>
                <div className="text-sm text-secondary-600">{t('moodTracker.averageMood')}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="floating-card text-center"
              >
                <Calendar className="w-8 h-8 text-accent-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-800">{getMoodStreak()}</div>
                <div className="text-sm text-secondary-600">{t('moodTracker.dayStreak')}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="floating-card text-center"
              >
                <BarChart3 className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-800">{moodEntries.length}</div>
                <div className="text-sm text-secondary-600">{t('moodTracker.totalEntries')}</div>
              </motion.div>
            </div>

            {/* Weekly Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="floating-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-800">{t('moodTracker.thisWeek')}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentWeek(new Date())}
                    className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all duration-200"
                  >
                    {t('moodTracker.today')}
                  </button>
                  <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, -1))}
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const moodEntry = getMoodForDate(day)
                  const isToday = isSameDay(day, new Date())
                  
                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-secondary-500 mb-2">
                        {format(day, 'EEE')}
                      </div>
                      <div className="text-sm font-medium text-secondary-700 mb-2">
                        {format(day, 'd')}
                      </div>
                      <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center mx-auto ${
                        isToday ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
                      }`}>
                        {moodEntry ? (
                          <div className="text-2xl" title={moodEntry.mood.label}>
                            {moodEntry.mood.emoji}
                          </div>
                        ) : (
                          <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Mood Trend Chart */}
            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="floating-card"
              >
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">{t('moodTracker.moodTrends')}</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={12}
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis 
                        domain={[1, 5]} 
                        stroke="#64748b" 
                        fontSize={12}
                        tick={{ fill: '#64748b' }}
                        tickFormatter={(value) => moods.find(m => m.value === value)?.emoji || value}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [
                          `${moods.find(m => m.value === value)?.emoji} ${moods.find(m => m.value === value)?.label}`,
                          'Mood'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#0ea5e9" 
                        strokeWidth={3}
                        fill="url(#colorMood)" 
                      />
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Recent Entries */}
            {moodEntries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="floating-card"
              >
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">Recent Entries</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {moodEntries
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map((entry, index) => (
                      <div key={entry.id} className="flex items-start space-x-3 p-3 bg-secondary-25 rounded-lg">
                        <div className="text-2xl">{entry.mood.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-secondary-800">{entry.mood.label}</span>
                            <span className="text-xs text-secondary-500">
                              {format(entry.date, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-secondary-600 mt-1 truncate">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodTracker