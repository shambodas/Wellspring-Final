import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, PieChart, TrendingUp, Users, Activity, Calendar, Download, 
  Eye, Heart, AlertCircle, Settings, UserPlus, FileText, Shield, 
  MessageSquare, Clock, CheckCircle, XCircle, MoreVertical, Search,
  Filter, Download as DownloadIcon, RefreshCw, Bell, Mail, Phone
} from 'lucide-react'

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [showContentModal, setShowContentModal] = useState(false)

  // Enhanced mock data
  const userStats = {
    totalUsers: 50000,
    activeUsers: 1243,
    newUsers: 156,
    engagementRate: 78.5,
    premiumUsers: 10000,
    therapists: 45,
    avgSessionTime: 23.4,
    retentionRate: 89.2
  }

  const moodData = [
    { name: 'Happy', value: 35, color: '#10b981', trend: '+5%' },
    { name: 'Calm', value: 25, color: '#3b82f6', trend: '+2%' },
    { name: 'Anxious', value: 20, color: '#f59e0b', trend: '-3%' },
    { name: 'Depressed', value: 15, color: '#ef4444', trend: '-1%' },
    { name: 'Stressed', value: 5, color: '#8b5cf6', trend: '+1%' }
  ]

  const stressTrendData = [
    { day: 'Mon', stress: 65, mood: 72, engagement: 45, sessions: 89 },
    { day: 'Tue', stress: 58, mood: 78, engagement: 52, sessions: 94 },
    { day: 'Wed', stress: 72, mood: 65, engagement: 38, sessions: 76 },
    { day: 'Thu', stress: 45, mood: 85, engagement: 67, sessions: 112 },
    { day: 'Fri', stress: 38, mood: 88, engagement: 73, sessions: 128 },
    { day: 'Sat', stress: 42, mood: 82, engagement: 61, sessions: 95 },
    { day: 'Sun', stress: 35, mood: 90, engagement: 55, sessions: 87 }
  ]

  const users = [
    { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', status: 'active', lastActive: '2 min ago', mood: 'Happy', risk: 'low', sessions: 12 }, // North
    { id: 2, name: 'Isha Patel', email: 'isha.patel@example.com', status: 'active', lastActive: '15 min ago', mood: 'Calm', risk: 'low', sessions: 8 }, // West
    { id: 3, name: 'Ritwik Sen', email: 'ritwik.sen@example.com', status: 'inactive', lastActive: '2 days ago', mood: 'Anxious', risk: 'medium', sessions: 5 }, // East
    { id: 4, name: 'Aditya Rao', email: 'aditya.rao@example.com', status: 'active', lastActive: '1 hour ago', mood: 'Happy', risk: 'low', sessions: 15 }, // South
    { id: 5, name: 'Meghna Das', email: 'meghna.das@example.com', status: 'active', lastActive: '3 hours ago', mood: 'Stressed', risk: 'high', sessions: 3 } // Northeast
  ]

  const content = [
    { id: 1, title: 'Meditation Guide', type: 'PDF', status: 'published', views: 1240, downloads: 890, rating: 4.8, lastUpdated: '2 days ago' },
    { id: 2, title: 'Breathing Exercises', type: 'Video', status: 'published', views: 980, downloads: 720, rating: 4.9, lastUpdated: '1 week ago' },
    { id: 3, title: 'CBT Workbook', type: 'PDF', status: 'draft', views: 0, downloads: 0, rating: 0, lastUpdated: '3 days ago' },
    { id: 4, title: 'Sleep Stories', type: 'Audio', status: 'published', views: 890, downloads: 650, rating: 4.6, lastUpdated: '2 weeks ago' }
  ]

  const alerts = [
    { id: 1, type: 'warning', message: '3 users reported high stress levels today', time: '1 hour ago', priority: 'medium' },
    { id: 2, type: 'info', message: 'Meditation resource usage increased by 25%', time: '2 hours ago', priority: 'low' },
    { id: 3, type: 'success', message: 'New user registrations up 15% this week', time: '4 hours ago', priority: 'low' },
    { id: 4, type: 'error', message: 'Payment system experiencing delays', time: '6 hours ago', priority: 'high' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'info': return <Eye className="w-5 h-5 text-blue-600" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'success': return 'border-green-200 bg-green-50'
      case 'error': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
                Admin Dashboard
              </h1>
              <p className="text-secondary-600">
                Comprehensive overview of platform performance and user engagement
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="floating-card p-3 hover:shadow-lg transition-shadow">
                <Bell className="w-5 h-5 text-secondary-600" />
              </button>
              <button className="floating-card p-3 hover:shadow-lg transition-shadow">
                <Settings className="w-5 h-5 text-secondary-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-secondary-100 p-1 rounded-xl">
            {['overview', 'users', 'content', 'analytics', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: userStats.totalUsers, icon: Users, color: 'blue', trend: '+12%' },
                { label: 'Active Users', value: userStats.activeUsers, icon: Activity, color: 'green', trend: '+8%' },
                { label: 'Premium Users', value: userStats.premiumUsers, icon: Heart, color: 'purple', trend: '+15%' },
                { label: 'Engagement Rate', value: `${userStats.engagementRate}%`, icon: TrendingUp, color: 'orange', trend: '+3%' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="floating-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-secondary-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary-800">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Mood Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="floating-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-800">Mood Distribution</h2>
                  <PieChart className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="space-y-4">
                  {moodData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-secondary-700">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-secondary-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${item.value}%`,
                              backgroundColor: item.color
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-secondary-600 w-8">{item.value}%</span>
                        <span className="text-xs text-green-600 font-medium">{item.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Weekly Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="floating-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-800">Weekly Trends</h2>
                  <div className="flex space-x-2">
                    {['week', 'month'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          selectedPeriod === period
                            ? 'bg-primary-500 text-white'
                            : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {stressTrendData.map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-secondary-600 w-8">{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-secondary-500">Stress</span>
                            <div className="w-16 bg-secondary-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  day.stress >= 70 ? 'bg-red-500' : 
                                  day.stress >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${day.stress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-secondary-600">
                              {day.stress}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-secondary-500">Mood</span>
                            <div className="w-16 bg-secondary-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  day.mood >= 80 ? 'bg-green-500' : 
                                  day.mood >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${day.mood}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-secondary-600">
                              {day.mood}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-secondary-500">Sessions</span>
                            <span className="text-xs font-medium text-secondary-600">
                              {day.sessions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Alerts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="floating-card mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-800">System Alerts</h2>
                <AlertCircle className="w-6 h-6 text-primary-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-800">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-secondary-600">{alert.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-800">User Management</h2>
              <button 
                onClick={() => setShowUserModal(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                <Filter className="w-5 h-5 text-secondary-600" />
              </button>
              <button className="p-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                <DownloadIcon className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Last Active</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Mood</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Risk Level</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Sessions</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-800">{user.name}</p>
                          <p className="text-sm text-secondary-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-secondary-600">{user.lastActive}</td>
                      <td className="py-3 px-4 text-sm text-secondary-600">{user.mood}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(user.risk)}`}>
                          {user.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-secondary-600">{user.sessions}</td>
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-secondary-100 rounded">
                          <MoreVertical className="w-4 h-4 text-secondary-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-800">Content Management</h2>
              <button 
                onClick={() => setShowContentModal(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Add Content</span>
              </button>
            </div>

            {/* Content Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Status</th>
                    <th className="text-center py-3 px-4 text-secondary-600 font-medium">Views</th>
                    <th className="text-center py-3 px-4 text-secondary-600 font-medium">Downloads</th>
                    <th className="text-center py-3 px-4 text-secondary-600 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Last Updated</th>
                    <th className="text-left py-3 px-4 text-secondary-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-medium text-secondary-800">{item.title}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-sm">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-secondary-600">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-secondary-600">{item.downloads.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        {item.rating > 0 ? (
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-secondary-600">{item.rating}</span>
                          </div>
                        ) : (
                          <span className="text-secondary-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-secondary-600">{item.lastUpdated}</td>
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-secondary-100 rounded">
                          <MoreVertical className="w-4 h-4 text-secondary-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="floating-card">
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800">Growth Rate</h3>
                  <p className="text-3xl font-bold text-blue-600">+23.5%</p>
                  <p className="text-sm text-secondary-600 mt-2">vs last month</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800">User Retention</h3>
                  <p className="text-3xl font-bold text-green-600">89.2%</p>
                  <p className="text-sm text-secondary-600 mt-2">30-day retention</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800">Satisfaction</h3>
                  <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-sm text-secondary-600 mt-2">Average rating</p>
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="floating-card">
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">Resource Usage</h2>
              <div className="space-y-4">
                {[
                  { name: 'Meditation', views: 1240, downloads: 890, rating: 4.8, trend: '+15%' },
                  { name: 'Breathing Exercises', views: 980, downloads: 720, rating: 4.9, trend: '+8%' },
                  { name: 'CBT Guide', views: 1560, downloads: 1100, rating: 4.7, trend: '+12%' },
                  { name: 'Sleep Stories', views: 890, downloads: 650, rating: 4.6, trend: '+5%' }
                ].map((resource, index) => (
                  <div key={resource.name} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-800">{resource.name}</h4>
                        <p className="text-sm text-secondary-600">{resource.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-secondary-600">Downloads</p>
                        <p className="font-medium text-secondary-800">{resource.downloads.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-secondary-600">Rating</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-secondary-800">{resource.rating}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-secondary-600">Trend</p>
                        <p className="text-green-600 font-medium">{resource.trend}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="floating-card">
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">Generate Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'User Engagement Report', icon: Users, description: 'Detailed analysis of user activity and engagement patterns' },
                  { title: 'Content Performance', icon: FileText, description: 'Comprehensive overview of content usage and effectiveness' },
                  { title: 'Mental Health Trends', icon: Heart, description: 'Analysis of mood patterns and stress levels over time' },
                  { title: 'Revenue Analytics', icon: TrendingUp, description: 'Financial performance and subscription metrics' },
                  { title: 'System Health', icon: Activity, description: 'Platform performance and technical metrics' },
                  { title: 'Custom Report', icon: BarChart3, description: 'Create a custom report with your specific criteria' }
                ].map((report, index) => (
                  <div key={report.title} className="p-6 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <report.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-secondary-800 mb-2">{report.title}</h3>
                    <p className="text-sm text-secondary-600 mb-4">{report.description}</p>
                    <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Generate Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
