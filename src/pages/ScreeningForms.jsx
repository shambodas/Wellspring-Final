import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, ArrowRight, ArrowLeft, FileText, Brain, TrendingUp } from 'lucide-react'

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

  const answerOptions = [
    { value: 0, label: "Not at all", description: "0 days" },
    { value: 1, label: "Several days", description: "1-2 days" },
    { value: 2, label: "More than half the days", description: "3-4 days" },
    { value: 3, label: "Nearly every day", description: "5-7 days" }
  ]

  const getCurrentQuestions = () => {
    return currentForm === 'phq9' ? phq9Questions : gad7Questions
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
    
    let severity, description, recommendations

    if (currentForm === 'phq9') {
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
    } else { // GAD-7
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
    }

    setResults({
      form: currentForm,
      score: totalScore,
      severity,
      description,
      recommendations,
      maxScore: questions.length * 3
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
                {results.form === 'phq9' ? 'PHQ-9' : 'GAD-7'} Assessment Results
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
                Over the last 2 weeks, how often have you been bothered by this problem?
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {answerOptions.map((option, index) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                <h2 className="text-2xl font-semibold text-secondary-800 mb-2">PHQ-9 Depression Screening</h2>
                <p className="text-secondary-600 mb-4">
                  The Patient Health Questionnaire-9 is a validated tool for screening depression symptoms. 
                  It assesses how often you've been bothered by various problems over the last 2 weeks.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>9 questions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>5-10 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Evidence-based</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('phq9')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start PHQ-9 Assessment</span>
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
                <h2 className="text-2xl font-semibold text-secondary-800 mb-2">GAD-7 Anxiety Screening</h2>
                <p className="text-secondary-600 mb-4">
                  The Generalized Anxiety Disorder-7 is a validated tool for screening anxiety symptoms. 
                  It measures the severity of anxiety and helps identify when professional help might be needed.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>7 questions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>3-5 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Evidence-based</span>
                  </div>
                </div>
                <button
                  onClick={() => startForm('gad7')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start GAD-7 Assessment</span>
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
