// Simple translation service for chatbot
// In a production environment, you would use Google Translate API or similar

const translationMap = {
  // Hindi to English
  'hi': {
    'नमस्ते': 'Hello',
    'कैसे हो': 'How are you',
    'मैं उदास हूं': 'I am sad',
    'मुझे चिंता है': 'I am worried',
    'मदद चाहिए': 'I need help',
    'धन्यवाद': 'Thank you',
    'अलविदा': 'Goodbye',
    'मैं तनाव में हूं': 'I am stressed',
    'नींद नहीं आ रही': 'I cannot sleep',
    'मैं अकेला महसूस कर रहा हूं': 'I feel lonely'
  },
  // Bengali to English
  'bn': {
    'হ্যালো': 'Hello',
    'কেমন আছেন': 'How are you',
    'আমি দুঃখিত': 'I am sad',
    'আমি উদ্বিগ্ন': 'I am worried',
    'আমার সাহায্য দরকার': 'I need help',
    'ধন্যবাদ': 'Thank you',
    'বিদায়': 'Goodbye',
    'আমি চাপে আছি': 'I am stressed',
    'ঘুম আসছে না': 'I cannot sleep',
    'আমি একা বোধ করছি': 'I feel lonely'
  },
  // Tamil to English
  'ta': {
    'வணக்கம்': 'Hello',
    'எப்படி இருக்கிறீர்கள்': 'How are you',
    'நான் வருத்தமாக இருக்கிறேன்': 'I am sad',
    'நான் கவலைப்படுகிறேன்': 'I am worried',
    'எனக்கு உதவி தேவை': 'I need help',
    'நன்றி': 'Thank you',
    'பிரியாவிடை': 'Goodbye',
    'நான் மன அழுத்தத்தில் இருக்கிறேன்': 'I am stressed',
    'தூக்கம் வரவில்லை': 'I cannot sleep',
    'நான் தனியாக உணர்கிறேன்': 'I feel lonely'
  }
}

// English to other languages
const reverseTranslationMap = {
  'hi': {
    'Hello': 'नमस्ते',
    'How are you': 'कैसे हो',
    'I am sad': 'मैं उदास हूं',
    'I am worried': 'मुझे चिंता है',
    'I need help': 'मदद चाहिए',
    'Thank you': 'धन्यवाद',
    'Goodbye': 'अलविदा',
    'I am stressed': 'मैं तनाव में हूं',
    'I cannot sleep': 'नींद नहीं आ रही',
    'I feel lonely': 'मैं अकेला महसूस कर रहा हूं'
  },
  'bn': {
    'Hello': 'হ্যালো',
    'How are you': 'কেমন আছেন',
    'I am sad': 'আমি দুঃখিত',
    'I am worried': 'আমি উদ্বিগ্ন',
    'I need help': 'আমার সাহায্য দরকার',
    'Thank you': 'ধন্যবাদ',
    'Goodbye': 'বিদায়',
    'I am stressed': 'আমি চাপে আছি',
    'I cannot sleep': 'ঘুম আসছে না',
    'I feel lonely': 'আমি একা বোধ করছি'
  },
  'ta': {
    'Hello': 'வணக்கம்',
    'How are you': 'எப்படி இருக்கிறீர்கள்',
    'I am sad': 'நான் வருத்தமாக இருக்கிறேன்',
    'I am worried': 'நான் கவலைப்படுகிறேன்',
    'I need help': 'எனக்கு உதவி தேவை',
    'Thank you': 'நன்றி',
    'Goodbye': 'பிரியாவிடை',
    'I am stressed': 'நான் மன அழுத்தத்தில் இருக்கிறேன்',
    'I cannot sleep': 'தூக்கம் வரவில்லை',
    'I feel lonely': 'நான் தனியாக உணர்கிறேன்'
  }
}

export const translateToEnglish = (text, sourceLanguage) => {
  if (sourceLanguage === 'en') return text
  
  const translations = translationMap[sourceLanguage]
  if (!translations) return text

  // Simple word-by-word translation
  let translatedText = text
  Object.keys(translations).forEach(key => {
    const regex = new RegExp(key, 'gi')
    translatedText = translatedText.replace(regex, translations[key])
  })

  return translatedText || text
}

export const translateFromEnglish = (text, targetLanguage) => {
  if (targetLanguage === 'en') return text
  
  const translations = reverseTranslationMap[targetLanguage]
  if (!translations) return text

  // Simple word-by-word translation
  let translatedText = text
  Object.keys(translations).forEach(key => {
    const regex = new RegExp(key, 'gi')
    translatedText = translatedText.replace(regex, translations[key])
  })

  return translatedText || text
}

// For more complex translations, you would integrate with Google Translate API
export const translateWithAPI = async (text, sourceLanguage, targetLanguage) => {
  // This would be implemented with Google Translate API or similar
  // For now, we'll use the simple translation map
  if (sourceLanguage === targetLanguage) return text
  
  if (sourceLanguage === 'en') {
    return translateFromEnglish(text, targetLanguage)
  } else if (targetLanguage === 'en') {
    return translateToEnglish(text, sourceLanguage)
  } else {
    // Translate to English first, then to target language
    const englishText = translateToEnglish(text, sourceLanguage)
    return translateFromEnglish(englishText, targetLanguage)
  }
}
