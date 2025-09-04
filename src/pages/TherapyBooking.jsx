import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Clock, Video, MessageSquare, Phone, Calendar, CheckCircle, Award, Users, Heart, Shield } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const TherapyBooking = () => {
  const { t } = useLanguage()
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [sessionType, setSessionType] = useState('video')
  const [bookingStep, setBookingStep] = useState(1)
  const [showBookingSuccess, setShowBookingSuccess] = useState(false)
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [filterLanguage, setFilterLanguage] = useState('all')

  const therapists = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialties: ["Anxiety", "Depression", "Stress Management"],
      languages: ["English", "Hindi"],
      experience: "8 years",
      rating: 4.9,
      reviews: 156,
      price: 800,
      location: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      bio: "Specialized in cognitive behavioral therapy with a focus on anxiety and depression management.",
      education: "PhD in Clinical Psychology, AIIMS Delhi",
      approach: "CBT, Mindfulness-based therapy",
      availability: ["Mon", "Wed", "Fri", "Sat"]
    },
    {
      id: 2,
      name: "Dr. Rahul Mehta",
      specialties: ["Relationship Counseling", "Family Therapy", "Communication"],
      languages: ["English", "Hindi", "Gujarati"],
      experience: "12 years",
      rating: 4.8,
      reviews: 203,
      price: 1000,
      location: "Delhi",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      bio: "Expert in relationship dynamics and family systems therapy with over a decade of experience.",
      education: "Masters in Marriage & Family Therapy",
      approach: "Systems therapy, EFT",
      availability: ["Tue", "Thu", "Sat", "Sun"]
    },
    {
      id: 3,
      name: "Dr. Ananya Rao",
      specialties: ["Student Counseling", "Career Guidance", "Academic Stress"],
      languages: ["English", "Telugu", "Tamil"],
      experience: "6 years",
      rating: 4.9,
      reviews: 89,
      price: 600,
      location: "Bangalore",
      avatar: "https://images.unsplash.com/photo-1594824848637-114b6a4b1be5?w=150&h=150&fit=crop&crop=face",
      bio: "Specializes in helping students navigate academic challenges and career decisions.",
      education: "M.Phil in Counseling Psychology",
      approach: "Solution-focused therapy, Career counseling",
      availability: ["Mon", "Wed", "Thu", "Fri"]
    },
    {
      id: 4,
      name: "Dr. Vikram Singh",
      specialties: ["Trauma Therapy", "PTSD", "Addiction Counseling"],
      languages: ["English", "Hindi", "Punjabi"],
      experience: "15 years",
      rating: 4.7,
      reviews: 267,
      price: 1200,
      location: "Chandigarh",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      bio: "Senior therapist specializing in trauma recovery and addiction counseling.",
      education: "PhD in Clinical Psychology, PGI Chandigarh",
      approach: "EMDR, Trauma-informed care",
      availability: ["Mon", "Tue", "Wed", "Fri"]
    },
    {
      id: 5,
      name: "Dr. Kavya Nair",
      specialties: ["Women's Mental Health", "Postpartum", "Eating Disorders"],
      languages: ["English", "Malayalam", "Tamil"],
      experience: "9 years",
      rating: 4.9,
      reviews: 124,
      price: 900,
      location: "Kochi",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      bio: "Dedicated to women's mental health with expertise in perinatal and reproductive psychology.",
      education: "Masters in Women's Studies & Psychology",
      approach: "Feminist therapy, Holistic healing",
      availability: ["Tue", "Thu", "Fri", "Sat"]
    },
    {
      id: 6,
      name: "Dr. Arjun Khanna",
      specialties: ["Mindfulness", "Meditation", "Stress Reduction"],
      languages: ["English", "Hindi"],
      experience: "10 years",
      rating: 4.8,
      reviews: 178,
      price: 700,
      location: "Pune",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Integrates traditional mindfulness practices with modern therapeutic approaches.",
      education: "PhD in Psychology, Masters in Buddhist Studies",
      approach: "Mindfulness-based therapy, ACT",
      availability: ["Mon", "Wed", "Fri", "Sun"]
    },
    {
      id: 7,
      name: "Dr. Meera Patel",
      specialties: ["Child Psychology", "ADHD", "Learning Disabilities"],
      languages: ["English", "Hindi", "Gujarati"],
      experience: "11 years",
      rating: 4.9,
      reviews: 145,
      price: 750,
      location: "Ahmedabad",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Child psychologist with expertise in developmental disorders and behavioral interventions.",
      education: "PhD in Child Psychology, NIMHANS",
      approach: "Play therapy, Behavioral therapy",
      availability: ["Mon", "Tue", "Wed", "Thu"]
    },
    {
      id: 8,
      name: "Dr. Rajesh Kumar",
      specialties: ["Geriatric Psychology", "Elder Care", "Life Transitions"],
      languages: ["English", "Hindi", "Bengali"],
      experience: "18 years",
      rating: 4.8,
      reviews: 98,
      price: 650,
      location: "Kolkata",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Specializes in mental health care for seniors and helping with life transitions.",
      education: "PhD in Geriatric Psychology, AIIMS Delhi",
      approach: "Life review therapy, Supportive therapy",
      availability: ["Mon", "Wed", "Fri", "Sat"]
    },
    {
      id: 9,
      name: "Dr. Sunita Verma",
      specialties: ["Couples Therapy", "Marriage Counseling", "Sex Therapy"],
      languages: ["English", "Hindi", "Marathi"],
      experience: "13 years",
      rating: 4.9,
      reviews: 167,
      price: 1100,
      location: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Expert in relationship dynamics and helping couples build stronger connections.",
      education: "Masters in Marriage & Family Therapy, TISS",
      approach: "Gottman method, Emotionally focused therapy",
      availability: ["Tue", "Thu", "Fri", "Sun"]
    },
    {
      id: 10,
      name: "Dr. Amit Shah",
      specialties: ["Sports Psychology", "Performance Anxiety", "Motivation"],
      languages: ["English", "Hindi", "Gujarati"],
      experience: "7 years",
      rating: 4.7,
      reviews: 89,
      price: 800,
      location: "Surat",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "Sports psychologist helping athletes and performers overcome mental barriers.",
      education: "Masters in Sports Psychology, LNIPE",
      approach: "Performance psychology, Mental training",
      availability: ["Mon", "Wed", "Sat", "Sun"]
    },
    {
      id: 11,
      name: "Dr. Lakshmi Devi",
      specialties: ["Art Therapy", "Creative Expression", "Trauma Healing"],
      languages: ["English", "Tamil", "Telugu"],
      experience: "9 years",
      rating: 4.8,
      reviews: 112,
      price: 700,
      location: "Chennai",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      bio: "Art therapist using creative expression to help heal trauma and emotional wounds.",
      education: "Masters in Art Therapy, NIMHANS",
      approach: "Art therapy, Creative expression",
      availability: ["Mon", "Tue", "Thu", "Fri"]
    },
    {
      id: 12,
      name: "Dr. Harpreet Kaur",
      specialties: ["Cultural Therapy", "Immigration Issues", "Identity Crisis"],
      languages: ["English", "Hindi", "Punjabi"],
      experience: "12 years",
      rating: 4.9,
      reviews: 134,
      price: 850,
      location: "Amritsar",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      bio: "Specializes in helping individuals navigate cultural identity and immigration challenges.",
      education: "PhD in Cross-cultural Psychology, Delhi University",
      approach: "Cultural therapy, Identity work",
      availability: ["Tue", "Wed", "Fri", "Sat"]
    },
    {
      id: 13,
      name: "Dr. Neha Gupta",
      specialties: ["LGBTQ+ Counseling", "Gender Identity", "Coming Out Support"],
      languages: ["English", "Hindi", "Bengali"],
      experience: "8 years",
      rating: 4.9,
      reviews: 98,
      price: 900,
      location: "Kolkata",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      bio: "Specialized counselor providing safe and supportive therapy for LGBTQ+ individuals and families.",
      education: "Masters in Clinical Psychology, TISS Mumbai",
      approach: "Affirmative therapy, Narrative therapy",
      availability: ["Mon", "Wed", "Fri", "Sun"]
    },
    {
      id: 14,
      name: "Dr. Suresh Reddy",
      specialties: ["Workplace Stress", "Burnout", "Career Transitions"],
      languages: ["English", "Telugu", "Hindi"],
      experience: "14 years",
      rating: 4.8,
      reviews: 187,
      price: 950,
      location: "Hyderabad",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      bio: "Industrial psychologist helping professionals manage workplace stress and career development.",
      education: "PhD in Industrial Psychology, IIT Delhi",
      approach: "Cognitive restructuring, Stress management",
      availability: ["Tue", "Thu", "Sat", "Sun"]
    },
    {
      id: 15,
      name: "Dr. Pooja Agarwal",
      specialties: ["Sleep Disorders", "Insomnia", "Circadian Rhythm"],
      languages: ["English", "Hindi", "Marwari"],
      experience: "6 years",
      rating: 4.7,
      reviews: 76,
      price: 750,
      location: "Jaipur",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      bio: "Sleep specialist helping individuals overcome sleep disorders and improve sleep quality.",
      education: "Masters in Sleep Medicine, AIIMS Delhi",
      approach: "CBT-I, Sleep hygiene therapy",
      availability: ["Mon", "Wed", "Thu", "Fri"]
    },
    {
      id: 16,
      name: "Dr. Ravi Joshi",
      specialties: ["Anger Management", "Impulse Control", "Emotional Regulation"],
      languages: ["English", "Hindi", "Marathi"],
      experience: "11 years",
      rating: 4.8,
      reviews: 142,
      price: 800,
      location: "Pune",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      bio: "Specializes in helping individuals manage anger and develop healthy emotional regulation skills.",
      education: "Masters in Clinical Psychology, Pune University",
      approach: "Anger management therapy, DBT",
      availability: ["Mon", "Tue", "Wed", "Sat"]
    },
    {
      id: 17,
      name: "Dr. Deepika Iyer",
      specialties: ["Grief Counseling", "Loss & Bereavement", "Life Changes"],
      languages: ["English", "Tamil", "Malayalam"],
      experience: "13 years",
      rating: 4.9,
      reviews: 156,
      price: 850,
      location: "Chennai",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      bio: "Compassionate therapist specializing in grief counseling and helping individuals navigate loss.",
      education: "PhD in Counseling Psychology, Madras University",
      approach: "Grief therapy, Meaning-making therapy",
      availability: ["Tue", "Wed", "Fri", "Sun"]
    },
    {
      id: 18,
      name: "Dr. Manish Tiwari",
      specialties: ["OCD", "Phobias", "Panic Disorders"],
      languages: ["English", "Hindi", "Bhojpuri"],
      experience: "16 years",
      rating: 4.8,
      reviews: 203,
      price: 1000,
      location: "Varanasi",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      bio: "Expert in treating OCD, phobias, and anxiety disorders using evidence-based approaches.",
      education: "PhD in Clinical Psychology, BHU Varanasi",
      approach: "ERP, Exposure therapy, CBT",
      availability: ["Mon", "Wed", "Fri", "Sat"]
    },
    {
      id: 19,
      name: "Dr. Shruti Desai",
      specialties: ["Body Image", "Self-Esteem", "Confidence Building"],
      languages: ["English", "Gujarati", "Hindi"],
      experience: "7 years",
      rating: 4.9,
      reviews: 118,
      price: 700,
      location: "Ahmedabad",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      bio: "Helps individuals build positive body image and develop healthy self-esteem and confidence.",
      education: "Masters in Counseling Psychology, Gujarat University",
      approach: "Body-positive therapy, Self-compassion therapy",
      availability: ["Mon", "Tue", "Thu", "Fri"]
    },
    {
      id: 20,
      name: "Dr. Karthik Menon",
      specialties: ["Digital Wellness", "Social Media Addiction", "Screen Time Management"],
      languages: ["English", "Malayalam", "Tamil"],
      experience: "5 years",
      rating: 4.7,
      reviews: 89,
      price: 650,
      location: "Kochi",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Specializes in digital wellness and helping individuals develop healthy relationships with technology.",
      education: "Masters in Cyber Psychology, Kerala University",
      approach: "Digital detox therapy, Mindfulness-based interventions",
      availability: ["Tue", "Wed", "Fri", "Sat"]
    }
  ]

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ]

  const specialties = ["all", "Anxiety", "Depression", "Stress Management", "Relationship Counseling", "Student Counseling", "Trauma Therapy", "Women's Mental Health", "Mindfulness", "Child Psychology", "Geriatric Psychology", "Couples Therapy", "Sports Psychology", "Art Therapy", "Cultural Therapy", "LGBTQ+ Counseling", "Workplace Stress", "Sleep Disorders", "Anger Management", "Grief Counseling", "OCD", "Body Image", "Digital Wellness"]
  const languages = ["all", "English", "Hindi", "Telugu", "Tamil", "Gujarati", "Malayalam", "Punjabi", "Bengali", "Marathi"]

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSpecialty = filterSpecialty === 'all' || therapist.specialties.some(spec => spec.includes(filterSpecialty))
    const matchesLanguage = filterLanguage === 'all' || therapist.languages.includes(filterLanguage)
    return matchesSpecialty && matchesLanguage
  })

  const bookAppointment = () => {
    setShowBookingSuccess(true)
    setTimeout(() => {
      setShowBookingSuccess(false)
      setBookingStep(1)
      setSelectedTherapist(null)
      setSelectedDate('')
      setSelectedTime('')
    }, 3000)
  }

  const getNextAvailableDates = (therapist) => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      if (therapist.availability.includes(dayName)) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    
    return dates.slice(0, 7)
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
            {t('therapy.title')}
          </h1>
          <p className="text-secondary-600">
            {t('therapy.subtitle')}
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div 
            className="floating-card text-center py-4 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            </motion.div>
            <div className="text-sm font-medium text-secondary-800">Licensed</div>
            <div className="text-xs text-secondary-600">Professionals</div>
          </motion.div>
          <motion.div 
            className="floating-card text-center py-4 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            </motion.div>
            <div className="text-sm font-medium text-secondary-800">95% Satisfaction</div>
            <div className="text-xs text-secondary-600">Rate</div>
          </motion.div>
          <motion.div 
            className="floating-card text-center py-4 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            </motion.div>
            <div className="text-sm font-medium text-secondary-800">1000+</div>
            <div className="text-xs text-secondary-600">Happy Clients</div>
          </motion.div>
          <motion.div 
            className="floating-card text-center py-4 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            </motion.div>
            <div className="text-sm font-medium text-secondary-800">Affordable</div>
            <div className="text-xs text-secondary-600">Pricing</div>
          </motion.div>
        </motion.div>

        {/* Pricing Comparison removed as requested */}

        {bookingStep === 1 && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="floating-card mb-6"
            >
              <h2 className="text-xl font-semibold text-secondary-800 mb-4">{t('therapy.findTherapist')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t('therapy.specialty')}
                  </label>
                  <select
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t('therapy.language')}
                  </label>
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>
                        {language === 'all' ? 'All Languages' : language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Therapist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="floating-card hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Therapist Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={therapist.avatar}
                        alt={therapist.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-primary-100 group-hover:border-primary-300 transition-colors duration-300"
                      />
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </motion.div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-secondary-800 truncate group-hover:text-primary-600 transition-colors duration-300">
                        {therapist.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-1">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </motion.div>
                        <span className="text-sm font-medium">{therapist.rating}</span>
                        <span className="text-sm text-secondary-500">({therapist.reviews})</span>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {therapist.location}
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.slice(0, 2).map((specialty, idx) => (
                        <motion.span
                          key={idx}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-200 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + idx * 0.1 }}
                        >
                          {specialty}
                        </motion.span>
                      ))}
                      {therapist.specialties.length > 2 && (
                        <motion.span 
                          className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs font-medium rounded-full hover:bg-secondary-200 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          +{therapist.specialties.length - 2} more
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <motion.div 
                      className="flex justify-between"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-secondary-600">Experience:</span>
                      <span className="font-medium">{therapist.experience}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-secondary-600">Languages:</span>
                      <span className="font-medium">{therapist.languages.slice(0, 2).join(', ')}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-secondary-600">Session Fee:</span>
                      <span className="font-semibold text-primary-600">₹{therapist.price}</span>
                    </motion.div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2 group-hover:text-secondary-700 transition-colors duration-300">
                    {therapist.bio}
                  </p>

                  {/* Book Button */}
                  <motion.button
                    onClick={() => {
                      setSelectedTherapist(therapist)
                      setBookingStep(2)
                    }}
                    className="w-full btn-primary relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="relative z-10"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Book Consultation
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {bookingStep === 2 && selectedTherapist && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="floating-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-secondary-800">Book with {selectedTherapist.name}</h2>
                <button
                  onClick={() => setBookingStep(1)}
                  className="text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
                >
                  ← Back to Therapists
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Therapist Details */}
                <div>
                  <div className="flex items-start space-x-4 mb-6">
                    <img
                      src={selectedTherapist.avatar}
                      alt={selectedTherapist.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-secondary-800">{selectedTherapist.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{selectedTherapist.rating}</span>
                        <span className="text-secondary-500">({selectedTherapist.reviews} reviews)</span>
                      </div>
                      <p className="text-secondary-600">{selectedTherapist.education}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTherapist.specialties.map((specialty, idx) => (
                          <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-2">Approach</h4>
                      <p className="text-secondary-600">{selectedTherapist.approach}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-2">About</h4>
                      <p className="text-secondary-600">{selectedTherapist.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="space-y-6">
                  {/* Session Type */}
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-3">Session Type</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'video', icon: Video, label: 'Video Call' },
                        { type: 'audio', icon: Phone, label: 'Audio Call' },
                        { type: 'chat', icon: MessageSquare, label: 'Chat' }
                      ].map(({ type, icon: Icon, label }) => (
                        <motion.button
                          key={type}
                          onClick={() => setSessionType(type)}
                          className={`p-3 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all duration-200 ${
                            sessionType === type 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-secondary-200 hover:border-primary-300'
                          }`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          animate={sessionType === type ? { 
                            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" 
                          } : {}}
                        >
                          <motion.div
                            animate={sessionType === type ? { 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon className="w-6 h-6" />
                          </motion.div>
                          <span className="text-sm font-medium">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-3">Select Date</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {getNextAvailableDates(selectedTherapist).map(date => {
                        const dateObj = new Date(date)
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                        const dayNum = dateObj.getDate()
                        
                        return (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                              selectedDate === date
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-secondary-200 hover:border-primary-300'
                            }`}
                          >
                            <div className="text-xs text-secondary-500">{dayName}</div>
                            <div className="font-medium">{dayNum}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-3">Select Time</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 border rounded-lg text-sm transition-all duration-200 ${
                              selectedTime === time
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-secondary-200 hover:border-primary-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirm Button */}
                  {selectedDate && selectedTime && (
                    <motion.button
                      onClick={bookAppointment}
                      className="w-full btn-primary flex items-center justify-center space-x-2 mt-4 relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                      <motion.span
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Confirm Booking
                      </motion.span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Booking Success Modal */}
        <AnimatePresence>
          {showBookingSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-card p-8 rounded-2xl text-center max-w-sm mx-auto relative overflow-hidden"
              >
                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-400 rounded-full"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-semibold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Booking Confirmed! 🎉
                  </motion.h3>
                  
                  <motion.p 
                    className="text-secondary-700 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your session with <span className="font-bold text-primary-600">{selectedTherapist?.name}</span> is booked.
                  </motion.p>
                  
                  <motion.div 
                    className="text-sm text-secondary-600 mb-2 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="inline w-4 h-4 mr-1" />
                    </motion.div>
                    {selectedDate} at {selectedTime}
                  </motion.div>
                  
                  <motion.div 
                    className="text-xs text-secondary-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    You will receive a confirmation email with session details.
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TherapyBooking