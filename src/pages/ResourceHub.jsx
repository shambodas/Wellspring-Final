import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Download, ExternalLink, BookOpen, Headphones, Video, FileText, Search, Filter, Heart, Clock, Users } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const ResourceHub = () => {
  const { t, currentLanguage } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])

  const categories = [
    { id: 'all', name: 'All Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'videos', name: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'audio', name: 'Audio Guides', icon: <Headphones className="w-4 h-4" /> },
    { id: 'pdfs', name: 'PDF Guides', icon: <FileText className="w-4 h-4" /> },
    { id: 'meditation', name: 'Meditation', icon: <Heart className="w-4 h-4" /> },
    { id: 'coping', name: 'Coping Skills', icon: <Users className="w-4 h-4" /> }
  ]

  const resources = [
    // Videos
    {
      id: 1,
      title: "Understanding Anxiety: A Complete Guide",
      description: "Learn about anxiety symptoms, causes, and effective treatment approaches from leading mental health experts.",
      category: "videos",
      type: "video",
      duration: "15:30",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["anxiety", "education", "treatment"],
      views: 15420,
      rating: 4.8
    },
    {
      id: 2,
      title: "Mindfulness Meditation for Beginners",
      description: "A gentle introduction to mindfulness meditation with guided instructions and breathing techniques.",
      category: "videos",
      type: "video",
      duration: "12:45",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["meditation", "mindfulness", "beginners"],
      views: 8920,
      rating: 4.9
    },
    {
      id: 3,
      title: "Coping with Depression: Practical Strategies",
      description: "Evidence-based strategies for managing depression symptoms and improving mental well-being.",
      category: "videos",
      type: "video",
      duration: "18:20",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["depression", "coping", "strategies"],
      views: 12340,
      rating: 4.7
    },

    // Audio Guides
    {
      id: 4,
      title: "Progressive Muscle Relaxation",
      description: "A guided audio session to help you release tension and achieve deep relaxation through muscle relaxation techniques.",
      category: "audio",
      type: "audio",
      duration: "20:15",
      thumbnail: "/audio/relaxation.jpg",
      url: "/audio/progressive-relaxation.mp3",
      tags: ["relaxation", "stress-relief", "sleep"],
      views: 5670,
      rating: 4.8
    },
    {
      id: 5,
      title: "Breathing Exercises for Anxiety",
      description: "Learn effective breathing techniques to calm your nervous system and reduce anxiety symptoms.",
      category: "audio",
      type: "audio",
      duration: "10:30",
      thumbnail: "/audio/breathing.jpg",
      url: "/audio/breathing-exercises.mp3",
      tags: ["breathing", "anxiety", "calm"],
      views: 7890,
      rating: 4.9
    },
    {
      id: 6,
      title: "Sleep Meditation: Deep Rest",
      description: "A soothing meditation designed to help you fall asleep naturally and improve sleep quality.",
      category: "audio",
      type: "audio",
      duration: "25:00",
      thumbnail: "/audio/sleep.jpg",
      url: "/audio/sleep-meditation.mp3",
      tags: ["sleep", "meditation", "rest"],
      views: 11230,
      rating: 4.8
    },

    // PDF Guides
    {
      id: 7,
      title: "Stress Management Workbook",
      description: "A comprehensive workbook with exercises, worksheets, and strategies for managing stress effectively.",
      category: "pdfs",
      type: "pdf",
      duration: "45 pages",
      thumbnail: "/pdfs/stress-workbook.jpg",
      url: "/pdfs/stress-management-workbook.pdf",
      tags: ["stress", "workbook", "exercises"],
      views: 3450,
      rating: 4.6
    },
    {
      id: 8,
      title: "Cognitive Behavioral Therapy Guide",
      description: "Learn CBT techniques to identify and change negative thought patterns that affect your mental health.",
      category: "pdfs",
      type: "pdf",
      duration: "32 pages",
      thumbnail: "/pdfs/cbt-guide.jpg",
      url: "/pdfs/cbt-guide.pdf",
      tags: ["CBT", "therapy", "thoughts"],
      views: 2890,
      rating: 4.7
    },
    {
      id: 9,
      title: "Self-Care Toolkit",
      description: "A practical guide with daily self-care activities, mood tracking, and wellness planning tools.",
      category: "pdfs",
      type: "pdf",
      duration: "28 pages",
      thumbnail: "/pdfs/self-care.jpg",
      url: "/pdfs/self-care-toolkit.pdf",
      tags: ["self-care", "wellness", "toolkit"],
      views: 4560,
      rating: 4.8
    },

    // Meditation Resources
    {
      id: 10,
      title: "Loving-Kindness Meditation",
      description: "Practice compassion and kindness toward yourself and others with this guided meditation.",
      category: "meditation",
      type: "audio",
      duration: "15:45",
      thumbnail: "/audio/loving-kindness.jpg",
      url: "/audio/loving-kindness.mp3",
      tags: ["meditation", "compassion", "kindness"],
      views: 6780,
      rating: 4.9
    },
    {
      id: 11,
      title: "Body Scan Meditation",
      description: "A mindfulness practice to connect with your body and release physical tension.",
      category: "meditation",
      type: "audio",
      duration: "18:30",
      thumbnail: "/audio/body-scan.jpg",
      url: "/audio/body-scan.mp3",
      tags: ["meditation", "body", "mindfulness"],
      views: 5230,
      rating: 4.7
    },

    // Coping Skills
    {
      id: 12,
      title: "Crisis Coping Strategies",
      description: "Immediate strategies to help you cope during difficult moments and mental health crises.",
      category: "coping",
      type: "pdf",
      duration: "15 pages",
      thumbnail: "/pdfs/crisis-coping.jpg",
      url: "/pdfs/crisis-coping-strategies.pdf",
      tags: ["crisis", "coping", "emergency"],
      views: 2340,
      rating: 4.8
    },
    {
      id: 13,
      title: "Emotional Regulation Techniques",
      description: "Learn practical techniques to manage intense emotions and maintain emotional balance.",
      category: "coping",
      type: "video",
      duration: "14:20",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["emotions", "regulation", "balance"],
      views: 9870,
      rating: 4.6
    },

    // Regional Language Resources
    {
      id: 14,
      title: "Guided Meditation (Hindi)",
      description: "हिंदी में निर्देशित ध्यान - तनाव और चिंता से राहत के लिए",
      category: "meditation",
      type: "video",
      duration: "20:00",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["meditation", "hindi", "relaxation"],
      views: 3450,
      rating: 4.8,
      language: "hi"
    },
    {
      id: 15,
      title: "Stress Relief Audio (Bengali)",
      description: "বাংলায় চাপ উপশম অডিও - শিথিলতা এবং শান্তির জন্য",
      category: "audio",
      type: "audio",
      duration: "15:30",
      thumbnail: "/audio/stress-relief-bengali.jpg",
      url: "/audio/stress-relief-bengali.mp3",
      tags: ["stress-relief", "bengali", "relaxation"],
      views: 2780,
      rating: 4.7,
      language: "bn"
    },
    {
      id: 16,
      title: "Exam Anxiety Guide (Tamil)",
      description: "தமிழில் தேர்வு கவலை வழிகாட்டி - மாணவர்களுக்கான உதவி",
      category: "coping",
      type: "pdf",
      duration: "12 pages",
      thumbnail: "/pdfs/exam-anxiety-tamil.jpg",
      url: "/exam-anxiety-guide-tamil.pdf",
      tags: ["exam-anxiety", "tamil", "students"],
      views: 1890,
      rating: 4.9,
      language: "ta"
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Show regional language resources based on selected language
    const matchesLanguage = !resource.language || resource.language === currentLanguage || currentLanguage === 'en'
    
    return matchesCategory && matchesSearch && matchesLanguage
  })

  const toggleFavorite = (resourceId) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />
      case 'audio': return <Headphones className="w-5 h-5" />
      case 'pdf': return <FileText className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getResourceColor = (type) => {
    switch (type) {
      case 'video': return 'from-red-400 to-pink-500'
      case 'audio': return 'from-blue-400 to-cyan-500'
      case 'pdf': return 'from-green-400 to-teal-500'
      default: return 'from-purple-400 to-indigo-500'
    }
  }

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
            {t('resources.title')}
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            {t('resources.subtitle')}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200'
                  }`}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="floating-card hover:shadow-xl transition-all duration-300 group"
            >
              {/* Resource Thumbnail */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-lg overflow-hidden">
                  {resource.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-600 ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getResourceColor(resource.type)} flex items-center justify-center`}>
                      {getResourceIcon(resource.type)}
                    </div>
                  )}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white bg-opacity-90 text-secondary-700 text-xs font-medium rounded-full">
                    {resource.category.toUpperCase()}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{resource.duration}</span>
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(resource.id)}
                  className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(resource.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-secondary-400'
                    }`} 
                  />
                </button>
              </div>

              {/* Resource Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors duration-200">
                  {resource.title}
                </h3>
                
                <p className="text-secondary-600 text-sm line-clamp-2">
                  {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-secondary-500">
                  <div className="flex items-center space-x-4">
                    <span>{formatViews(resource.views)} views</span>
                    <div className="flex items-center space-x-1">
                      <span>★</span>
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  {resource.type === 'video' ? (
                    <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Watch</span>
                    </button>
                  ) : resource.type === 'audio' ? (
                    <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Headphones className="w-4 h-4" />
                      <span>Listen</span>
                    </button>
                  ) : (
                    <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                  
                  <button className="p-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                    <ExternalLink className="w-4 h-4 text-secondary-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">No resources found</h3>
            <p className="text-secondary-600">
              Try adjusting your search terms or category filter to find what you're looking for.
            </p>
          </motion.div>
        )}

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 floating-card bg-gradient-to-r from-primary-25 to-accent-25"
        >
          <h2 className="text-2xl font-semibold text-primary-800 mb-6 text-center">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">New to Mental Health?</h3>
              <p className="text-sm text-primary-700">
                Start with our educational videos and beginner-friendly resources to understand mental health basics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Need Immediate Relief?</h3>
              <p className="text-sm text-primary-700">
                Try our guided meditations and breathing exercises for instant stress relief and relaxation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Want to Learn More?</h3>
              <p className="text-sm text-primary-700">
                Download our comprehensive guides and workbooks for deeper learning and practical exercises.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResourceHub
