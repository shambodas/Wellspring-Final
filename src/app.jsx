import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'

// Context
import { LanguageProvider } from './contexts/LanguageContext'

// Components
import Navbar from './components/ui/Navbar'

// Pages
import Homepage from './pages/Homepage'
import Chat from './pages/Chat'
import MoodTracker from './pages/MoodTracker'
import Resources from './pages/Resources'
import SoundTherapy from './pages/SoundTherapy'
import TherapyBooking from './pages/TherapyBooking'
import Subscription from './pages/Subscription'
import BreathingExercises from './pages/BreathingExercise'
import Journal from './pages/Journal'
import CommunitySupport from './pages/CommunitySupport'
import ScreeningForms from './pages/ScreeningForms'
import AppointmentBooking from './pages/AppointmentBooking'
import ResourceHub from './pages/ResourceHub'
import AdminDashboard from './pages/AdminDashboard'
import Wallet from './pages/Wallet'

import GeminiTest from './components/GeminiTest'

// Emergency Helpline Component
const EmergencyHelpline = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const helplines = [
    { name: "KIRAN Mental Health", number: "1800-599-0019" },
    { name: "Vandrevala Foundation", number: "+91-9999-666-555" },
    { name: "NIMHANS", number: "+91-80-2699-5555" },
    { name: "iCall", number: "+91-9152987821" }
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 bg-white rounded-xl shadow-xl p-4 w-64"
          >
            <h3 className="text-sm font-semibold text-red-600 mb-2">Emergency Helplines</h3>
            <div className="space-y-2">
              {helplines.map((helpline, index) => (
                <div key={index} className="text-xs">
                  <p className="font-medium text-gray-700">{helpline.name}</p>
                  <a 
                    href={`tel:${helpline.number}`}
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    {helpline.number}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <Phone size={24} className="group-hover:animate-pulse" />
        <span className="sr-only">Emergency Helpline</span>
      </motion.button>
    </div>
  )
}

function App() {
  const Protected = ({ children }) => (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Protected><Homepage /></Protected>} />
            <Route path="/home" element={<Protected><Homepage /></Protected>} />
            <Route
              path="/sign-in"
              element={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <SignIn routing="path" path="/sign-in" afterSignInUrl="/home" signUpUrl="/sign-up" />
                </div>
              }
            />
            <Route
              path="/sign-up"
              element={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <SignUp routing="path" path="/sign-up" afterSignUpUrl="/home" />
                </div>
              }
            />
            <Route path="/chat" element={<Protected><Chat /></Protected>} />
            <Route path="/mood-tracker" element={<Protected><MoodTracker /></Protected>} />
            <Route path="/resources" element={<Protected><Resources /></Protected>} />
            <Route path="/sound-therapy" element={<Protected><SoundTherapy /></Protected>} />
            <Route path="/therapy-booking" element={<Protected><TherapyBooking /></Protected>} />
            <Route path="/subscription" element={<Protected><Subscription /></Protected>} />
            <Route path="/breathing-exercises" element={<Protected><BreathingExercises /></Protected>} />
            <Route path="/journal" element={<Protected><Journal /></Protected>} />
            <Route path="/community" element={<Protected><CommunitySupport /></Protected>} />
            <Route path="/screening" element={<Protected><ScreeningForms /></Protected>} />
            <Route path="/appointment-booking" element={<Protected><AppointmentBooking /></Protected>} />
            <Route path="/resource-hub" element={<Protected><ResourceHub /></Protected>} />
            <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
            <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />

            <Route path="/test" element={<GeminiTest />} />
          </Routes>
          <EmergencyHelpline />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App