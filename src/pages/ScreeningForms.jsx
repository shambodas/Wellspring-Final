import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, ArrowRight, ArrowLeft, FileText, Brain, TrendingUp, Heart, Shield, Activity, Zap } from 'lucide-react'

const ScreeningForms = () => {
  const [currentForm, setCurrentForm] = useState(null) // 'phq9' or 'gad7'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking slowly enough that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way"
  ]

  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ]

  const ghq12Questions = [
    "Have you been able to concentrate on whatever you're doing?",
    "Have you lost much sleep over worry?",
    "Have you felt that you are playing a useful part in things?",
    "Have you felt capable of making decisions about things?",
    "Have you felt constantly under strain?",
    "Have you felt that you couldn't overcome your difficulties?",
    "Have you been able to enjoy your normal day-to-day activities?",
    "Have you been able to face up to your problems?",
    "Have you been feeling unhappy and depressed?",
    "Have you been losing confidence in yourself?",
    "Have you been thinking of yourself as a worthless person?",
    "Have you been feeling reasonably happy, all things considered?"
  ]

  const cssrsQuestions = [
    "Have you wished you were dead or wished you could go to sleep and not wake up?",
    "Have you actually had any thoughts of killing yourself?",
    "Have you been thinking about how you might kill yourself?",
    "Have you had these thoughts and had some intention of acting on them?",
    "Have you started to work out or worked out the details of how to kill yourself?",
    "Have you done anything, started to do anything, or prepared to do anything to end your life?"
  ]

  const pssQuestions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and 'stressed'?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
  ]

  const who5Questions = [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me"
  ]

  // Answer options for PHQ-9 and GAD-7
  const phqGadAnswerOptions = [
    { value: 0, label: "Not at all", description: "0 days" },
    { value: 1, label: "Several days", description: "1-2 days" },
    { value: 2, label: "More than half the days", description: "3-4 days" },
    { value: 3, label: "Nearly every day", description: "5-7 days" }
  ]

  // Answer options for GHQ-12
  const ghq12AnswerOptions = [
    { value: 0, label: "Better than usual" },
    { value: 1, label: "Same as usual" },
    { value: 2, label: "Less than usual" },
    { value: 3, label: "Much less than usual" }
  ]

  // Answer options for C-SSRS
  const cssrsAnswerOptions = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" }
  ]

  // Answer options for PSS
  const pssAnswerOptions = [
    { value: 0, label: "Never" },
    { value: 1, label: "Almost never" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Fairly often" },
    { value: 4, label: "Very often" }
  ]

  // Answer options for WHO-5
  const who5AnswerOptions = [
    { value: 0, label: "At no time" },
    { value: 1, label: "Some of the time" },
    { value: 2, label: "Less than half of the time" },
    { value: 3, label: "More than half of the time" },
    { value: 4, label: "All of the time" }
  ]

  const getCurrentQuestions = () => {
    switch (currentForm) {
      case 'phq9': return phq9Questions
      case 'gad7': return gad7Questions
      case 'ghq12': return ghq12Questions
      case 'cssrs': return cssrsQuestions
      case 'pss': return pssQuestions
      case 'who5': return who5Questions
      default: return []
    }
  }

  const getAnswerOptions = () => {
    switch (currentForm) {
      case 'phq9':
      case 'gad7': return phqGadAnswerOptions
      case 'ghq12': return ghq12AnswerOptions
      case 'cssrs': return cssrsAnswerOptions
      case 'pss': return pssAnswerOptions
      case 'who5': return who5AnswerOptions
      default: return []
    }
  }

  const getCurrentQuestion = () => {
    const questions = getCurrentQuestions()
    return questions[currentQuestion]
  }

  const handleAnswer = (value) => {
    const newAnswers = { ...answers }
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    // Briefly show selection tick before advancing
    setTimeout(() => {
      if (currentQuestion < getCurrentQuestions().length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        calculateResults()
      }
    }, 250)
  }

  const calculateResults = () => {
    const questions = getCurrentQuestions()
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    
    let severity, description, recommendations, maxScore

    switch (currentForm) {
      case 'phq9':
        maxScore = 27
        if (totalScore <= 4) {
          severity = "Minimal"
          description = "Your responses suggest minimal depression symptoms."
          recommendations = [
            "Continue with your current wellness routine",
            "Practice self-care activities regularly",
            "Maintain social connections",
            "Consider preventive mental health practices"
          ]
        } else if (totalScore <= 9) {
          severity = "Mild"
          description = "Your responses suggest mild depression symptoms."
          recommendations = [
            "Consider talking to a mental health professional",
            "Practice stress management techniques",
            "Maintain regular exercise and sleep schedule",
            "Connect with supportive friends and family"
          ]
        } else if (totalScore <= 14) {
          severity = "Moderate"
          description = "Your responses suggest moderate depression symptoms."
          recommendations = [
            "Strongly consider professional mental health support",
            "Talk to your primary care provider",
            "Practice daily self-care and stress reduction",
            "Consider joining a support group"
          ]
        } else if (totalScore <= 19) {
          severity = "Moderately Severe"
          description = "Your responses suggest moderately severe depression symptoms."
          recommendations = [
            "Seek professional mental health treatment",
            "Contact a mental health crisis line if needed",
            "Talk to a trusted friend or family member",
            "Consider medication evaluation with a psychiatrist"
          ]
        } else {
          severity = "Severe"
          description = "Your responses suggest severe depression symptoms."
          recommendations = [
            "Seek immediate professional mental health treatment",
            "Contact a mental health crisis line",
            "Consider emergency mental health services",
            "Talk to a trusted person about your feelings"
          ]
        }
        break

      case 'gad7':
        maxScore = 21
        if (totalScore <= 4) {
          severity = "Minimal"
          description = "Your responses suggest minimal anxiety symptoms."
          recommendations = [
            "Continue with your current wellness routine",
            "Practice mindfulness and relaxation techniques",
            "Maintain healthy sleep habits",
            "Consider stress management workshops"
          ]
        } else if (totalScore <= 9) {
          severity = "Mild"
          description = "Your responses suggest mild anxiety symptoms."
          recommendations = [
            "Consider talking to a mental health professional",
            "Practice deep breathing and relaxation exercises",
            "Limit caffeine and alcohol intake",
            "Maintain regular physical activity"
          ]
        } else if (totalScore <= 14) {
          severity = "Moderate"
          description = "Your responses suggest moderate anxiety symptoms."
          recommendations = [
            "Strongly consider professional mental health support",
            "Practice daily anxiety management techniques",
            "Consider cognitive behavioral therapy",
            "Talk to your primary care provider"
          ]
        } else {
          severity = "Severe"
          description = "Your responses suggest severe anxiety symptoms."
          recommendations = [
            "Seek immediate professional mental health treatment",
            "Contact a mental health crisis line if needed",
            "Practice grounding techniques daily",
            "Consider medication evaluation with a psychiatrist"
          ]
        }
        break

      case 'ghq12':
        maxScore = 36
        if (totalScore <= 12) {
          severity = "Good"
          description = "Your responses suggest good psychological well-being."
          recommendations = [
            "Continue maintaining your current lifestyle",
            "Keep practicing stress management techniques",
            "Maintain social connections and hobbies",
            "Consider helping others with their mental health"
          ]
        } else if (totalScore <= 20) {
          severity = "Mild Distress"
          description = "Your responses suggest mild psychological distress."
          recommendations = [
            "Consider talking to a mental health professional",
            "Practice relaxation and mindfulness techniques",
            "Maintain regular sleep and exercise routines",
            "Connect with supportive friends and family"
          ]
        } else {
          severity = "Significant Distress"
          description = "Your responses suggest significant psychological distress."
          recommendations = [
            "Seek professional mental health support",
            "Talk to your primary care provider",
            "Practice daily self-care and stress reduction",
            "Consider joining a support group"
          ]
        }
        break

      case 'cssrs':
        maxScore = 6
        const hasSuicidalIdeation = answers[0] === 1 || answers[1] === 1
        const hasSuicidalBehavior = answers[2] === 1 || answers[3] === 1 || answers[4] === 1 || answers[5] === 1
        
        if (totalScore === 0) {
          severity = "No Risk"
          description = "Your responses suggest no current suicidal ideation or behavior."
          recommendations = [
            "Continue with your current wellness routine",
            "Maintain social connections and support systems",
            "Practice stress management techniques",
            "Seek help if you experience any concerning thoughts"
          ]
        } else if (hasSuicidalBehavior) {
          severity = "High Risk"
          description = "Your responses suggest high risk for suicidal behavior. Please seek immediate help."
          recommendations = [
            "Contact emergency services or a crisis helpline immediately",
            "Go to the nearest emergency room",
            "Tell a trusted person about your thoughts",
            "Remove any means of self-harm from your environment"
          ]
        } else if (hasSuicidalIdeation) {
          severity = "Moderate Risk"
          description = "Your responses suggest moderate risk for suicidal ideation."
          recommendations = [
            "Seek immediate professional mental health support",
            "Contact a mental health crisis line",
            "Talk to a trusted friend or family member",
            "Consider emergency mental health services"
          ]
        } else {
          severity = "Low Risk"
          description = "Your responses suggest low risk for suicidal ideation."
          recommendations = [
            "Continue monitoring your mental health",
            "Practice stress management techniques",
            "Maintain social connections",
            "Seek help if symptoms worsen"
          ]
        }
        break

      case 'pss':
        maxScore = 40
        if (totalScore <= 13) {
          severity = "Low Stress"
          description = "Your responses suggest low perceived stress levels."
          recommendations = [
            "Continue with your current stress management practices",
            "Maintain healthy lifestyle habits",
            "Practice preventive stress management",
            "Consider helping others manage their stress"
          ]
        } else if (totalScore <= 26) {
          severity = "Moderate Stress"
          description = "Your responses suggest moderate perceived stress levels."
          recommendations = [
            "Practice stress management techniques regularly",
            "Consider talking to a mental health professional",
            "Maintain regular exercise and sleep schedule",
            "Learn time management and prioritization skills"
          ]
        } else {
          severity = "High Stress"
          description = "Your responses suggest high perceived stress levels."
          recommendations = [
            "Seek professional mental health support",
            "Practice daily stress reduction techniques",
            "Consider lifestyle changes to reduce stressors",
            "Talk to your primary care provider"
          ]
        }
        break

      case 'who5':
        maxScore = 25
        const percentage = (totalScore / maxScore) * 100
        if (percentage >= 70) {
          severity = "Good Well-being"
          description = "Your responses suggest good mental well-being."
          recommendations = [
            "Continue maintaining your current lifestyle",
            "Keep practicing activities that bring you joy",
            "Maintain social connections and hobbies",
            "Consider helping others improve their well-being"
          ]
        } else if (percentage >= 50) {
          severity = "Moderate Well-being"
          description = "Your responses suggest moderate mental well-being."
          recommendations = [
            "Consider talking to a mental health professional",
            "Practice activities that improve mood and energy",
            "Maintain regular sleep and exercise routines",
            "Connect with supportive friends and family"
          ]
        } else {
          severity = "Poor Well-being"
          description = "Your responses suggest poor mental well-being."
          recommendations = [
            "Seek professional mental health support",
            "Talk to your primary care provider",
            "Practice daily self-care activities",
            "Consider joining a support group"
          ]
        }
        break

      default:
        severity = "Unknown"
        description = "Unable to interpret results."
        recommendations = ["Please consult a mental health professional"]
        maxScore = 0
    }

    setResults({
      form: currentForm,
      score: totalScore,
      severity,
      description,
      recommendations,
      maxScore
    })
    setShowResults(true)
  }

  const startForm = (formType) => {
    setCurrentForm(formType)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setResults(null)
  }

  const resetForm = () => {
    setCurrentForm(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setResults(null)
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal': return 'text-green-600 bg-green-50'
      case 'mild': return 'text-yellow-600 bg-yellow-50'
      case 'moderate': return 'text-orange-600 bg-orange-50'
      case 'moderately severe': return 'text-red-600 bg-red-50'
      case 'severe': return 'text-red-700 bg-red-100'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal': return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'mild': return <Info className="w-6 h-6 text-yellow-600" />
      case 'moderate': return <AlertCircle className="w-6 h-6 text-orange-600" />
      case 'moderately severe': 
      case 'severe': return <AlertCircle className="w-6 h-6 text-red-600" />
      default: return <Info className="w-6 h-6 text-gray-600" />
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
        <div className="max-w-4xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-card"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                {results.form === 'phq9' ? 'PHQ-9 Depression Screening' :
                 results.form === 'gad7' ? 'GAD-7 Anxiety Screening' :
                 results.form === 'ghq12' ? 'GHQ-12 General Health Questionnaire' :
                 results.form === 'cssrs' ? 'C-SSRS Suicide Risk Assessment' :
                 results.form === 'pss' ? 'PSS Perceived Stress Scale' :
                 results.form === 'who5' ? 'WHO-5 Well-Being Index' : 'Assessment'} Results
              </h1>
              <p className="text-secondary-600">
                Your mental health screening results
              </p>
            </div>

            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 p-6 rounded-xl bg-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">{results.score}</div>
                  <div className="text-sm text-secondary-500">Your Score</div>
                </div>
                <div className="text-secondary-400">/</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary-400">{results.maxScore}</div>
                  <div className="text-sm text-secondary-500">Maximum</div>
                </div>
              </div>
            </div>

            {/* Severity Assessment */}
            <div className="mb-8">
              <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-lg ${getSeverityColor(results.severity)}`}>
                {getSeverityIcon(results.severity)}
                <span className="font-semibold">{results.severity} {results.form === 'phq9' ? 'Depression' : 'Anxiety'}</span>
              </div>
              <p className="mt-4 text-secondary-700">{results.description}</p>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-secondary-800 mb-4">Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-primary-25 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-secondary-700">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    This screening tool is for informational purposes only and should not replace professional medical advice. 
                    If you're experiencing severe symptoms or having thoughts of self-harm, please contact a mental health professional 
                    or call a crisis helpline immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetForm}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Take Another Assessment</span>
              </button>
              <button
                onClick={() => window.location.href = '/therapy-booking'}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (currentForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
        <div className="max-w-4xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-card"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary-600">
                  Question {currentQuestion + 1} of {getCurrentQuestions().length}
                </span>
                <span className="text-sm text-secondary-600">
                  {Math.round(((currentQuestion + 1) / getCurrentQuestions().length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / getCurrentQuestions().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-4">
                {getCurrentQuestion()}
              </h2>
              <p className="text-secondary-600 mb-6">
                {currentForm === 'phq9' || currentForm === 'gad7' ? 
                  "Over the last 2 weeks, how often have you been bothered by this problem?" :
                  currentForm === 'ghq12' ? 
                  "Compared to your usual self, how have you been feeling recently?" :
                  currentForm === 'cssrs' ? 
                  "Please answer honestly about your recent thoughts and feelings:" :
                  currentForm === 'pss' ? 
                  "In the last month, how often have you felt this way?" :
                  currentForm === 'who5' ? 
                  "Over the last 2 weeks, how often have you felt this way?" :
                  "Please select the option that best describes your experience:"}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {getAnswerOptions().map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                    answers[currentQuestion] === option.value
                      ? 'border-primary-500 bg-primary-50 scale-105'
                      : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-800">{option.label}</div>
                      <div className="text-sm text-secondary-600">{option.description}</div>
                    </div>
                    <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                      answers[currentQuestion] === option.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-secondary-300'
                    }`}>
                      {answers[currentQuestion] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={resetForm}
                className="text-secondary-600 hover:text-secondary-800"
              >
                Cancel Assessment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
            Mental Health Screening
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Take evidence-based assessments to understand your mental health status. 
            These tools help identify symptoms and guide you toward appropriate support.
          </p>
        </motion.div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {/* PHQ-9 Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">PHQ-9 Depression</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  Patient Health Questionnaire-9 for depression screening over the last 2 weeks.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>9 questions • 5-10 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('phq9')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* GAD-7 Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">GAD-7 Anxiety</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  Generalized Anxiety Disorder-7 for anxiety symptom screening.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>7 questions • 3-5 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('gad7')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* GHQ-12 Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">GHQ-12 General Health</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  General Health Questionnaire-12 for psychological well-being assessment.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>12 questions • 5-8 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('ghq12')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* C-SSRS Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">C-SSRS Suicide Risk</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  Columbia Suicide Severity Rating Scale for suicide risk assessment.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>6 questions • 3-5 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('cssrs')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* PSS Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">PSS Stress Scale</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  Perceived Stress Scale for measuring stress levels over the last month.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>10 questions • 5-7 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('pss')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* WHO-5 Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="floating-card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">WHO-5 Well-Being</h2>
                <p className="text-secondary-600 mb-4 text-sm">
                  WHO-5 Well-Being Index for measuring positive mental health.
                </p>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>5 questions • 2-3 min</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('who5')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="floating-card bg-gradient-to-r from-primary-25 to-accent-25"
        >
          <h2 className="text-2xl font-semibold text-primary-800 mb-6 text-center">
            About These Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Validated Tools</h3>
              <p className="text-sm text-primary-700">
                Both PHQ-9 and GAD-7 are widely used, evidence-based screening tools used by mental health professionals worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Screening Only</h3>
              <p className="text-sm text-primary-700">
                These assessments are for screening purposes only and should not replace professional diagnosis or treatment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Get Help</h3>
              <p className="text-sm text-primary-700">
                If you're experiencing severe symptoms or thoughts of self-harm, please contact a mental health professional immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ScreeningForms
