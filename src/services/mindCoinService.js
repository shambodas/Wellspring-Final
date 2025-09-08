import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'

/**
 * Mind Coin Service
 * Handles all Mind Coin related API calls to Cloud Functions
 */

// Cloud Function references - with error handling for development
let awardMindCoinsFn, redeemMindCoinsFn, getMindCoinSummaryFn

try {
  awardMindCoinsFn = httpsCallable(functions, 'awardMindCoins')
  redeemMindCoinsFn = httpsCallable(functions, 'redeemMindCoins')
  getMindCoinSummaryFn = httpsCallable(functions, 'getMindCoinSummary')
} catch (error) {
  console.warn('Firebase Functions not available:', error)
  // Create mock functions for development
  awardMindCoinsFn = null
  redeemMindCoinsFn = null
  getMindCoinSummaryFn = null
}

/**
 * Award Mind Coins for completing a breathing exercise
 * @param {string} sessionId - Unique session identifier
 * @param {number} duration - Session duration in seconds
 * @returns {Promise<Object>} Award result
 */
export const awardMindCoins = async (sessionId, duration) => {
  // Always return mock response for development
  console.log('Development mode: Mocking Mind Coins award')
  return {
    success: true,
    coinsEarned: 10,
    bonusCoins: 0,
    newBalance: 10,
    streakDays: 1
  }
}

/**
 * Redeem Mind Coins for subscription discount
 * @param {string} orderId - Order identifier
 * @param {number} mindCoinsToRedeem - Number of coins to redeem
 * @returns {Promise<Object>} Redemption result
 */
export const redeemMindCoins = async (orderId, mindCoinsToRedeem) => {
  // Always return mock response for development
  console.log('Development mode: Mocking Mind Coins redemption')
  return {
    success: true,
    coinsRedeemed: mindCoinsToRedeem,
    discountAmount: Math.floor(mindCoinsToRedeem / 10)
  }
}

/**
 * Get Mind Coin summary for current user
 * @returns {Promise<Object>} User's Mind Coin summary
 */
export const getMindCoinSummary = async () => {
  console.log('getMindCoinSummary called, getMindCoinSummaryFn:', getMindCoinSummaryFn)
  
  // For now, always return mock data to ensure the page works
  console.log('Development mode: Returning mock Mind Coin summary')
  return {
    balance: 50,
    totalSessions: 5,
    currentStreak: 3,
    badges: {
      bronze: false,
      silver: false,
      gold: false,
      diamond: false
    },
    canEarn: true,
    timeUntilNextEarn: 0,
    recentTransactions: [
      {
        id: 'mock1',
        type: 'EARN',
        amount: 10,
        balanceAfter: 50,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ]
  }

  // TODO: Uncomment when Firebase is properly configured
  /*
  if (!getMindCoinSummaryFn) {
    console.log('Development mode: Mocking Mind Coin summary')
    return {
      balance: 50,
      totalSessions: 5,
      currentStreak: 3,
      badges: {
        bronze: false,
        silver: false,
        gold: false,
        diamond: false
      },
      canEarn: true,
      timeUntilNextEarn: 0,
      recentTransactions: [
        {
          id: 'mock1',
          type: 'EARN',
          amount: 10,
          balanceAfter: 50,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  }

  try {
    const result = await getMindCoinSummaryFn()
    return result.data
  } catch (error) {
    console.error('Error getting mind coin summary:', error)
    throw new Error(error.message || 'Failed to get mind coin summary')
  }
  */
}

/**
 * Utility function to calculate discount from Mind Coins
 * @param {number} mindCoins - Number of Mind Coins
 * @returns {number} Discount amount in rupees
 */
export const calculateDiscount = (mindCoins) => {
  return Math.floor(mindCoins / 10)
}

/**
 * Utility function to calculate Mind Coins needed for discount
 * @param {number} discountAmount - Discount amount in rupees
 * @returns {number} Mind Coins needed
 */
export const calculateMindCoinsNeeded = (discountAmount) => {
  return discountAmount * 10
}

/**
 * Utility function to format Mind Coins display
 * @param {number} mindCoins - Number of Mind Coins
 * @returns {string} Formatted string
 */
export const formatMindCoins = (mindCoins) => {
  return mindCoins.toLocaleString()
}

/**
 * Utility function to format discount display
 * @param {number} discountAmount - Discount amount in rupees
 * @returns {string} Formatted string
 */
export const formatDiscount = (discountAmount) => {
  return `₹${discountAmount.toLocaleString()}`
}
