import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coins, Minus, Plus, Zap } from 'lucide-react'

const MindCoinSlider = ({ 
  balance, 
  maxRedeemable, 
  onValueChange, 
  className = '',
  disabled = false 
}) => {
  const [value, setValue] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate maximum redeemable based on balance and maxRedeemable
  const maxValue = Math.min(balance, maxRedeemable)
  const discountAmount = Math.floor(value / 10)
  const finalPrice = Math.max(0, maxRedeemable - discountAmount)

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value)
    }
  }, [value, onValueChange])

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value)
    setValue(newValue)
  }

  const handleIncrement = () => {
    if (value < maxValue) {
      const newValue = Math.min(maxValue, value + 10)
      setValue(newValue)
    }
  }

  const handleDecrement = () => {
    if (value > 0) {
      const newValue = Math.max(0, value - 10)
      setValue(newValue)
    }
  }

  const handleMaxClick = () => {
    setValue(maxValue)
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-semibold text-secondary-800">Apply Mind Coins</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-secondary-600">Available</div>
          <div className="text-lg font-bold text-primary-600">{balance.toLocaleString()}</div>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-secondary-600">Mind Coins to use</span>
          <span className="text-sm font-medium text-secondary-800">{value}</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={maxValue}
            step="10"
            value={value}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            disabled={disabled || maxValue === 0}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          {/* Slider track fill */}
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg pointer-events-none"
            style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
          />
        </div>

        {/* Quick buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrement}
              disabled={disabled || value === 0}
              className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-secondary-600" />
            </button>
            <button
              onClick={handleIncrement}
              disabled={disabled || value >= maxValue}
              className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 text-secondary-600" />
            </button>
          </div>
          
          <button
            onClick={handleMaxClick}
            disabled={disabled || maxValue === 0}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Use Max
          </button>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary-50 rounded-lg p-4"
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary-600">Mind Coins applied:</span>
            <span className="font-medium text-secondary-800">{value}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary-600">Discount amount:</span>
            <span className="font-medium text-green-600">₹{discountAmount}</span>
          </div>
          
          <div className="border-t border-secondary-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-secondary-800">Final price:</span>
              <span className="text-lg font-bold text-primary-600">₹{finalPrice}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info message */}
      {maxValue === 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-orange-700">
              Complete breathing exercises to earn Mind Coins for discounts!
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {balance === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-blue-700">
              You don't have any Mind Coins yet. Start earning by completing breathing exercises!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MindCoinSlider
