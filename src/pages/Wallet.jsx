import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coins, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Gift, 
  Calendar,
  Star,
  Zap,
  Crown,
  Gem,
  Award,
  History,
  RefreshCw
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getMindCoinSummary } from '../services/mindCoinService'

const Wallet = () => {
  const { t } = useLanguage()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeUntilNextEarn, setTimeUntilNextEarn] = useState(0)

  useEffect(() => {
    loadSummary()
    
    // Update countdown every second
    const interval = setInterval(() => {
      if (summary?.timeUntilNextEarn > 0) {
        setTimeUntilNextEarn(prev => Math.max(0, prev - 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const loadSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading wallet summary...')
      const data = await getMindCoinSummary()
      console.log('Wallet summary data:', data)
      setSummary(data)
      setTimeUntilNextEarn(data.timeUntilNextEarn || 0)
    } catch (err) {
      console.error('Error loading wallet summary:', err)
      setError(err.message || 'Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const getBadgeIcon = (badgeType) => {
    switch (badgeType) {
      case 'bronze': return <Award className="w-6 h-6 text-amber-600" />
      case 'silver': return <Star className="w-6 h-6 text-gray-400" />
      case 'gold': return <Crown className="w-6 h-6 text-yellow-500" />
      case 'diamond': return <Gem className="w-6 h-6 text-blue-500" />
      default: return <Trophy className="w-6 h-6 text-gray-400" />
    }
  }

  const getBadgeColor = (badgeType) => {
    switch (badgeType) {
      case 'bronze': return 'from-amber-400 to-amber-600'
      case 'silver': return 'from-gray-300 to-gray-500'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'diamond': return 'from-blue-400 to-blue-600'
      default: return 'from-gray-300 to-gray-500'
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'EARN': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'BONUS': return <Gift className="w-5 h-5 text-purple-500" />
      case 'REDEEM': return <Coins className="w-5 h-5 text-blue-500" />
      case 'ADJUST': return <RefreshCw className="w-5 h-5 text-gray-500" />
      default: return <History className="w-5 h-5 text-gray-500" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'EARN': return 'text-green-600'
      case 'BONUS': return 'text-purple-600'
      case 'REDEEM': return 'text-blue-600'
      case 'ADJUST': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your Mind Coins...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Coins className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">Error Loading Wallet</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button onClick={loadSummary} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your Mind Coins...</p>
        </div>
      </div>
    )
  }

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
            Mind Coins Wallet
          </h1>
          <p className="text-secondary-600">
            Earn Mind Coins for every self-care activity. Use them for subscription discounts and unlock rewards!
          </p>
        </motion.div>


        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card mb-8 relative overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="text-center relative z-10">
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -10, 10, 0],
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Coins className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-secondary-800 mb-2"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {(summary.balance || 0).toLocaleString()}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-secondary-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Mind Coins
            </motion.p>
            
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm font-bold">₹</span>
                </motion.div>
                <p className="text-green-700 font-medium text-lg">
                  Worth ₹{Math.floor((summary.balance || 0) / 10)} in subscription discounts
                </p>
              </div>
              <p className="text-green-600 text-sm">
                10 Mind Coins = ₹1 discount
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Earning Status */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="floating-card hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-800">Earning Status</h3>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6 text-primary-500" />
                </motion.div>
              </div>
              
              {(summary.canEarn !== false) ? (
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.4)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </motion.div>
                  </motion.div>
                  <motion.p 
                    className="text-green-600 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Ready to earn!
                  </motion.p>
                  <p className="text-sm text-secondary-600 mt-1">
                    Complete a breathing exercise to earn 10 Mind Coins
                  </p>
                  <motion.button
                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/breathing-exercises'}
                  >
                    Start Breathing Exercise
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-8 h-8 text-orange-600" />
                  </motion.div>
                  <p className="text-orange-600 font-medium">Cooldown Active</p>
                  <motion.p 
                    className="text-sm text-secondary-600 mt-1"
                    key={timeUntilNextEarn}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    Next earning available in {formatTime(timeUntilNextEarn)}
                  </motion.p>
                </div>
              )}
            </motion.div>

            {/* Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="floating-card hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-800">Current Streak</h3>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-6 h-6 text-primary-500" />
                </motion.div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-primary-600 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {summary.currentStreak || 0} days
                </motion.div>
                
                <div className="w-full bg-secondary-200 rounded-full h-3 mb-4 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((summary.currentStreak || 0) / 60) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-30"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-sm text-secondary-600"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {60 - (summary.currentStreak || 0)} more days to Diamond Badge
                </motion.p>
                
                {/* Streak fire animation */}
                <motion.div
                  className="mt-2 flex justify-center"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-2xl">🔥</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="floating-card hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-800">Session Stats</h3>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-6 h-6 text-primary-500" />
                </motion.div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-accent-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {summary.totalSessions || 0}
                </motion.div>
                <p className="text-sm text-secondary-600">
                  Total breathing sessions completed
                </p>
                
                {/* Achievement stars */}
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(Math.min(5, Math.floor((summary.totalSessions || 0) / 2)))].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-yellow-400 text-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="floating-card hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-800">Achievement Badges</h3>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-6 h-6 text-primary-500" />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'bronze', name: 'Bronze', days: 7, bonus: 20 },
                { type: 'silver', name: 'Silver', days: 14, bonus: 50 },
                { type: 'gold', name: 'Gold', days: 30, bonus: 100 },
                { type: 'diamond', name: 'Diamond', days: 60, bonus: 200 }
              ].map((badge, index) => {
                const isEarned = summary.badges && summary.badges[badge.type]
                return (
                  <motion.div
                    key={badge.type}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      isEarned
                        ? `bg-gradient-to-br ${getBadgeColor(badge.type)} text-white border-transparent shadow-lg`
                        : 'bg-white border-secondary-200 hover:border-primary-200 hover:shadow-md'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: isEarned ? [0, -5, 5, 0] : 0
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="flex justify-center mb-2"
                        animate={isEarned ? { 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {getBadgeIcon(badge.type)}
                      </motion.div>
                      <h4 className={`font-semibold ${isEarned ? 'text-white' : 'text-secondary-800'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-xs ${isEarned ? 'text-white/80' : 'text-secondary-600'}`}>
                        {badge.days} days
                      </p>
                      <p className={`text-xs ${isEarned ? 'text-white/80' : 'text-secondary-600'}`}>
                        +{badge.bonus} bonus coins
                      </p>
                      {isEarned && (
                        <motion.div 
                          className="mt-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <motion.span 
                            className="text-xs bg-white/20 px-2 py-1 rounded-full"
                            animate={{ 
                              boxShadow: [
                                "0 0 0 0 rgba(255, 255, 255, 0.4)",
                                "0 0 0 4px rgba(255, 255, 255, 0)",
                                "0 0 0 0 rgba(255, 255, 255, 0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ✓ Earned
                          </motion.span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="floating-card mt-8 hover:shadow-lg transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-800">Recent Transactions</h3>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <History className="w-6 h-6 text-primary-500" />
            </motion.div>
          </div>
          
          {(summary.recentTransactions || []).length === 0 ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <History className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-secondary-600">No transactions yet</p>
              <p className="text-sm text-secondary-500 mt-1">
                Complete breathing exercises to start earning Mind Coins
              </p>
              <motion.button
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/breathing-exercises'}
              >
                Start Earning Now
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {(summary.recentTransactions || []).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary-50 to-gray-50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {getTransactionIcon(transaction.type)}
                    </motion.div>
                    <div>
                      <p className="font-medium text-secondary-800">
                        {transaction.type === 'EARN' && 'Breathing Exercise'}
                        {transaction.type === 'BONUS' && 'Streak Bonus'}
                        {transaction.type === 'REDEEM' && 'Subscription Discount'}
                        {transaction.type === 'ADJUST' && 'Balance Adjustment'}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.p 
                      className={`font-semibold ${getTransactionColor(transaction.type)}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </motion.p>
                    <p className="text-sm text-secondary-600">
                      Balance: {transaction.balanceAfter}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Wallet
