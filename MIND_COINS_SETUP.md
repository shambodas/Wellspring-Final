# Mind Coins System Setup Guide

This guide will help you set up the Mind Coins gamified reward system for Wellspring.

## 🎯 Overview

The Mind Coins system allows users to:
- Earn 10 Mind Coins for completing breathing exercises (1-hour cooldown)
- Use Mind Coins for subscription discounts (10 coins = ₹1)
- Earn streak bonuses and achievement badges
- Track their progress and transaction history

## 🚀 Quick Setup

### 1. Firebase Configuration

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Enable Cloud Functions
5. Copy your Firebase config and update `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

### 2. Install Dependencies

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Install project dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 3. Deploy Cloud Functions

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy functions
firebase deploy --only functions
```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Start Development

```bash
# Start the development server
npm run dev

# Start Firebase emulators (optional, for local testing)
firebase emulators:start
```

## 📊 Firestore Schema

### Users Collection (`/users/{uid}`)
```javascript
{
  mindCoins: number,
  totalBreathingSessions: number,
  lastEarnAt: Timestamp,
  currentStreakDays: number,
  lastStreakDate: Date,
  badges: {
    bronze: boolean,
    silver: boolean,
    gold: boolean,
    diamond: boolean
  }
}
```

### Mind Coin Transactions (`/users/{uid}/mindCoinTransactions/{txId}`)
```javascript
{
  type: 'EARN' | 'REDEEM' | 'BONUS' | 'ADJUST',
  amount: number,
  balanceAfter: number,
  createdAt: Timestamp,
  expiresAt: Timestamp,
  metadata: {
    source: 'breathing' | 'streak' | 'redeem',
    sessionId?: string,
    orderId?: string
  }
}
```

### Orders Collection (`/orders/{orderId}`)
```javascript
{
  uid: string,
  plan: 'monthly' | 'yearly',
  basePrice: number,
  mindCoinsApplied: number,
  status: 'created' | 'payment_pending' | 'paid' | 'failed' | 'cancelled',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔧 Cloud Functions

### `awardMindCoins`
- Awards 10 Mind Coins for completing breathing exercises
- Enforces 1-hour cooldown between earnings
- Updates streak counters and awards badges
- Handles bonus coins for streak milestones

### `redeemMindCoins`
- Applies Mind Coins to subscription orders
- Calculates discounts (10 coins = ₹1)
- Updates user balance and creates redemption transaction

### `expireMindCoins`
- Scheduled function that runs daily
- Removes expired Mind Coins (90 days)
- Creates adjustment transactions

### `getMindCoinSummary`
- Returns user's current balance, streak, badges, and recent transactions
- Used for quick UI updates

## 🎮 User Experience

### Earning Mind Coins
1. User completes a breathing exercise (minimum 1 minute)
2. Clicks "Complete Session & Earn Mind Coins"
3. System awards 10 Mind Coins (if cooldown has passed)
4. Shows reward modal with coins earned and any bonuses
5. Updates streak counter and checks for badge milestones

### Using Mind Coins
1. User goes to subscription page
2. Sees their Mind Coins balance at the top
3. Selects a plan and sees Mind Coin slider in payment modal
4. Can apply up to full price worth of Mind Coins
5. Sees real-time discount calculation
6. Completes purchase with applied discount

### Wallet Page
- Shows current balance and worth in rupees
- Displays earning status and cooldown timer
- Shows streak progress and achievement badges
- Lists recent transactions with details
- Provides motivational messaging

## 🏆 Badge System

- **Bronze Badge**: 7-day streak (+20 bonus coins)
- **Silver Badge**: 14-day streak (+50 bonus coins)
- **Gold Badge**: 30-day streak (+100 bonus coins)
- **Diamond Badge**: 60-day streak (+200 bonus coins)

## ⚙️ Configuration

### Constants (in Cloud Functions)
- `MIND_COINS_PER_BREATHING_SESSION = 10`
- `MIND_COINS_TO_RUPEE_RATIO = 10`
- `COOLDOWN_HOURS = 1`
- `EXPIRY_DAYS = 90`

### Badge Milestones
- Bronze: 7 days
- Silver: 14 days
- Gold: 30 days
- Diamond: 60 days

## 🔒 Security

- Users can only read their own data
- All Mind Coin transactions are handled via Cloud Functions
- Firestore rules prevent direct balance manipulation
- Authentication required for all operations

## 🧪 Testing

### Local Testing with Emulators
```bash
# Start emulators
firebase emulators:start

# Test functions locally
firebase functions:shell
```

### Test Scenarios
1. Complete breathing exercise and earn coins
2. Test cooldown enforcement
3. Test streak calculation and badge awarding
4. Test Mind Coin redemption in checkout
5. Test coin expiration (simulate 90+ days)

## 📱 UI Components

### New Components Added
- `Wallet.jsx` - Main wallet page
- `StreakTracker.jsx` - Streak progress display
- `BadgeDisplay.jsx` - Achievement badges
- `MindCoinSlider.jsx` - Checkout coin selector

### Updated Components
- `BreathingExercise.jsx` - Added earning functionality
- `Subscription.jsx` - Added Mind Coin redemption
- `Navbar.jsx` - Added Wallet link

## 🚨 Important Notes

1. **Firebase Config**: Update `src/config/firebase.js` with your actual Firebase configuration
2. **Authentication**: Ensure Google Auth is properly configured
3. **Functions**: Deploy Cloud Functions before testing
4. **Rules**: Deploy Firestore rules for security
5. **Testing**: Use Firebase emulators for local development

## 🎯 Business Rules

- 10 Mind Coins = ₹1 discount
- 1-hour cooldown between earnings
- Minimum 1-minute session to earn coins
- 90-day expiry for unused coins
- Non-transferable (in-app only)
- Streak resets if user misses a day

## 📞 Support

For issues or questions:
1. Check Firebase console for function logs
2. Verify Firestore rules are deployed
3. Ensure authentication is working
4. Check browser console for errors

---

**Ready to launch!** 🚀 Your Mind Coins system is now ready to gamify user engagement and drive subscription conversions.
