import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Wind, Coins, Gift } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { awardMindCoins } from '../services/mindCoinService'

const BreathingExercises = () => {
  const { t } = useLanguage()
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('prepare') // prepare, inhale, hold, exhale, pause
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [settings, setSettings] = useState({
    soundEnabled: true,
    guidedVoice: true,
    backgroundMusic: true,
    hapticFeedback: true
  })
  const [showSettings, setShowSettings] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [rewardData, setRewardData] = useState(null)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  const exercises = [
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'A powerful technique to reduce anxiety and promote sleep',
      duration: '2-5 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
      color: 'from-blue-400 to-cyan-500',
      phases: {
        inhale: 4,
        hold: 7,
        exhale: 8,
        pause: 0
      },
      instructions: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4-8 cycles.',
      icon: '🌊'
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Used by Navy SEALs to maintain calm under pressure',
      duration: '3-10 minutes',
      difficulty: 'Beginner',
      benefits: ['Increases focus', 'Reduces stress', 'Improves performance'],
      color: 'from-green-400 to-teal-500',
      phases: {
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4
      },
      instructions: 'Inhale for 4, hold for 4, exhale for 4, pause for 4. Equal timing for all phases.',
      icon: '📦'
    },
    {
      id: 'triangle',
      name: 'Triangle Breathing',
      description: 'Simple three-part breathing for quick stress relief',
      duration: '1-3 minutes',
      difficulty: 'Beginner',
      benefits: ['Quick stress relief', 'Easy to remember', 'Portable technique'],
      color: 'from-purple-400 to-indigo-500',
      phases: {
        inhale: 3,
        hold: 3,
        exhale: 3,
        pause: 0
      },
      instructions: 'Inhale for 3, hold for 3, exhale for 3. Simple and effective.',
      icon: '🔺'
    },
    {
      id: 'wim-hof',
      name: 'Wim Hof Method',
      description: 'Energizing breath work to boost immunity and energy',
      duration: '3-15 minutes',
      difficulty: 'Advanced',
      benefits: ['Increases energy', 'Boosts immunity', 'Improves cold tolerance'],
      color: 'from-red-400 to-orange-500',
      phases: {
        inhale: 2,
        hold: 0,
        exhale: 1,
        pause: 0
      },
      instructions: '30 deep breaths, then hold after exhale. Repeat 3-4 rounds.',
      icon: '❄️'
    },
    {
      id: 'coherent',
      name: 'Coherent Breathing',
      description: 'Heart rate variability optimization for balance',
      duration: '5-20 minutes',
      difficulty: 'Intermediate',
      benefits: ['Balances nervous system', 'Improves HRV', 'Reduces blood pressure'],
      color: 'from-pink-400 to-rose-500',
      phases: {
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0
      },
      instructions: 'Breathe in for 5 seconds, out for 5 seconds. Maintain steady rhythm.',
      icon: '💓'
    },
    {
      id: 'alternate',
      name: 'Alternate Nostril',
      description: 'Ancient pranayama technique for mental clarity',
      duration: '3-10 minutes',
      difficulty: 'Intermediate',
      benefits: ['Balances brain hemispheres', 'Improves focus', 'Calms mind'],
      color: 'from-indigo-400 to-purple-500',
      phases: {
        inhale: 4,
        hold: 0,
        exhale: 4,
        pause: 1
      },
      instructions: 'Alternate breathing through each nostril. Use thumb and ring finger.',
      icon: '🧘'
    }
  ]

  const currentExercise = exercises.find(ex => ex.id === selectedExercise)

  useEffect(() => {
    if (isActive && currentExercise) {
      const phases = ['inhale', 'hold', 'exhale', 'pause']
      let phaseIndex = phases.indexOf(currentPhase)
      let currentTime = currentExercise.phases[currentPhase]

      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase
            phaseIndex = (phaseIndex + 1) % phases.length
            const nextPhase = phases[phaseIndex]
            setCurrentPhase(nextPhase)

            // If we completed a full cycle (back to inhale)
            if (nextPhase === 'inhale' && phaseIndex === 0) {
              setCycleCount(prev => prev + 1)
            }

            // Skip phases with 0 duration
            let nextTime = currentExercise.phases[nextPhase]
            while (nextTime === 0 && phaseIndex < phases.length - 1) {
              phaseIndex = (phaseIndex + 1) % phases.length
              const skippedPhase = phases[phaseIndex]
              setCurrentPhase(skippedPhase)
              nextTime = currentExercise.phases[skippedPhase]
            }

            return nextTime
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, currentPhase, currentExercise])

  const startExercise = (exercise) => {
    setSelectedExercise(exercise.id)
    setCurrentPhase('prepare')
    setTimeRemaining(3) // 3 second preparation
    setCycleCount(0)
    setIsActive(false)
    
    // Generate session ID and start time
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())
    
    // Start preparation countdown
    setTimeout(() => {
      setCurrentPhase('inhale')
      setTimeRemaining(exercise.phases.inhale)
      setIsActive(true)
    }, 3000)
  }

  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false)
    } else if (selectedExercise) {
      setIsActive(true)
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentPhase('prepare')
    setCycleCount(0)
    setTimeRemaining(0)
    setSelectedExercise(null)
    setSessionId(null)
    setSessionStartTime(null)
  }

  const handleSessionComplete = async () => {
    if (!sessionId || !sessionStartTime) return

    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
    
    // Only award coins if session was at least 1 minute
    if (sessionDuration >= 60) {
      try {
        const result = await awardMindCoins(sessionId, sessionDuration)
        setRewardData(result)
        setShowRewardModal(true)
      } catch (error) {
        console.error('Error awarding mind coins:', error)
        // Show error message but don't block the user
      }
    }
  }

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'prepare': return t('breathing.getReady')
      case 'inhale': return t('breathing.inhale')
      case 'hold': return t('breathing.hold')
      case 'exhale': return t('breathing.exhale')
      case 'pause': return t('breathing.pause')
      default: return t('breathing.breathe')
    }
  }

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 1.2
      case 'hold': return 1.2
      case 'exhale': return 1.0
      case 'pause': return 1.0
      default: return 1.0
    }
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
            {t('breathing.title')}
          </h1>
          <p className="text-secondary-600">
            {t('breathing.subtitle')}
          </p>
        </motion.div>

        {!selectedExercise ? (
          <>
            {/* Exercise Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="floating-card hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">{exercise.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-800 mb-2">{exercise.name}</h3>
                    <p className="text-secondary-600 text-sm mb-3">{exercise.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Duration:</span>
                      <span className="font-medium">{exercise.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Difficulty:</span>
                      <span className={`font-medium ${
                        exercise.difficulty === 'Beginner' ? 'text-green-600' :
                        exercise.difficulty === 'Intermediate' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{exercise.difficulty}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary-800 mb-2 text-sm">Benefits:</h4>
                    <div className="space-y-1">
                      {exercise.benefits.map((benefit, idx) => (
                        <div key={idx} className="text-xs text-secondary-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startExercise(exercise)}
                    className="w-full btn-primary"
                  >
                    {t('breathing.start')}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="floating-card text-center mb-12"
            >
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Why Breathing Exercises Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Wind className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Activates Parasympathetic Nervous System</h3>
                  <p className="text-sm text-secondary-600">
                    Controlled breathing triggers the body's relaxation response, reducing stress hormones
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Improves Brain Function</h3>
                  <p className="text-sm text-secondary-600">
                    Better oxygenation enhances cognitive performance, focus, and emotional regulation
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💓</span>
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Regulates Heart Rate</h3>
                  <p className="text-sm text-secondary-600">
                    Rhythmic breathing synchronizes heart rate variability, promoting cardiovascular health
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Exercise Session */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Exercise Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-2">{currentExercise.name}</h2>
              <p className="text-secondary-600">{currentExercise.instructions}</p>
            </div>

            {/* Breathing Circle */}
            <div className="relative flex items-center justify-center mb-8">
              <motion.div
                animate={{ 
                  scale: getCircleScale(),
                  opacity: currentPhase === 'prepare' ? 0.5 : 1
                }}
                transition={{ 
                  duration: currentExercise ? currentExercise.phases[currentPhase] || 1 : 1,
                  ease: "easeInOut"
                }}
                className={`w-80 h-80 rounded-full bg-gradient-to-br ${currentExercise.color} flex items-center justify-center shadow-2xl`}
              >
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-2">{timeRemaining}</div>
                  <div className="text-2xl font-medium">{getPhaseInstruction()}</div>
                  {currentPhase !== 'prepare' && (
                    <div className="text-lg opacity-80 mt-2">Cycle {cycleCount + 1}</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={toggleExercise}
                className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={currentPhase === 'prepare'}
              >
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button
                onClick={resetExercise}
                className="p-4 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-4 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Settings className="w-8 h-8" />
              </button>
            </div>

            {/* Complete Session Button */}
            {cycleCount > 0 && (
              <div className="text-center mb-8">
                <button
                  onClick={handleSessionComplete}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Coins className="w-5 h-5" />
                  <span>Complete Session & Earn Mind Coins</span>
                </button>
                <p className="text-sm text-secondary-600 mt-2">
                  Complete at least 1 minute to earn 10 Mind Coins
                </p>
              </div>
            )}

            {/* Progress */}
            <div className="floating-card text-center">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{cycleCount}</div>
                  <div className="text-sm text-secondary-600">Cycles Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-600">{Math.floor(cycleCount * (currentExercise.phases.inhale + currentExercise.phases.hold + currentExercise.phases.exhale + currentExercise.phases.pause) / 60)}</div>
                  <div className="text-sm text-secondary-600">Minutes Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-600">{currentExercise.difficulty}</div>
                  <div className="text-sm text-secondary-600">Difficulty</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-sm w-full"
              >
                <h3 className="text-xl font-semibold text-secondary-800 mb-4">Exercise Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: 'soundEnabled', label: 'Sound Effects', icon: Volume2 },
                    { key: 'guidedVoice', label: 'Guided Voice', icon: Volume2 },
                    { key: 'backgroundMusic', label: 'Background Music', icon: Volume2 },
                    { key: 'hapticFeedback', label: 'Haptic Feedback', icon: Volume2 }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-secondary-600" />
                        <span className="font-medium text-secondary-800">{label}</span>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          settings[key] ? 'bg-primary-500' : 'bg-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          settings[key] ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 btn-primary"
                >
                  Save Settings
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward Modal */}
        <AnimatePresence>
          {showRewardModal && rewardData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowRewardModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Coins className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-secondary-800 mb-2">
                  🎉 Great Job!
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      +{rewardData.coinsEarned} Mind Coins
                    </div>
                    <p className="text-green-700 text-sm">
                      Earned for completing breathing exercise
                    </p>
                  </div>
                  
                  {rewardData.bonusCoins > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-bold text-purple-600">
                          +{rewardData.bonusCoins} Bonus Coins
                        </span>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Streak milestone bonus!
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-primary-600 mb-1">
                      New Balance: {rewardData.newBalance.toLocaleString()}
                    </div>
                    <p className="text-primary-700 text-sm">
                      Worth ₹{Math.floor(rewardData.newBalance / 10)} in discounts
                    </p>
                  </div>
                  
                  {rewardData.streakDays > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-lg font-semibold text-orange-600 mb-1">
                        Current Streak: {rewardData.streakDays} days
                      </div>
                      <p className="text-orange-700 text-sm">
                        Keep it up for more rewards!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowRewardModal(false)}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => {
                      setShowRewardModal(false)
                      // Navigate to wallet
                      window.location.href = '/wallet'
                    }}
                    className="w-full border border-primary-200 text-primary-600 py-3 px-6 rounded-xl font-medium hover:bg-primary-50 transition-all duration-200"
                  >
                    View Wallet
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BreathingExercises