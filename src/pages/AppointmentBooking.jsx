import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Mail, User, MessageSquare, Shield, CheckCircle, AlertCircle } from 'lucide-react'

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issue: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal',
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'General consultation or check-in' },
    { value: 'normal', label: 'Normal', description: 'Regular therapy session' },
    { value: 'high', label: 'High', description: 'Urgent mental health concern' },
    { value: 'crisis', label: 'Crisis', description: 'Immediate support needed' }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.issue.trim()) {
      newErrors.issue = 'Please describe your concern'
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date'
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send this data to your backend
      console.log('Appointment booking data:', formData)
      
      // For demo purposes, we'll just show success
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error booking appointment:', error)
      setErrors({ submit: 'Failed to book appointment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getMinDate = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
        <div className="max-w-2xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="floating-card text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">
              Appointment Request Submitted
            </h1>
            
            <p className="text-secondary-600 mb-8">
              Thank you for reaching out. We've received your appointment request and will contact you within 24 hours to confirm your session.
            </p>

            <div className="bg-primary-25 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-primary-800 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <p className="text-sm text-primary-700">We'll review your request and match you with an appropriate therapist</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <p className="text-sm text-primary-700">You'll receive a confirmation email with session details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <p className="text-sm text-primary-700">Your therapist will contact you to discuss any specific needs</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Need immediate support?</h4>
                  <p className="text-yellow-700 text-sm">
                    If you're experiencing a mental health crisis, please contact a crisis helpline immediately. 
                    Your safety and well-being are our top priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Return to Home
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    issue: '',
                    preferredDate: '',
                    preferredTime: '',
                    urgency: 'normal',
                    additionalInfo: ''
                  })
                }}
                className="btn-primary"
              >
                Book Another Appointment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
            Book Your Appointment
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Take the first step toward better mental health. Our confidential booking system ensures your privacy and comfort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="floating-card"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.name ? 'border-red-300' : 'border-secondary-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-secondary-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Issue Description */}
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    What brings you here?
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Primary Concern *
                    </label>
                    <textarea
                      value={formData.issue}
                      onChange={(e) => handleInputChange('issue', e.target.value)}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.issue ? 'border-red-300' : 'border-secondary-300'
                      }`}
                      placeholder="Please describe what you'd like to work on in therapy..."
                    />
                    {errors.issue && <p className="text-red-500 text-sm mt-1">{errors.issue}</p>}
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                    How urgent is your need for support?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {urgencyLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.urgency === level.value
                            ? 'border-primary-500 bg-primary-25'
                            : 'border-secondary-200 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={formData.urgency === level.value}
                          onChange={(e) => handleInputChange('urgency', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 border-2 rounded-full mt-1 ${
                            formData.urgency === level.value
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-secondary-300'
                          }`}>
                            {formData.urgency === level.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-secondary-800">{level.label}</div>
                            <div className="text-sm text-secondary-600">{level.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preferred Date and Time */}
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Preferred Appointment Time
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        min={getMinDate()}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.preferredDate ? 'border-red-300' : 'border-secondary-300'
                        }`}
                      />
                      {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.preferredTime ? 'border-red-300' : 'border-secondary-300'
                        }`}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any specific preferences, previous therapy experience, or other information you'd like to share..."
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-secondary-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Request Appointment'
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Privacy Notice */}
              <div className="floating-card">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-800">Your Privacy</h3>
                </div>
                <div className="space-y-3 text-sm text-secondary-600">
                  <p>• All information is kept strictly confidential</p>
                  <p>• Your data is encrypted and secure</p>
                  <p>• We follow HIPAA guidelines</p>
                  <p>• You can request data deletion anytime</p>
                </div>
              </div>

              {/* What to Expect */}
              <div className="floating-card">
                <h3 className="text-lg font-semibold text-secondary-800 mb-4">What to Expect</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-800">Initial Contact</h4>
                      <p className="text-sm text-secondary-600">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-800">Therapist Match</h4>
                      <p className="text-sm text-secondary-600">We'll match you with the right therapist</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-800">First Session</h4>
                      <p className="text-sm text-secondary-600">Begin your healing journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crisis Support */}
              <div className="floating-card bg-red-50 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Need Immediate Help?</h3>
                <p className="text-sm text-red-700 mb-4">
                  If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-red-800 font-medium">Crisis Helpline: 988</p>
                  <p className="text-red-700">Available 24/7</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking
