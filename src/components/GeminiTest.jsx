import React, { useState } from 'react'
import { testGeminiConnection, generateMentalHealthResponse } from '../services/geminiService.js'

const GeminiTest = () => {
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState('I am feeling anxious today')
  const [response, setResponse] = useState('')

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing connection...')
    
    try {
      const isConnected = await testGeminiConnection()
      setTestResult(isConnected ? '✅ Connection successful!' : '❌ Connection failed')
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMentalHealthResponse = async () => {
    setIsLoading(true)
    setResponse('Generating response...')
    
    try {
      const result = await generateMentalHealthResponse(testMessage, {}, 'anxious')
      setResponse(`Response: ${result.text}\nEmotion: ${result.emotion}`)
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gemini API Test</h2>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
          <p className="mt-2 text-sm">{testResult}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Test Message:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a test message"
          />
        </div>

        <div>
          <button 
            onClick={testMentalHealthResponse}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Test Mental Health Response'}
          </button>
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{response}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeminiTest
