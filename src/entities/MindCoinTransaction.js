/**
 * Mind Coin Transaction Entity
 * Represents a transaction in the Mind Coins system
 */
export class MindCoinTransaction {
  constructor(data = {}) {
    this.id = data.id || null
    this.type = data.type || 'EARN' // 'EARN' | 'REDEEM' | 'BONUS' | 'ADJUST'
    this.amount = data.amount || 0
    this.balanceAfter = data.balanceAfter || 0
    this.createdAt = data.createdAt || new Date()
    this.expiresAt = data.expiresAt || this.getExpiryDate()
    this.metadata = data.metadata || {}
  }

  /**
   * Get expiry date (90 days from creation)
   */
  getExpiryDate() {
    const expiryDate = new Date(this.createdAt)
    expiryDate.setDate(expiryDate.getDate() + 90)
    return expiryDate
  }

  /**
   * Check if transaction is expired
   */
  isExpired() {
    return new Date() > this.expiresAt
  }

  /**
   * Convert to Firestore document
   */
  toFirestore() {
    return {
      type: this.type,
      amount: this.amount,
      balanceAfter: this.balanceAfter,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      metadata: this.metadata
    }
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    const data = doc.data()
    return new MindCoinTransaction({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      expiresAt: data.expiresAt?.toDate() || new Date()
    })
  }
}

/**
 * Transaction types
 */
export const TRANSACTION_TYPES = {
  EARN: 'EARN',
  REDEEM: 'REDEEM',
  BONUS: 'BONUS',
  ADJUST: 'ADJUST'
}

/**
 * Transaction sources
 */
export const TRANSACTION_SOURCES = {
  BREATHING: 'breathing',
  STREAK: 'streak',
  REDEEM: 'redeem'
}
