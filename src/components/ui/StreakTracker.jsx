import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Flame, Trophy } from 'lucide-react'

const StreakTracker = ({ currentStreak, badges, className = '' }) => {
  const milestones = [
    { days: 7, badge: 'bronze', name: 'Bronze', color: 'from-amber-400 to-amber-600' },
    { days: 14, badge: 'silver', name: 'Silver', color: 'from-gray-300 to-gray-500' },
    { days: 30, badge: 'gold', name: 'Gold', color: 'from-yellow-400 to-yellow-600' },
    { days: 60, badge: 'diamond', name: 'Diamond', color: 'from-blue-400 to-blue-600' }
  ]

  const nextMilestone = milestones.find(m => m.days > currentStreak) || milestones[milestones.length - 1]
  const progress = Math.min(100, (currentStreak / nextMilestone.days) * 100)

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-secondary-800">Streak Progress</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{currentStreak}</div>
          <div className="text-sm text-secondary-600">days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-secondary-600 mb-2">
          <span>Current Streak</span>
          <span>{nextMilestone.name} Badge ({nextMilestone.days} days)</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full"
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-secondary-600">
            {nextMilestone.days - currentStreak} more days to {nextMilestone.name} Badge
          </span>
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-2 gap-3">
        {milestones.map((milestone) => {
          const isEarned = badges[milestone.badge] || false
          const isCurrent = milestone.days === nextMilestone.days
          
          return (
            <div
              key={milestone.badge}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isEarned
                  ? `bg-gradient-to-br ${milestone.color} text-white border-transparent`
                  : isCurrent
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-secondary-50 border-secondary-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold text-sm ${isEarned ? 'text-white' : 'text-secondary-800'}`}>
                    {milestone.name}
                  </div>
                  <div className={`text-xs ${isEarned ? 'text-white/80' : 'text-secondary-600'}`}>
                    {milestone.days} days
                  </div>
                </div>
                <div>
                  {isEarned ? (
                    <Trophy className="w-5 h-5 text-white" />
                  ) : (
                    <Calendar className={`w-5 h-5 ${isCurrent ? 'text-primary-500' : 'text-secondary-400'}`} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StreakTracker
