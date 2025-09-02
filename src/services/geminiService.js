import { GEMINI_CONFIG, MENTAL_HEALTH_PROMPT, CRISIS_KEYWORDS, CRISIS_RESPONSE } from '../config/gemini.js'

// Direct API call to Gemini
const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.MODEL}:generateContent?key=${GEMINI_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
          temperature: GEMINI_CONFIG.TEMPERATURE,
        },
        safetySettings: GEMINI_CONFIG.SAFETY_SETTINGS
      })
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}

// Check for crisis keywords
export const checkForCrisis = (text) => {
  const textLower = text.toLowerCase()
  return CRISIS_KEYWORDS.some(keyword => textLower.includes(keyword))
}

// Generate mental health response using Gemini
export const generateMentalHealthResponse = async (userMessage, context = {}, mood = null) => {
  try {
    // Check for crisis keywords first
    if (checkForCrisis(userMessage)) {
      return {
        text: CRISIS_RESPONSE,
        emotion: 'concerned',
        suggestions: {
          icon: 'AlertTriangle',
          title: 'Crisis Support',
          color: 'from-red-400 to-pink-500',
          actions: [
            { text: 'Call Crisis Helpline', link: 'tel:1800-599-0019', icon: '📞' },
            { text: 'Book Emergency Therapy', link: '/therapy-booking', icon: '👩‍⚕️' },
            { text: 'Find Local Resources', link: '/resources', icon: '📍' }
          ]
        }
      }
    }

    // Prepare conversation history (last 8 turns for better context)
    const conversationHistory = context.messages ? 
      context.messages.slice(-8).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })) : []

    // Create the prompt
    const systemPrompt = MENTAL_HEALTH_PROMPT
      .replace('{context}', context.topics?.join(', ') || 'General conversation')
      .replace('{mood}', mood || 'neutral')

    // Build a richer prompt with brief conversation summary and guidance
    const historyText = conversationHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')
    const fullPrompt = `${systemPrompt}

Recent conversation:
${historyText || 'None'}

User: ${userMessage}

Assistant (empathetic, concise, specific, avoids medical diagnosis, offers 1-3 practical steps and a gentle follow-up question):`
    const responseText = await callGeminiAPI(fullPrompt)

    // Analyze response for emotion
    const emotion = analyzeResponseEmotion(responseText, mood)

    // Get suggestions based on mood and response
    const suggestions = getSuggestionsForMood(mood, emotion)

    return {
      text: responseText,
      emotion: emotion,
      suggestions: suggestions
    }

  } catch (error) {
    console.error('Gemini API Error:', error)
    
    // Fallback response
    return {
      text: "I'm having trouble connecting right now, but I'm still here for you. Please try again in a moment, or feel free to use our other support resources. Remember, you're not alone and there are people who care about you.",
      emotion: 'supportive',
      suggestions: null
    }
  }
}

// Analyze response emotion
const analyzeResponseEmotion = (text, userMood) => {
  const textLower = text.toLowerCase()
  
  if (textLower.includes('concern') || textLower.includes('worried') || textLower.includes('care')) {
    return 'concerned'
  }
  if (textLower.includes('happy') || textLower.includes('great') || textLower.includes('wonderful')) {
    return 'happy'
  }
  if (textLower.includes('understand') || textLower.includes('hear') || textLower.includes('feel')) {
    return 'understanding'
  }
  if (textLower.includes('support') || textLower.includes('here') || textLower.includes('help')) {
    return 'supportive'
  }
  if (textLower.includes('proud') || textLower.includes('accomplish') || textLower.includes('achievement')) {
    return 'proud'
  }
  
  return 'supportive'
}

// Get suggestions based on mood
const getSuggestionsForMood = (mood, emotion) => {
  const suggestionMap = {
    anxious: {
      icon: 'Zap',
      title: 'Anxiety Relief Tools',
      color: 'from-yellow-400 to-orange-500',
      actions: [
        { text: '4-7-8 Breathing Exercise', link: '/breathing-exercises', icon: '🫁' },
        { text: 'Calming Sound Therapy', link: '/sound-therapy', icon: '🎵' },
        { text: 'Grounding Techniques', link: '/resources', icon: '🌱' },
        { text: 'Journal Your Thoughts', link: '/journal', icon: '📝' }
      ]
    },
    stressed: {
      icon: 'Heart',
      title: 'Stress Management',
      color: 'from-red-400 to-pink-500',
      actions: [
        { text: 'Guided Meditation', link: '/sound-therapy', icon: '🧘' },
        { text: 'Mood Tracking', link: '/mood-tracker', icon: '📊' },
        { text: 'Talk to a Therapist', link: '/therapy-booking', icon: '👩‍⚕️' },
        { text: 'Take a Break', link: '/resources', icon: '☕' }
      ]
    },
    lonely: {
      icon: 'Users',
      title: 'Connection & Community',
      color: 'from-blue-400 to-indigo-500',
      actions: [
        { text: 'Join Support Community', link: '/community', icon: '👥' },
        { text: 'Find Local Groups', link: '/resources', icon: '📍' },
        { text: 'Book Therapy Session', link: '/therapy-booking', icon: '💬' },
        { text: 'Volunteer Opportunities', link: '/resources', icon: '🤝' }
      ]
    },
    happy: {
      icon: 'Sparkles',
      title: 'Celebrate & Share',
      color: 'from-green-400 to-emerald-500',
      actions: [
        { text: 'Record Your Joy', link: '/journal', icon: '📖' },
        { text: 'Share with Community', link: '/community', icon: '🎉' },
        { text: 'Gratitude Practice', link: '/resources', icon: '🙏' },
        { text: 'Plan Something Fun', link: '/resources', icon: '🎯' }
      ]
    },
    need_support: {
      icon: 'MessageCircle',
      title: 'Support Options',
      color: 'from-purple-400 to-violet-500',
      actions: [
        { text: 'Professional Therapy', link: '/therapy-booking', icon: '👩‍⚕️' },
        { text: 'Peer Support Groups', link: '/community', icon: '👥' },
        { text: 'Crisis Resources', link: '/resources', icon: '🆘' },
        { text: 'Self-Help Tools', link: '/resources', icon: '🛠️' }
      ]
    }
  }
  
  return suggestionMap[mood] || null
}

// Test API connection
export const testGeminiConnection = async () => {
  try {
    const response = await callGeminiAPI('Hello, this is a test message.')
    return response ? true : false
  } catch (error) {
    console.error('Gemini connection test failed:', error)
    return false
  }
}
