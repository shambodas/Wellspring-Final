// Example API endpoint for ChatGPT integration

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, context, mood, conversationHistory } = req.body;

    // Create a context-aware prompt
    const systemPrompt = `You are Wellspring, an empathetic AI mental health companion. 
    Your role is to provide emotional support, active listening, and helpful guidance.
    
    Current user mood: ${mood || 'neutral'}
    Recent conversation context: ${context?.topics?.join(', ') || 'none'}
    
    Guidelines:
    - Be warm, empathetic, and non-judgmental
    - Validate feelings and experiences
    - Provide supportive responses
    - Suggest helpful resources when appropriate
    - Never give medical advice
    - Escalate to crisis resources if needed
    
    Respond in a conversational, caring tone.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    // Analyze response for emotion and suggestions
    const emotion = analyzeEmotion(response);
    const suggestions = getSuggestions(mood, emotion);

    res.status(200).json({
      response: response,
      emotion: emotion,
      suggestions: suggestions
    });

  } catch (error) {
    console.error('ChatGPT API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      fallback: "I'm here to listen and support you. How can I help you today?"
    });
  }
}

function analyzeEmotion(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('concern') || textLower.includes('worried')) return 'concerned';
  if (textLower.includes('happy') || textLower.includes('great')) return 'happy';
  if (textLower.includes('understand') || textLower.includes('hear')) return 'understanding';
  if (textLower.includes('support') || textLower.includes('here')) return 'supportive';
  
  return 'supportive';
}

function getSuggestions(mood, emotion) {
  // Return appropriate suggestions based on mood and emotion
  const suggestionMap = {
    anxious: {
      icon: 'Zap',
      title: 'Anxiety Relief Tools',
      actions: [
        { text: '4-7-8 Breathing Exercise', link: '/breathing-exercises', icon: '🫁' },
        { text: 'Calming Sound Therapy', link: '/sound-therapy', icon: '🎵' }
      ]
    },
    stressed: {
      icon: 'Heart',
      title: 'Stress Management',
      actions: [
        { text: 'Guided Meditation', link: '/sound-therapy', icon: '🧘' },
        { text: 'Talk to a Therapist', link: '/therapy-booking', icon: '👩‍⚕️' }
      ]
    }
    // Add more mood-based suggestions
  };
  
  return suggestionMap[mood] || null;
}

// Environment variables needed:
// OPENAI_API_KEY=your_openai_api_key_here

// Installation:
// npm install openai

// Security considerations:
// - Store API keys in environment variables
// - Implement rate limiting
// - Add user authentication
// - Monitor API usage and costs
// - Implement content filtering
// - Add logging for safety and debugging
