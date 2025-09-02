import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, AlertTriangle, Phone, Heart, Smile, Frown, Meh, Angry, Zap, Sparkles, MessageCircle, Lightbulb, BookOpen, Music, Users, Calendar, Globe } from 'lucide-react'
import { generateMentalHealthResponse, testGeminiConnection } from '../services/geminiService.js'
import { useLanguage } from '../contexts/LanguageContext'
import { translateToEnglish, translateFromEnglish } from '../utils/translationService'

const Chat = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage()
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('chat.welcome') || "Hello! I'm your Wellspring AI companion. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling today? 😊",
      isBot: true,
      timestamp: new Date(),
      emotion: 'warm'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userMood, setUserMood] = useState(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const [conversationContext, setConversationContext] = useState({
    topics: [],
    emotions: [],
    sessionStart: new Date()
  })
  const messagesEndRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' }
  ]

  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hopeless', 'want to die', 'can\'t go on', 'no reason to live', 'better off dead']
  
  const quickPrompts = [
    { text: "I'm feeling anxious", emoji: "😰", mood: "anxious", color: "from-yellow-400 to-orange-500" },
    { text: "I'm stressed about exams", emoji: "📚", mood: "stressed", color: "from-red-400 to-pink-500" },
    { text: "I feel lonely", emoji: "😔", mood: "lonely", color: "from-blue-400 to-indigo-500" },
    { text: "I'm having a good day", emoji: "😊", mood: "happy", color: "from-green-400 to-emerald-500" },
    { text: "I need someone to talk to", emoji: "💭", mood: "need_support", color: "from-purple-400 to-violet-500" },
    { text: "I'm feeling overwhelmed", emoji: "😵", mood: "overwhelmed", color: "from-gray-400 to-slate-500" },
    { text: "I'm excited about something", emoji: "🎉", mood: "excited", color: "from-pink-400 to-rose-500" },
    { text: "I'm feeling grateful", emoji: "🙏", mood: "grateful", color: "from-amber-400 to-yellow-500" },
    { text: "I'm having relationship issues", emoji: "💔", mood: "relationship", color: "from-pink-400 to-red-500" },
    { text: "I'm worried about my future", emoji: "🔮", mood: "worried", color: "from-purple-400 to-indigo-500" },
    { text: "I'm feeling proud of myself", emoji: "🏆", mood: "proud", color: "from-yellow-400 to-orange-500" },
    { text: "I'm struggling with motivation", emoji: "⚡", mood: "unmotivated", color: "from-gray-400 to-slate-500" }
  ]

  const moodResponses = {
    anxious: [
      "I can sense the anxiety in your words, and I want you to know that's completely okay. Anxiety is your body's way of trying to protect you. Let's work through this together - what's making you feel most anxious right now?",
      "Anxiety can feel like a storm inside your mind. Remember, storms pass, and you've weathered them before. Would you like to try a quick grounding exercise together?"
    ],
    stressed: [
      "Stress can feel like carrying a heavy backpack that keeps getting heavier. Let's unpack it together - what's weighing on you the most right now?",
      "I hear how stressed you are, and I want you to know that your feelings are valid. Stress is your body's response to pressure, and it's okay to feel this way."
    ],
    lonely: [
      "Loneliness can feel like being in a crowded room but still feeling invisible. I see you, I hear you, and I'm here with you right now. What would help you feel more connected?",
      "Feeling lonely is one of the most human experiences there is. You're not alone in feeling alone. Let's talk about what connection means to you."
    ],
    happy: [
      "Your joy is contagious! I can feel the positive energy in your words. What's bringing you this happiness? I'd love to celebrate it with you!",
      "It's beautiful to hear you're having a good day! These moments of happiness are precious and worth savoring. What made today special?"
    ],
    need_support: [
      "It takes courage to reach out and ask for support. I'm here, I'm listening, and I care about what you have to say. What's on your heart right now?",
      "Thank you for trusting me enough to ask for support. That's a sign of strength, not weakness. I'm here to listen without judgment."
    ],
    overwhelmed: [
      "Feeling overwhelmed is like trying to drink from a firehose - it's too much all at once. Let's take a deep breath together and tackle this one step at a time.",
      "When everything feels like too much, it's okay to pause. You don't have to figure everything out right now. Let's just focus on this moment."
    ],
    excited: [
      "Your excitement is absolutely infectious! I can feel your energy through the screen. Tell me more about what's got you so excited!",
      "Excitement is such a beautiful emotion! It's like having butterflies in your stomach in the best way. What's sparking this joy in you?"
    ],
    grateful: [
      "Gratitude is such a powerful emotion - it's like sunshine for the soul. What are you feeling grateful for today? I'd love to celebrate that with you.",
      "Your gratitude is beautiful and inspiring. It's amazing how focusing on what we're thankful for can shift our entire perspective."
    ],
    relationship: [
      "Relationships can be complex and challenging. It's completely normal to feel confused or hurt. Would you like to talk more about what's happening?",
      "Relationship issues can really weigh on our hearts. I'm here to listen and help you process what you're going through."
    ],
    worried: [
      "Worrying about the future is something many people experience. It shows you care about what's ahead. Let's talk about what's most concerning you.",
      "Future uncertainty can feel overwhelming. Remember that you don't have to figure everything out right now. Let's take it one step at a time."
    ],
    proud: [
      "I love hearing about your accomplishments! You should be proud of yourself. What did you achieve that's making you feel this way?",
      "Your pride is well-deserved! Celebrating our wins, big and small, is so important. Tell me more about what you're proud of!"
    ],
    unmotivated: [
      "Lack of motivation can feel really frustrating. It's okay to have these periods - they're often temporary. What do you think might help you feel more energized?",
      "Motivation comes and goes, and that's completely normal. Sometimes we need to be gentle with ourselves during these times. What would feel manageable right now?"
    ]
  }

  const suggestions = {
    anxious: {
      icon: Zap,
      title: "Anxiety Relief Tools",
      color: "from-yellow-400 to-orange-500",
      actions: [
        { text: "4-7-8 Breathing Exercise", link: "/breathing-exercises", icon: "🫁" },
        { text: "Calming Sound Therapy", link: "/sound-therapy", icon: "🎵" },
        { text: "Grounding Techniques", link: "/resources", icon: "🌱" },
        { text: "Journal Your Thoughts", link: "/journal", icon: "📝" }
      ]
    },
    stressed: {
      icon: Heart,
      title: "Stress Management",
      color: "from-red-400 to-pink-500",
      actions: [
        { text: "Guided Meditation", link: "/sound-therapy", icon: "🧘" },
        { text: "Mood Tracking", link: "/mood-tracker", icon: "📊" },
        { text: "Talk to a Therapist", link: "/therapy-booking", icon: "👩‍⚕️" },
        { text: "Take a Break", link: "/resources", icon: "☕" }
      ]
    },
    lonely: {
      icon: Users,
      title: "Connection & Community",
      color: "from-blue-400 to-indigo-500",
      actions: [
        { text: t('chat.suggestions.joinCommunity'), link: "/community", icon: "👥" },
        { text: t('chat.suggestions.findGroups'), link: "/resources", icon: "📍" },
        { text: t('chat.suggestions.bookTherapy'), link: "/therapy-booking", icon: "💬" },
        { text: t('chat.suggestions.volunteer'), link: "/resources", icon: "🤝" }
      ]
    },
    happy: {
      icon: Sparkles,
      title: "Celebrate & Share",
      color: "from-green-400 to-emerald-500",
      actions: [
        { text: "Record Your Joy", link: "/journal", icon: "📖" },
        { text: "Share with Community", link: "/community", icon: "🎉" },
        { text: "Gratitude Practice", link: "/resources", icon: "🙏" },
        { text: "Plan Something Fun", link: "/resources", icon: "🎯" }
      ]
    },
    need_support: {
      icon: MessageCircle,
      title: "Support Options",
      color: "from-purple-400 to-violet-500",
      actions: [
        { text: "Professional Therapy", link: "/therapy-booking", icon: "👩‍⚕️" },
        { text: "Peer Support Groups", link: "/community", icon: "👥" },
        { text: "Crisis Resources", link: "/resources", icon: "🆘" },
        { text: "Self-Help Tools", link: "/resources", icon: "🛠️" }
      ]
    },
    overwhelmed: {
      icon: Lightbulb,
      title: "Break It Down",
      color: "from-gray-400 to-slate-500",
      actions: [
        { text: "Priority Setting", link: "/resources", icon: "📋" },
        { text: "Time Management", link: "/resources", icon: "⏰" },
        { text: "Stress Relief", link: "/sound-therapy", icon: "🧘" },
        { text: "Ask for Help", link: "/therapy-booking", icon: "🤝" }
      ]
    },
    excited: {
      icon: Sparkles,
      title: "Channel Your Energy",
      color: "from-pink-400 to-rose-500",
      actions: [
        { text: "Set Goals", link: "/resources", icon: "🎯" },
        { text: "Share Your Plans", link: "/community", icon: "📢" },
        { text: "Document This", link: "/journal", icon: "📝" },
        { text: "Celebrate Small Wins", link: "/resources", icon: "🏆" }
      ]
    },
    grateful: {
      icon: Heart,
      title: "Nurture Gratitude",
      color: "from-amber-400 to-yellow-500",
      actions: [
        { text: "Gratitude Journal", link: "/journal", icon: "📖" },
        { text: "Express Thanks", link: "/community", icon: "💌" },
        { text: "Mindfulness Practice", link: "/sound-therapy", icon: "🧘" },
        { text: "Pay It Forward", link: "/resources", icon: "🤝" }
      ]
    },
    relationship: {
      icon: Heart,
      title: "Relationship Support",
      color: "from-pink-400 to-red-500",
      actions: [
        { text: "Couples Therapy", link: "/therapy-booking", icon: "👫" },
        { text: "Communication Tips", link: "/resources", icon: "💬" },
        { text: "Self-Care", link: "/resources", icon: "💆" },
        { text: "Boundary Setting", link: "/resources", icon: "🛡️" }
      ]
    },
    worried: {
      icon: Lightbulb,
      title: "Future Planning",
      color: "from-purple-400 to-indigo-500",
      actions: [
        { text: "Goal Setting", link: "/resources", icon: "🎯" },
        { text: "Career Counseling", link: "/therapy-booking", icon: "💼" },
        { text: "Financial Planning", link: "/resources", icon: "💰" },
        { text: "Stress Management", link: "/sound-therapy", icon: "🧘" }
      ]
    },
    proud: {
      icon: Sparkles,
      title: "Celebrate Success",
      color: "from-yellow-400 to-orange-500",
      actions: [
        { text: "Record Achievement", link: "/journal", icon: "📝" },
        { text: "Share with Others", link: "/community", icon: "🎉" },
        { text: "Set New Goals", link: "/resources", icon: "🎯" },
        { text: "Reward Yourself", link: "/resources", icon: "🎁" }
      ]
    },
    unmotivated: {
      icon: Zap,
      title: "Find Motivation",
      color: "from-gray-400 to-slate-500",
      actions: [
        { text: "Small Steps", link: "/resources", icon: "👣" },
        { text: "Energy Boost", link: "/sound-therapy", icon: "⚡" },
        { text: "Accountability Partner", link: "/community", icon: "🤝" },
        { text: "Professional Help", link: "/therapy-booking", icon: "👩‍⚕️" }
      ]
    }
  }

  // Gemini API Integration
  const callGeminiAPI = async (userMessage, context) => {
    try {
      const response = await generateMentalHealthResponse(userMessage, context, userMood)
      return response
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      return null
    }
  }

  const detectMood = (text) => {
    const textLower = text.toLowerCase()
    
    if (textLower.includes('anxious') || textLower.includes('worried') || textLower.includes('nervous')) return 'anxious'
    if (textLower.includes('stressed') || textLower.includes('pressure') || textLower.includes('overwhelmed')) return 'stressed'
    if (textLower.includes('lonely') || textLower.includes('alone') || textLower.includes('isolated')) return 'lonely'
    if (textLower.includes('happy') || textLower.includes('good') || textLower.includes('great') || textLower.includes('excited')) return 'happy'
    if (textLower.includes('overwhelmed') || textLower.includes('too much') || textLower.includes('can\'t handle')) return 'overwhelmed'
    if (textLower.includes('excited') || textLower.includes('thrilled') || textLower.includes('pumped')) return 'excited'
    if (textLower.includes('grateful') || textLower.includes('thankful') || textLower.includes('blessed')) return 'grateful'
    if (textLower.includes('relationship') || textLower.includes('partner') || textLower.includes('boyfriend') || textLower.includes('girlfriend') || textLower.includes('marriage')) return 'relationship'
    if (textLower.includes('future') || textLower.includes('career') || textLower.includes('job') || textLower.includes('money') || textLower.includes('financial')) return 'worried'
    if (textLower.includes('proud') || textLower.includes('accomplished') || textLower.includes('achieved') || textLower.includes('success')) return 'proud'
    if (textLower.includes('motivation') || textLower.includes('lazy') || textLower.includes('procrastinate') || textLower.includes('tired')) return 'unmotivated'
    if (textLower.includes('help') || textLower.includes('support') || textLower.includes('talk')) return 'need_support'
    
    return null
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Test Gemini connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await testGeminiConnection()
        setIsConnected(isConnected)
      } catch (error) {
        console.error('Failed to test Gemini connection:', error)
        setIsConnected(false)
      }
    }
    
    testConnection()
  }, [])

  // Debug language selector state
  useEffect(() => {
    console.log('Chat component mounted')
    console.log('showLanguageSelector:', showLanguageSelector)
    console.log('currentLanguage:', currentLanguage)
    
    // Force show language selector on mount
    setShowLanguageSelector(true)
    console.log('Forced showLanguageSelector to true')
    
    // Prevent automatic hiding of language selector
    const savedLanguage = localStorage.getItem('wellspring-language')
    if (savedLanguage && savedLanguage !== 'en') {
      console.log('Found saved language, but keeping selector visible for testing')
    }
  }, [])

  useEffect(() => {
    console.log('showLanguageSelector changed to:', showLanguageSelector)
  }, [showLanguageSelector])

  useEffect(() => {
    console.log('currentLanguage changed to:', currentLanguage)
    console.log('showLanguageSelector at language change:', showLanguageSelector)
  }, [currentLanguage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkForCrisisKeywords = (text) => {
    return crisisKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const handleLanguageSelect = (languageCode) => {
    console.log('=== handleLanguageSelect called ===')
    console.log('languageCode:', languageCode)
    console.log('Before changeLanguage - currentLanguage:', currentLanguage)
    console.log('Before setShowLanguageSelector - showLanguageSelector:', showLanguageSelector)
    
    changeLanguage(languageCode)
    setShowLanguageSelector(false)
    console.log('After setShowLanguageSelector - showLanguageSelector should be false')
    
    // Update welcome message in new language
    const welcomeMessages = {
      en: "Hello! I'm your Wellspring AI companion. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling today? 😊",
      hi: "नमस्ते! मैं आपका Wellspring AI साथी हूं। मैं यहां आपकी बात सुनने, आपका समर्थन करने और आपको जो भी चुनौती आ रही है उसमें मदद करने के लिए हूं। आज आप कैसा महसूस कर रहे हैं? 😊",
      ta: "வணக்கம்! நான் உங்கள் Wellspring AI துணை. நான் இங்கே உங்கள் பேச்சைக் கேட்க, ஆதரிக்க மற்றும் நீங்கள் எதிர்கொள்ளும் எந்த சவாலுக்கும் உதவுவதற்கு இருக்கிறேன். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்? 😊",
      bn: "হ্যালো! আমি আপনার Wellspring AI সঙ্গী। আমি এখানে আপনার কথা শুনতে, সমর্থন করতে এবং আপনি যে চ্যালেঞ্জের মুখোমুখি হচ্ছেন তাতে সাহায্য করার জন্য আছি। আজ আপনি কেমন অনুভব করছেন? 😊"
    }
    
    setMessages([{
      id: 1,
      text: welcomeMessages[languageCode] || welcomeMessages.en,
      isBot: true,
      timestamp: new Date(),
      emotion: 'warm'
    }])
    
    console.log('=== handleLanguageSelect completed ===')
  }

  const sendMessage = async (text = inputValue, mood = null) => {
    if (!text.trim()) return

    // Translate user input to English if not already in English
    const translatedText = currentLanguage !== 'en' ? translateToEnglish(text, currentLanguage) : text

    const detectedMood = mood || detectMood(translatedText)
    if (detectedMood) {
      setUserMood(detectedMood)
    }

    const newUserMessage = {
      id: messages.length + 1,
      text: text, // Keep original text for display
      isBot: false,
      timestamp: new Date(),
      emotion: detectedMood
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsTyping(true)

    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      topics: [...prev.topics, text.substring(0, 50)],
      emotions: [...prev.emotions, detectedMood].filter(Boolean)
    }))

    try {
      const response = await callGeminiAPI(translatedText, conversationContext)
      
      if (response) {
        // Translate bot response back to user's language if not English
        const botResponseText = currentLanguage !== 'en' ? translateFromEnglish(response.text, currentLanguage) : response.text
        
        const newBotMessage = {
          id: messages.length + 2,
          text: botResponseText,
          isBot: true,
          timestamp: new Date(),
          emotion: response.emotion,
          suggestions: response.suggestions
        }

        setMessages(prev => [...prev, newBotMessage])
      } else {
        // Fallback response
        const fallbackText = currentLanguage !== 'en' ? translateFromEnglish("I'm here to listen and support you. Thank you for sharing that with me. How can I best help you right now?", currentLanguage) : "I'm here to listen and support you. Thank you for sharing that with me. How can I best help you right now?"
        
        const fallbackResponse = {
          id: messages.length + 2,
          text: fallbackText,
          isBot: true,
          timestamp: new Date(),
          emotion: 'supportive'
        }
        setMessages(prev => [...prev, fallbackResponse])
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorResponse = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now, but I'm still here for you. Please try again in a moment, or feel free to use our other support resources.",
        isBot: true,
        timestamp: new Date(),
        emotion: 'concerned'
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt.text, prompt.mood)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊'
      case 'anxious': return '😰'
      case 'stressed': return '😤'
      case 'lonely': return '😔'
      case 'excited': return '🎉'
      case 'grateful': return '🙏'
      case 'overwhelmed': return '😵'
      case 'concerned': return '😟'
      case 'relationship': return '💔'
      case 'worried': return '🔮'
      case 'proud': return '🏆'
      case 'unmotivated': return '⚡'
      case 'understanding': return '🤗'
      case 'warm': return '💝'
      default: return '💭'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Language Selector - Only show if not selected yet */}
        {console.log('Rendering language selector, showLanguageSelector:', showLanguageSelector)}
        {showLanguageSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="floating-card max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Globe className="w-8 h-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-secondary-800">
                  Choose Your Language
                </h1>
              </div>
              <p className="text-secondary-600 mb-6">
                Select your preferred language for AI communication
              </p>

              <div className="grid grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      console.log('Language button clicked:', language.code)
                      handleLanguageSelect(language.code)
                    }}
                    className="p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-300 hover:bg-primary-25 transition-all duration-200 text-left"
                  >
                    <div className="text-2xl mb-2">{language.flag}</div>
                    <div className="font-medium text-secondary-800">{language.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Interface - Only show after language selection */}
        {!showLanguageSelector && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
                Let's Talk, I'm Listening
              </h1>
              <p className="text-secondary-600">
                Your safe space to talk, vent, and get emotionally intelligent support
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-secondary-500">
                  {isConnected ? 'AI Connected' : 'Connecting to AI...'}
                </span>
                {userMood && (
                  <div className="flex items-center space-x-1 ml-4">
                    <span className="text-xs text-secondary-500">Current mood:</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {getEmotionIcon(userMood)} {userMood}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chat Container */}
            <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
              {/* Messages Area */}
              <div className="h-96 lg:h-[500px] overflow-y-auto p-6 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-primary-500' : 'bg-secondary-400'}`}>
                          {message.isBot ? (
                            <Bot className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className={`rounded-2xl px-4 py-3 ${message.isBot 
                            ? 'bg-white border border-primary-100' 
                            : 'bg-primary-500 text-white'
                          }`}>
                            <p className="text-sm lg:text-base">{message.text}</p>
                            {message.emotion && (
                              <div className="mt-2 text-xs opacity-70">
                                {getEmotionIcon(message.emotion)}
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced Suggestions */}
                          {message.suggestions && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-4 bg-accent-50 rounded-xl border border-accent-200"
                            >
                              <div className="flex items-center space-x-2 mb-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${message.suggestions.color} flex items-center justify-center`}>
                                  <message.suggestions.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-accent-800">{message.suggestions.title}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {message.suggestions.actions.map((action, index) => (
                                  <a
                                    key={index}
                                    href={action.link}
                                    className="flex items-center space-x-2 text-sm bg-white hover:bg-accent-50 text-accent-700 px-3 py-2 rounded-lg border border-accent-200 hover:border-accent-300 transition-all duration-200"
                                  >
                                    <span>{action.icon}</span>
                                    <span>{action.text}</span>
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          
                          <p className="text-xs text-secondary-400 mt-2">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white border border-primary-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-secondary-500">{t('chat.thinking')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Quick Prompts */}
              <div className="px-6 py-4 border-t border-primary-100 bg-primary-25">
                <p className="text-sm text-secondary-600 mb-3">{t('chat.suggestions')}:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickPrompt(prompt)}
                      className={`text-sm bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-lg border border-secondary-200 hover:border-primary-300 transition-all duration-200 flex items-center space-x-1`}
                    >
                      <span>{prompt.emoji}</span>
                      <span>{prompt.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Input Area */}
              <div className="p-6 border-t border-primary-100">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Crisis Support Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">
                  You're Not Alone
                </h3>
                <p className="text-secondary-600 mb-6">
                  If you're having thoughts of self-harm, please reach out for immediate help. 
                  Your life matters and there are people who want to support you.
                </p>
                
                <div className="space-y-3 mb-6">
                  <a
                    href="tel:1800-599-0019"
                    className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>KIRAN Mental Health: 1800-599-0019</span>
                  </a>
                  <a
                    href="tel:+91-9999-666-555"
                    className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Vandrevala: +91-9999-666-555</span>
                  </a>
                </div>

                <div className="flex space-x-3">
                  <a
                    href="/therapy-booking"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    Book Therapy
                  </a>
                  <button
                    onClick={() => setShowCrisisModal(false)}
                    className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    Continue Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chat