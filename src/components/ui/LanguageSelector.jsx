import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = getAvailableLanguages()
  const currentLang = languages.find(lang => lang.code === currentLanguage)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
        aria-label="Select language"
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{currentLang?.flag}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-primary-100 py-2 z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-primary-50 transition-colors duration-150 ${
                  currentLanguage === language.code 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-secondary-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSelector
