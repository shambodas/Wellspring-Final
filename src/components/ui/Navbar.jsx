import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Droplets, User, Crown, ChevronDown, Shield, Sun, Moon, Coins } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link as RouterLink } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const location = useLocation()
  const { t } = useLanguage()
  const moreDropdownRef = useRef(null)

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.moodTracker'), path: '/mood-tracker' },
    { name: t('navbar.aiChat'), path: '/chat' },
    { name: t('navbar.breathing'), path: '/breathing-exercises' },
    { name: t('navbar.journal'), path: '/journal' },
    { name: t('navbar.therapy'), path: '/therapy-booking' },
    { name: t('navbar.soundTherapy'), path: '/sound-therapy' },
    { name: t('navbar.resources'), path: '/resource-hub' },
    { name: t('navbar.community'), path: '/community' },
    { name: t('navbar.premium'), path: '/subscription' },
    { name: 'Admin', path: '/admin' }
  ]



  return (
    <>
      <nav className="fixed top-0 w-full z-40 glass-card border-b border-primary-100 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group -ml-2">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Droplets className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </motion.div>
              <span className="text-xl font-display font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                Wellspring
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    location.pathname === item.path
                      ? (item.name === 'Admin'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm dark:from-primary-600 dark:to-primary-700'
                          : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300')
                      : (item.name === 'Admin'
                          ? 'text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 dark:text-primary-300 dark:bg-gray-800 dark:border-primary-800'
                          : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400')
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Medium Screen Navigation - Show fewer items */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    location.pathname === item.path
                      ? (item.name === 'Admin'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm dark:from-primary-600 dark:to-primary-700'
                          : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300')
                      : (item.name === 'Admin'
                          ? 'text-primary-600 border border-primary-200 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-gray-800'
                          : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400')
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* More dropdown for medium screens */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="px-2 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 flex items-center space-x-1 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                >
                  <span>More</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-primary-100 dark:border-gray-700 py-1 z-50"
                    >
                      {navItems.slice(5).map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMoreOpen(false)}
                          className={`block px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                            location.pathname === item.path
                              ? (item.name === 'Admin'
                                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white dark:from-primary-600 dark:to-primary-700'
                                  : 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300')
                              : (item.name === 'Admin'
                                  ? 'text-primary-600 border border-primary-200 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-gray-700'
                                  : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700')
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Items */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <LanguageSelector />
              <Link
                to="/wallet"
                className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:hover:text-amber-300 border border-amber-200 dark:border-amber-800"
                title="Mind Coins Wallet"
              >
                <Coins size={20} />
              </Link>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <RouterLink to="/sign-in" className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 dark:text-primary-300 dark:bg-gray-800 dark:border-primary-800">
                  Sign In
                </RouterLink>
              </SignedOut>
            </div>

            {/* Medium Screen Right Side Items */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <LanguageSelector />
              <Link
                to="/wallet"
                className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:hover:text-amber-300 border border-amber-200 dark:border-amber-800"
                title="Mind Coins Wallet"
              >
                <Coins size={18} />
              </Link>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <RouterLink to="/sign-in" className="px-2 py-1.5 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 dark:text-primary-300 dark:bg-gray-800 dark:border-primary-800">
                  Sign In
                </RouterLink>
              </SignedOut>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-primary-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      location.pathname === item.path
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                
                {/* Wallet Link in Mobile Menu */}
                <Link
                  to="/wallet"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:hover:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>Mind Coins Wallet</span>
                </Link>

                {/* Dark Mode Toggle in Mobile Menu */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}

export default Navbar