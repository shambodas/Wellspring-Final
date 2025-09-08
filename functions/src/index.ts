import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// Constants
const MIND_COINS_PER_BREATHING_SESSION = 10
const MIND_COINS_TO_RUPEE_RATIO = 10 // 10 Mind Coins = ₹1
const COOLDOWN_HOURS = 1
const EXPIRY_DAYS = 90

// Badge milestones
const BADGE_MILESTONES = {
  bronze: 7,
  silver: 14,
  gold: 30,
  diamond: 60
}

// Badge bonus coins
const BADGE_BONUS_COINS = {
  bronze: 20,
  silver: 50,
  gold: 100,
  diamond: 200
}

/**
 * Award Mind Coins for completing breathing exercises
 */
export const awardMindCoins = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const uid = context.auth.uid
  const { sessionId, duration } = data

  // Validate input
  if (!sessionId || !duration || duration < 60) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid session data')
  }

  try {
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found')
    }

    const userData = userDoc.data()
    const now = admin.firestore.Timestamp.now()

    // Check cooldown
    if (userData.lastEarnAt) {
      const lastEarnTime = userData.lastEarnAt.toDate()
      const cooldownEnd = new Date(lastEarnTime.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000)
      
      if (now.toDate() < cooldownEnd) {
        const timeRemaining = Math.ceil((cooldownEnd.getTime() - now.toDate().getTime()) / 1000)
        throw new functions.https.HttpsError('failed-precondition', `Cooldown active. Try again in ${timeRemaining} seconds`)
      }
    }

    // Start transaction
    await db.runTransaction(async (transaction) => {
      // Update user profile
      const newBalance = (userData.mindCoins || 0) + MIND_COINS_PER_BREATHING_SESSION
      const newTotalSessions = (userData.totalBreathingSessions || 0) + 1

      // Update streak
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastStreakDate = userData.lastStreakDate ? userData.lastStreakDate.toDate() : null
      lastStreakDate?.setHours(0, 0, 0, 0)
      
      let newStreakDays = userData.currentStreakDays || 0
      let newLastStreakDate = today
      
      if (!lastStreakDate) {
        newStreakDays = 1
      } else {
        const daysDiff = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          newStreakDays += 1
        } else if (daysDiff > 1) {
          newStreakDays = 1
        }
      }

      // Check for badge milestones
      const badges = { ...userData.badges } || {}
      let bonusCoins = 0
      let bonusTransactions = []

      for (const [badgeType, milestone] of Object.entries(BADGE_MILESTONES)) {
        if (newStreakDays >= milestone && !badges[badgeType]) {
          badges[badgeType] = true
          bonusCoins += BADGE_BONUS_COINS[badgeType]
          
          // Create bonus transaction
          const bonusTxRef = db.collection('users').doc(uid).collection('mindCoinTransactions').doc()
          const bonusTx = {
            type: 'BONUS',
            amount: BADGE_BONUS_COINS[badgeType],
            balanceAfter: newBalance + bonusCoins,
            createdAt: now,
            expiresAt: admin.firestore.Timestamp.fromDate(new Date(now.toDate().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000)),
            metadata: {
              source: 'streak',
              badgeType,
              milestone
            }
          }
          transaction.set(bonusTxRef, bonusTx)
          bonusTransactions.push(bonusTx)
        }
      }

      const finalBalance = newBalance + bonusCoins

      // Update user document
      transaction.update(userRef, {
        mindCoins: finalBalance,
        totalBreathingSessions: newTotalSessions,
        lastEarnAt: now,
        currentStreakDays: newStreakDays,
        lastStreakDate: admin.firestore.Timestamp.fromDate(today),
        badges,
        updatedAt: now
      })

      // Create main earning transaction
      const txRef = db.collection('users').doc(uid).collection('mindCoinTransactions').doc()
      const transactionData = {
        type: 'EARN',
        amount: MIND_COINS_PER_BREATHING_SESSION,
        balanceAfter: newBalance,
        createdAt: now,
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(now.toDate().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000)),
        metadata: {
          source: 'breathing',
          sessionId,
          duration
        }
      }
      transaction.set(txRef, transactionData)
    })

    return {
      success: true,
      coinsEarned: MIND_COINS_PER_BREATHING_SESSION,
      bonusCoins,
      newBalance: (userData.mindCoins || 0) + MIND_COINS_PER_BREATHING_SESSION + bonusCoins,
      streakDays: newStreakDays
    }

  } catch (error) {
    console.error('Error awarding mind coins:', error)
    throw new functions.https.HttpsError('internal', 'Failed to award mind coins')
  }
})

/**
 * Redeem Mind Coins for subscription discount
 */
export const redeemMindCoins = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const uid = context.auth.uid
  const { orderId, mindCoinsToRedeem } = data

  if (!orderId || !mindCoinsToRedeem || mindCoinsToRedeem <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid redemption data')
  }

  try {
    const userRef = db.collection('users').doc(uid)
    const orderRef = db.collection('orders').doc(orderId)

    await db.runTransaction(async (transaction) => {
      // Get user data
      const userDoc = await transaction.get(userRef)
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found')
      }

      const userData = userDoc.data()
      const currentBalance = userData.mindCoins || 0

      if (currentBalance < mindCoinsToRedeem) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient Mind Coins balance')
      }

      // Get order data
      const orderDoc = await transaction.get(orderRef)
      if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found')
      }

      const orderData = orderDoc.data()
      
      // Check if order is in valid state for redemption
      if (!['created', 'payment_pending'].includes(orderData.status)) {
        throw new functions.https.HttpsError('failed-precondition', 'Order cannot be modified')
      }

      // Calculate discount
      const discountAmount = Math.floor(mindCoinsToRedeem / MIND_COINS_TO_RUPEE_RATIO)
      const finalPrice = Math.max(0, orderData.basePrice - discountAmount)

      // Update order
      transaction.update(orderRef, {
        mindCoinsApplied: mindCoinsToRedeem,
        discountAmount,
        finalPrice,
        updatedAt: admin.firestore.Timestamp.now()
      })

      // Update user balance
      const newBalance = currentBalance - mindCoinsToRedeem
      transaction.update(userRef, {
        mindCoins: newBalance,
        updatedAt: admin.firestore.Timestamp.now()
      })

      // Create redemption transaction
      const txRef = db.collection('users').doc(uid).collection('mindCoinTransactions').doc()
      transaction.set(txRef, {
        type: 'REDEEM',
        amount: -mindCoinsToRedeem,
        balanceAfter: newBalance,
        createdAt: admin.firestore.Timestamp.now(),
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000)),
        metadata: {
          source: 'redeem',
          orderId,
          discountAmount
        }
      })
    })

    return {
      success: true,
      coinsRedeemed: mindCoinsToRedeem,
      discountAmount: Math.floor(mindCoinsToRedeem / MIND_COINS_TO_RUPEE_RATIO)
    }

  } catch (error) {
    console.error('Error redeeming mind coins:', error)
    throw new functions.https.HttpsError('internal', 'Failed to redeem mind coins')
  }
})

/**
 * Get Mind Coin summary for user
 */
export const getMindCoinSummary = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const uid = context.auth.uid

  try {
    const userDoc = await db.collection('users').doc(uid).get()
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found')
    }

    const userData = userDoc.data()
    const now = new Date()

    // Calculate time until next earning
    let timeUntilNextEarn = 0
    if (userData.lastEarnAt) {
      const lastEarnTime = userData.lastEarnAt.toDate()
      const cooldownEnd = new Date(lastEarnTime.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000)
      timeUntilNextEarn = Math.max(0, cooldownEnd.getTime() - now.getTime())
    }

    // Get recent transactions
    const transactionsSnapshot = await db
      .collection('users').doc(uid)
      .collection('mindCoinTransactions')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()

    const recentTransactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      expiresAt: doc.data().expiresAt.toDate()
    }))

    return {
      balance: userData.mindCoins || 0,
      totalSessions: userData.totalBreathingSessions || 0,
      currentStreak: userData.currentStreakDays || 0,
      badges: userData.badges || {},
      canEarn: timeUntilNextEarn === 0,
      timeUntilNextEarn,
      recentTransactions
    }

  } catch (error) {
    console.error('Error getting mind coin summary:', error)
    throw new functions.https.HttpsError('internal', 'Failed to get mind coin summary')
  }
})

/**
 * Scheduled function to expire Mind Coins
 * Runs daily at midnight
 */
export const expireMindCoins = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
  console.log('Starting Mind Coins expiration process...')

  try {
    const now = admin.firestore.Timestamp.now()
    const expiredBefore = admin.firestore.Timestamp.fromDate(new Date(now.toDate().getTime() - EXPIRY_DAYS * 24 * 60 * 60 * 1000))

    // Get all users
    const usersSnapshot = await db.collection('users').get()
    
    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id
      
      // Get expired transactions
      const expiredTxsSnapshot = await db
        .collection('users').doc(uid)
        .collection('mindCoinTransactions')
        .where('expiresAt', '<', now)
        .where('type', 'in', ['EARN', 'BONUS'])
        .get()

      if (expiredTxsSnapshot.empty) continue

      let totalExpired = 0
      const expiredTxIds = []

      // Calculate total expired coins
      for (const txDoc of expiredTxsSnapshot.docs) {
        const txData = txDoc.data()
        if (txData.amount > 0) {
          totalExpired += txData.amount
          expiredTxIds.push(txDoc.id)
        }
      }

      if (totalExpired > 0) {
        await db.runTransaction(async (transaction) => {
          // Update user balance
          const userRef = db.collection('users').doc(uid)
          const userDoc = await transaction.get(userRef)
          
          if (userDoc.exists) {
            const userData = userDoc.data()
            const newBalance = Math.max(0, (userData.mindCoins || 0) - totalExpired)
            
            transaction.update(userRef, {
              mindCoins: newBalance,
              updatedAt: now
            })

            // Create adjustment transaction
            const adjustTxRef = db.collection('users').doc(uid).collection('mindCoinTransactions').doc()
            transaction.set(adjustTxRef, {
              type: 'ADJUST',
              amount: -totalExpired,
              balanceAfter: newBalance,
              createdAt: now,
              expiresAt: admin.firestore.Timestamp.fromDate(new Date(now.toDate().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000)),
              metadata: {
                source: 'expiry',
                expiredTransactionIds: expiredTxIds,
                reason: 'Mind Coins expired after 90 days'
              }
            })
          }
        })

        console.log(`Expired ${totalExpired} Mind Coins for user ${uid}`)
      }
    }

    console.log('Mind Coins expiration process completed')
    return null

  } catch (error) {
    console.error('Error in expireMindCoins:', error)
    throw error
  }
})
