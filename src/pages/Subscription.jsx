import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Crown, Star, Zap, Shield, Users, Heart, Calendar, X, Sparkles, Coins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMindCoinSummary, redeemMindCoins } from '../services/mindCoinService'
import MindCoinSlider from '../components/ui/MindCoinSlider'

const Subscription = () => {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [mindCoinSummary, setMindCoinSummary] = useState(null)
  const [mindCoinsToRedeem, setMindCoinsToRedeem] = useState(0)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      subtitle: 'Get started with basics',
      price: { monthly: 0, yearly: 0 },
      color: 'from-gray-400 to-gray-500',
      popular: false,
      features: [
        'Basic mood tracking',
        'AI Chat',
        'Sound therapy (limited)',
        'Breathing exercises',
        'Community access',
        'Weekly mental health tips',
        'Mental health screening',
      ],
      limitations: [
        'Unlimited AI conversation',
        'No advanced analytics',
        'Basic support only'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Comprehensive wellness tools',
      price: { monthly: 399, yearly: 3591 },
      color: 'from-primary-500 to-primary-600',
      popular: true,
      features: [
        'Unlimited mood tracking with insights',
        'Unlimited AI chat conversations',
        'Full sound therapy library',
        'All mental health screenings',
        'Advanced breathing exercises',
        'Personal journal with encryption',
        'Progress analytics & reports',
        'Community participation',
        'Priority customer support',
        '1 free therapy consultation/month',
        'Personalized recommendations'
      ],
      limitations: [
        'No direct therapist messaging',
        'No family therapy sessions'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      subtitle: 'Complete mental health solution',
      price: { monthly: 599, yearly: 5391 , period: 'month' },
      color: 'from-purple-500 to-indigo-600',
      popular: false,
      features: [
        'Everything in Premium',
        'Early access to new features',
        'Direct therapist messaging',
        '2 free therapy consultations/month',
        'Crisis support hotline',
        'Family therapy sessions',
        'Specialized treatment plans',
        'Weekly progress reviews',
        'Advanced mental health assessments',
        'Medication tracking',
        
      ],
      limitations: []
    }
  ]

  const testimonials = [
    {
      name: "Anindita K.",
      plan: "Premium",
      rating: 5,
      text: "The unlimited AI chat and therapy consultation have been game-changers for my mental health journey."
    },
    {
      name: "Rajesh M.",
      plan: "Professional", 
      rating: 5,
      text: "Having unlimited therapy access when I need it most has provided incredible peace of mind."
    },
    {
      name: "Priya S.",
      plan: "Premium",
      rating: 5,
      text: "The progress analytics help me understand my patterns better. Worth every rupee!"
    }
  ]

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
    },
    {
      question: "Is there a free trial for premium plans?",
      answer: "Yes! We offer a 7-day free trial for both Premium and Professional plans. Cancel anytime during the trial period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets including Paytm, PhonePe, and Google Pay."
    },
    {
      question: "Is my data secure with paid plans?",
      answer: "Absolutely. All plans include enterprise-grade security with end-to-end encryption for your personal data and conversations."
    },
    {
      question: "Can I pause my subscription?",
      answer: "Yes, you can pause your subscription for up to 3 months if you need a break. Your data and progress will be preserved."
    }
  ]

  const getDiscountPercentage = () => {
    return 25
  }

  // Load Mind Coin summary
  useEffect(() => {
    const loadMindCoinSummary = async () => {
      try {
        const summary = await getMindCoinSummary()
        setMindCoinSummary(summary)
      } catch (error) {
        console.error('Error loading mind coin summary:', error)
      }
    }
    loadMindCoinSummary()
  }, [])

  const calculateFinalPrice = (plan) => {
    const basePrice = plan.price[billingCycle]
    const discount = Math.floor(mindCoinsToRedeem / 10)
    return Math.max(0, basePrice - discount)
  }

  const handleMindCoinChange = (value) => {
    setMindCoinsToRedeem(value)
  }

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      // Navigate to AI chat page for free plan
      navigate('/chat')
      return
    }
    setSelectedPlan(plan)
    setMindCoinsToRedeem(0) // Reset Mind Coins selection
    setOrderId(`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    setShowPaymentModal(true)
  }

  const handleStartTrial = async () => {
    if (!selectedPlan || !orderId) return

    setLoading(true)
    try {
      // If Mind Coins are being redeemed, apply them first
      if (mindCoinsToRedeem > 0) {
        await redeemMindCoins(orderId, mindCoinsToRedeem)
      }

      // Here you would typically integrate with your payment processor
      // For now, we'll just show a success message
      alert(`Successfully started ${selectedPlan.name} trial!`)
      setShowPaymentModal(false)
    } catch (error) {
      console.error('Error starting trial:', error)
      alert('Error starting trial. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
            Choose Your Wellness Plan
          </h1>
          <p className="text-secondary-600 mb-6">
            Unlock your full mental health potential with our comprehensive plans
          </p>
          
          {/* Mind Coins Info */}
          {mindCoinSummary && mindCoinSummary.balance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-3">
                <Coins className="w-6 h-6 text-primary-600" />
                <div className="text-center">
                  <p className="text-primary-700 font-medium">
                    You have {mindCoinSummary.balance.toLocaleString()} Mind Coins
                  </p>
                  <p className="text-primary-600 text-sm">
                    Worth ₹{Math.floor(mindCoinSummary.balance / 10)} in subscription discounts
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-xl p-1 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                billingCycle === 'yearly'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              <span>Yearly</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                Save {getDiscountPercentage()}%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`floating-card relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 text-sm font-bold rounded-bl-xl">
                  <Star className="w-4 h-4 inline mr-1" />
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  {plan.id === 'free' && <Users className="w-8 h-8 text-white" />}
                  {plan.id === 'premium' && <Crown className="w-8 h-8 text-white" />}
                  {plan.id === 'professional' && <Sparkles className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-secondary-800">{plan.name}</h3>
                <p className="text-secondary-600 text-sm">{plan.subtitle}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                {plan.price[billingCycle] > 0 ? (
                  <>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-secondary-800">
                        ₹{plan.price[billingCycle]}
                      </span>
                      <span className="text-secondary-500 ml-1">
                        /{plan.id === 'professional' && billingCycle === 'monthly' ? plan.price.period : (billingCycle === 'yearly' ? 'year' : 'month')}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ₹{(plan.price.monthly * 12) - plan.price.yearly} annually
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-4xl font-bold text-secondary-800">
                    NA
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, idx) => (
                  <div key={idx} className="flex items-start space-x-3 opacity-50">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.id === 'free'
                    ? 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                    : plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-white border-2 border-primary-200 text-primary-600 hover:bg-primary-50'
                }`}
              >
                {plan.id === 'free' ? 'Get Started' : 'Start Free Trial'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card mb-12"
        >
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-800">Features</th>
                  <th className="text-center py-3 px-4 font-semibold text-secondary-800">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-600">Premium</th>
                  <th className="text-center py-3 px-4 font-semibold text-purple-600">Professional</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: 'Mood Tracking', free: 'Basic', premium: 'Advanced', professional: 'Advanced' },
                  { feature: 'AI Chat Messages', free: 'unlimited', premium: 'Unlimited', professional: 'Unlimited' },
                  { feature: 'Sound Therapy', free: 'Limited', premium: 'Full Library', professional: 'Full Library' },
                  { feature: 'Crisis Support', free: '24/7', premium: '24/7', professional: '24/7' },
                  { feature: 'Journal Entries', free: '✓', premium: 'Unlimited', professional: 'Unlimited' },
                  { feature: 'Therapy Sessions', free: '×', premium: '1 free session/month', professional: '2 free sessions/month' },
                  { feature: 'Progress Analytics', free: '×', premium: '✓', professional: '✓' },
                  { feature: 'Therapist Messaging', free: '×', premium: '×', professional: '✓' },
                  { feature: 'Family Therapy', free: '×', premium: '×', professional: '✓' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-secondary-100">
                    <td className="py-3 px-4 font-medium text-secondary-800">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-secondary-600">{row.free}</td>
                    <td className="py-3 px-4 text-center text-primary-600">{row.premium}</td>
                    <td className="py-3 px-4 text-center text-purple-600">{row.professional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="floating-card text-center"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 italic mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-secondary-800">{testimonial.name}</p>
                  <p className="text-sm text-secondary-500">{testimonial.plan} User</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card"
        >
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-secondary-100 pb-4">
                <h3 className="font-semibold text-secondary-800 mb-2">{faq.question}</h3>
                <p className="text-secondary-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center mx-auto mb-4`}>
                    {selectedPlan.id === 'premium' ? (
                      <Crown className="w-8 h-8 text-white" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-800">{selectedPlan.name} Plan</h3>
                  
                  {/* Pricing with Mind Coins discount */}
                  <div className="my-4">
                    {mindCoinsToRedeem > 0 ? (
                      <div>
                        <div className="text-lg text-secondary-500 line-through">
                          ₹{selectedPlan.price[billingCycle]}
                        </div>
                        <div className="text-4xl font-bold text-green-600">
                          ₹{calculateFinalPrice(selectedPlan)}
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          You saved ₹{Math.floor(mindCoinsToRedeem / 10)} with Mind Coins!
                        </div>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-primary-600">
                        ₹{selectedPlan.price[billingCycle]}
                      </div>
                    )}
                    <span className="text-lg text-secondary-500">/{selectedPlan.id === 'professional' ? selectedPlan.price.period : (billingCycle === 'yearly' ? 'year' : 'month')}</span>
                  </div>
                </div>

                {/* Mind Coins Section */}
                {mindCoinSummary && mindCoinSummary.balance > 0 && (
                  <div className="mb-6">
                    <MindCoinSlider
                      balance={mindCoinSummary.balance}
                      maxRedeemable={selectedPlan.price[billingCycle] * 10} // Max coins = full price * 10
                      onValueChange={handleMindCoinChange}
                      className="mb-4"
                    />
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-700 font-medium text-center">
                    🎉 Start your 7-day free trial today!
                  </p>
                  <p className="text-green-600 text-sm text-center mt-1">
                    Cancel anytime during trial period
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleStartTrial}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Start Free Trial'}
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full border border-secondary-300 text-secondary-700 py-3 px-6 rounded-xl font-medium hover:bg-secondary-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-secondary-500 text-center mt-4">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Subscription