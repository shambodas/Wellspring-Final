import React from 'react'
import { motion } from 'framer-motion'
import { Award, Star, Crown, Gem, Trophy } from 'lucide-react'

const BadgeDisplay = ({ badges, size = 'medium', showLabels = true, className = '' }) => {
  const badgeConfig = [
    {
      type: 'bronze',
      name: 'Bronze',
      icon: Award,
      color: 'from-amber-400 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      type: 'silver',
      name: 'Silver',
      icon: Star,
      color: 'from-gray-300 to-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      type: 'gold',
      name: 'Gold',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      type: 'diamond',
      name: 'Diamond',
      icon: Gem,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ]

  const sizeClasses = {
    small: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-xs'
    },
    medium: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-sm'
    },
    large: {
      container: 'w-20 h-20',
      icon: 'w-10 h-10',
      text: 'text-base'
    }
  }

  const earnedBadges = badgeConfig.filter(badge => badges[badge.type])
  const unearnedBadges = badgeConfig.filter(badge => !badges[badge.type])

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* Earned Badges */}
      {earnedBadges.map((badge, index) => {
        const IconComponent = badge.icon
        return (
          <motion.div
            key={badge.type}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className={`${sizeClasses[size].container} rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg relative group`}
          >
            <IconComponent className={`${sizeClasses[size].icon} text-white`} />
            
            {/* Shine effect for earned badges */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Tooltip */}
            {showLabels && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {badge.name} Badge
              </div>
            )}
          </motion.div>
        )
      })}

      {/* Unearned Badges */}
      {unearnedBadges.map((badge, index) => {
        const IconComponent = badge.icon
        return (
          <motion.div
            key={badge.type}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.3 }}
            className={`${sizeClasses[size].container} rounded-full ${badge.bgColor} border-2 ${badge.borderColor} flex items-center justify-center relative group`}
          >
            <IconComponent className={`${sizeClasses[size].icon} ${badge.textColor} opacity-50`} />
            
            {/* Tooltip */}
            {showLabels && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {badge.name} Badge (Locked)
              </div>
            )}
          </motion.div>
        )
      })}

      {/* Empty state */}
      {earnedBadges.length === 0 && (
        <div className="flex items-center space-x-2 text-secondary-500">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">No badges earned yet</span>
        </div>
      )}
    </div>
  )
}

export default BadgeDisplay
