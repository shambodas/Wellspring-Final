import React, { createContext, useContext, useState, useEffect } from 'react'
import enTranslations from '../translations/en.json'
import hiTranslations from '../translations/hi.json'
import bnTranslations from '../translations/bn.json'
import taTranslations from '../translations/ta.json'
import urTranslations from '../translations/ur.json'
import teTranslations from '../translations/te.json'

const translations = {
  en: enTranslations,
  hi: hiTranslations,
  bn: bnTranslations,
  ta: taTranslations,
  ur: urTranslations,
  te: teTranslations
}

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wellspring-language')
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wellspring-language', currentLanguage)
  }, [currentLanguage])

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return the key if translation not found
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'ur', name: 'اردو', flag: '🇵🇰' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
    ]
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages,
    translations: translations[currentLanguage]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
