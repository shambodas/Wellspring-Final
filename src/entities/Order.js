/**
 * Order Entity for subscription purchases
 * Includes Mind Coins redemption tracking
 */
export class Order {
  constructor(data = {}) {
    this.id = data.id || null
    this.uid = data.uid || null
    this.plan = data.plan || 'monthly' // 'monthly' | 'yearly'
    this.basePrice = data.basePrice || 0
    this.mindCoinsApplied = data.mindCoinsApplied || 0
    this.discountAmount = data.discountAmount || 0
    this.finalPrice = data.finalPrice || 0
    this.status = data.status || 'created' // 'created' | 'payment_pending' | 'paid' | 'failed' | 'cancelled'
    this.paymentMethod = data.paymentMethod || null
    this.paymentId = data.paymentId || null
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.paidAt = data.paidAt || null
    this.metadata = data.metadata || {}
  }

  /**
   * Calculate discount from Mind Coins
   * 10 Mind Coins = ₹1 discount
   */
  calculateDiscount(mindCoinsToApply) {
    return Math.floor(mindCoinsToApply / 10)
  }

  /**
   * Calculate final price after Mind Coins discount
   */
  calculateFinalPrice(mindCoinsToApply = this.mindCoinsApplied) {
    const discount = this.calculateDiscount(mindCoinsToApply)
    return Math.max(0, this.basePrice - discount)
  }

  /**
   * Apply Mind Coins to order
   */
  applyMindCoins(mindCoinsToApply) {
    this.mindCoinsApplied = mindCoinsToApply
    this.discountAmount = this.calculateDiscount(mindCoinsToApply)
    this.finalPrice = this.calculateFinalPrice(mindCoinsToApply)
  }

  /**
   * Update order status
   */
  updateStatus(status, metadata = {}) {
    this.status = status
    this.updatedAt = new Date()
    
    if (status === 'paid') {
      this.paidAt = new Date()
    }
    
    this.metadata = { ...this.metadata, ...metadata }
  }

  /**
   * Check if order is completed
   */
  isCompleted() {
    return this.status === 'paid'
  }

  /**
   * Check if order is pending
   */
  isPending() {
    return ['created', 'payment_pending'].includes(this.status)
  }

  /**
   * Check if order is failed
   */
  isFailed() {
    return ['failed', 'cancelled'].includes(this.status)
  }

  /**
   * Convert to Firestore document
   */
  toFirestore() {
    return {
      uid: this.uid,
      plan: this.plan,
      basePrice: this.basePrice,
      mindCoinsApplied: this.mindCoinsApplied,
      discountAmount: this.discountAmount,
      finalPrice: this.finalPrice,
      status: this.status,
      paymentMethod: this.paymentMethod,
      paymentId: this.paymentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      paidAt: this.paidAt,
      metadata: this.metadata
    }
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    const data = doc.data()
    return new Order({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      paidAt: data.paidAt?.toDate() || null
    })
  }
}

/**
 * Order statuses
 */
export const ORDER_STATUS = {
  CREATED: 'created',
  PAYMENT_PENDING: 'payment_pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

/**
 * Subscription plans
 */
export const SUBSCRIPTION_PLANS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}
