/**
 * User Profile Entity with Mind Coins data
 * Extends user profile to include Mind Coins system data
 */
export class UserProfile {
  constructor(data = {}) {
    this.uid = data.uid || null
    this.email = data.email || ''
    this.displayName = data.displayName || ''
    this.photoURL = data.photoURL || ''
    
    // Mind Coins system data
    this.mindCoins = data.mindCoins || 0
    this.totalBreathingSessions = data.totalBreathingSessions || 0
    this.lastEarnAt = data.lastEarnAt || null
    this.currentStreakDays = data.currentStreakDays || 0
    this.lastStreakDate = data.lastStreakDate || null
    this.badges = data.badges || {
      bronze: false,
      silver: false,
      gold: false,
      diamond: false
    }
    
    // Additional profile data
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  /**
   * Check if user can earn Mind Coins (1-hour cooldown)
   */
  canEarnMindCoins() {
    if (!this.lastEarnAt) return true
    
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)
    
    return this.lastEarnAt < oneHourAgo
  }

  /**
   * Get time until next Mind Coin earning is available
   */
  getTimeUntilNextEarn() {
    if (!this.lastEarnAt) return 0
    
    const oneHourFromLastEarn = new Date(this.lastEarnAt)
    oneHourFromLastEarn.setHours(oneHourFromLastEarn.getHours() + 1)
    
    const now = new Date()
    const diff = oneHourFromLastEarn - now
    
    return Math.max(0, diff)
  }

  /**
   * Update streak based on activity
   */
  updateStreak() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastStreakDate = this.lastStreakDate ? new Date(this.lastStreakDate) : null
    lastStreakDate?.setHours(0, 0, 0, 0)
    
    if (!lastStreakDate) {
      // First streak
      this.currentStreakDays = 1
      this.lastStreakDate = today
    } else {
      const daysDiff = Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day
        this.currentStreakDays += 1
        this.lastStreakDate = today
      } else if (daysDiff === 0) {
        // Same day, no change
        return
      } else {
        // Streak broken
        this.currentStreakDays = 1
        this.lastStreakDate = today
      }
    }
  }

  /**
   * Check if user has earned a specific badge
   */
  hasBadge(badgeType) {
    return this.badges[badgeType] || false
  }

  /**
   * Award a badge
   */
  awardBadge(badgeType) {
    this.badges[badgeType] = true
  }

  /**
   * Get badge progress
   */
  getBadgeProgress() {
    const milestones = {
      bronze: 7,
      silver: 14,
      gold: 30,
      diamond: 60
    }
    
    const progress = {}
    for (const [badge, days] of Object.entries(milestones)) {
      progress[badge] = {
        earned: this.hasBadge(badge),
        daysRequired: days,
        currentDays: this.currentStreakDays,
        progress: Math.min(100, (this.currentStreakDays / days) * 100)
      }
    }
    
    return progress
  }

  /**
   * Convert to Firestore document
   */
  toFirestore() {
    return {
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      mindCoins: this.mindCoins,
      totalBreathingSessions: this.totalBreathingSessions,
      lastEarnAt: this.lastEarnAt,
      currentStreakDays: this.currentStreakDays,
      lastStreakDate: this.lastStreakDate,
      badges: this.badges,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    const data = doc.data()
    return new UserProfile({
      uid: doc.id,
      ...data,
      lastEarnAt: data.lastEarnAt?.toDate() || null,
      lastStreakDate: data.lastStreakDate?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    })
  }
}

/**
 * Badge types
 */
export const BADGE_TYPES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  DIAMOND: 'diamond'
}

/**
 * Badge milestones
 */
export const BADGE_MILESTONES = {
  [BADGE_TYPES.BRONZE]: 7,
  [BADGE_TYPES.SILVER]: 14,
  [BADGE_TYPES.GOLD]: 30,
  [BADGE_TYPES.DIAMOND]: 60
}
