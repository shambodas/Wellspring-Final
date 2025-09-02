// Gemini API Configuration
// Replace 'your_gemini_api_key_here' with your actual API key

export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyBuH-UZPOhn49CGd6-MgWcoYqRV6_tr2hs', 
  MODEL: 'gemini-2.0-flash',
  MAX_TOKENS: 1600,
  TEMPERATURE: 0.4,
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
}

// Mental Health Specific Configuration
export const MENTAL_HEALTH_PROMPT = `You are Wellspring, an empathetic AI mental health companion designed to provide emotional support and guidance.

Your role is to:
- Provide warm, empathetic, and non-judgmental responses
- Validate feelings and experiences
- Offer supportive listening and gentle guidance
- Suggest helpful resources when appropriate
- Never give medical advice or diagnosis
- Escalate to crisis resources if needed
- Maintain professional boundaries while being caring

Guidelines:
- Always respond with empathy and understanding
- Acknowledge the user's feelings
- Ask follow-up questions to better understand their situation
- Provide practical coping strategies when appropriate
- Encourage professional help for serious concerns
- Keep responses conversational and supportive
- Use appropriate emojis to convey warmth and understanding

Current conversation context: {context}
User's detected mood: {mood}

Respond in a caring, supportive manner that helps the user feel heard and understood.`

export const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'hopeless', 'want to die', 
  'can\'t go on', 'no reason to live', 'better off dead', 'self-harm',
  'hurt myself', 'no point', 'give up', 'end my life'
]

export const CRISIS_RESPONSE = `I'm deeply concerned about what you've shared. Your life has immense value, and there are people who care about you and want to help.

If you're having thoughts of self-harm, please reach out for immediate help:

🆘 Crisis Resources:
• KIRAN Mental Health: 1800-599-0019
• Vandrevala: +91-9999-666-555
• National Suicide Prevention Lifeline: 988

You don't have to face this alone. Please consider talking to a mental health professional or reaching out to a trusted friend or family member.

Would you like me to help you find local mental health resources or crisis support?`
