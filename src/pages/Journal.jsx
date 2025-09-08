import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Calendar, Edit3, Trash2, Save, X, Tag, Filter, BookOpen, Lock } from 'lucide-react'
import { format, isToday, isYesterday, subDays } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'

const Journal = () => {
  const { t } = useLanguage()
  const [entries, setEntries] = useState([])
  const [isWriting, setIsWriting] = useState(false)
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', tags: [] })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const predefinedTags = [
    { name: 'Gratitude', color: 'bg-green-100 text-green-800' },
    { name: 'Goals', color: 'bg-blue-100 text-blue-800' },
    { name: 'Reflection', color: 'bg-purple-100 text-purple-800' },
    { name: 'Anxiety', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Success', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Challenge', color: 'bg-red-100 text-red-800' },
    { name: 'Learning', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Relationships', color: 'bg-pink-100 text-pink-800' }
  ]

  const journalPrompts = [
    "What are three things I'm grateful for today?",
    "How did I grow or learn something new today?",
    "What challenged me today and how did I handle it?",
    "What would I like to accomplish tomorrow?",
    "What made me feel most alive today?",
    "What emotions did I experience today and why?",
    "What would I tell my younger self about today?",
    "What small victory can I celebrate today?"
  ]

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries).map(entry => ({
        ...entry,
        date: new Date(entry.date)
      })))
    }
  }, [])

  const saveEntry = () => {
    if (!currentEntry.title.trim() && !currentEntry.content.trim()) return

    const newEntry = {
      id: editingId || Date.now(),
      title: currentEntry.title || `Entry ${format(new Date(), 'MMM d, yyyy')}`,
      content: currentEntry.content,
      tags: currentEntry.tags,
      date: new Date(),
      wordCount: currentEntry.content.split(' ').filter(word => word.length > 0).length
    }

    let updatedEntries
    if (editingId) {
      updatedEntries = entries.map(entry => 
        entry.id === editingId ? newEntry : entry
      )
    } else {
      updatedEntries = [newEntry, ...entries]
    }

    setEntries(updatedEntries)
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries))

    // Reset form
    setCurrentEntry({ title: '', content: '', tags: [] })
    setIsWriting(false)
    setEditingId(null)
  }

  const editEntry = (entry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      tags: entry.tags
    })
    setEditingId(entry.id)
    setIsWriting(true)
  }

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries))
    setShowDeleteConfirm(null)
  }

  const addTag = (tagName) => {
    if (!currentEntry.tags.includes(tagName)) {
      setCurrentEntry({
        ...currentEntry,
        tags: [...currentEntry.tags, tagName]
      })
    }
  }

  const removeTag = (tagName) => {
    setCurrentEntry({
      ...currentEntry,
      tags: currentEntry.tags.filter(tag => tag !== tagName)
    })
  }

  const formatEntryDate = (date) => {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM d, yyyy')
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === '' || entry.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getTagColor = (tagName) => {
    const predefinedTag = predefinedTags.find(tag => tag.name === tagName)
    return predefinedTag ? predefinedTag.color : 'bg-gray-100 text-gray-800'
  }

  const allTags = [...new Set(entries.flatMap(entry => entry.tags))]

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
            {t('journal.title')}
          </h1>
          <p className="text-secondary-600">
            {t('journal.subtitle')}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="floating-card text-center py-4">
            <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">{entries.length}</div>
            <div className="text-sm text-secondary-600">{t('journal.totalEntries')}</div>
          </div>
          <div className="floating-card text-center py-4">
            <Edit3 className="w-6 h-6 text-accent-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">
              {entries.reduce((sum, entry) => sum + entry.wordCount, 0)}
            </div>
            <div className="text-sm text-secondary-600">{t('journal.wordsWritten')}</div>
          </div>
          <div className="floating-card text-center py-4">
            <Calendar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">
              {entries.filter(entry => {
                const daysSince = Math.floor((new Date() - entry.date) / (1000 * 60 * 60 * 24))
                return daysSince < 7
              }).length}
            </div>
            <div className="text-sm text-secondary-600">{t('journal.thisWeek')}</div>
          </div>
          <div className="floating-card text-center py-4">
            <Lock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">100%</div>
            <div className="text-sm text-secondary-600">{t('journal.private')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Writing Panel */}
          <div className="lg:col-span-2">
            {!isWriting ? (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="floating-card"
              >
                <div className="text-center py-12">
                  <Edit3 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
                    {t('journal.startWriting')}
                  </h2>
                  <p className="text-secondary-500 mb-6">
                    {t('journal.startWritingDesc')}
                  </p>
                  <button
                    onClick={() => setIsWriting(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t('journal.newEntry')}</span>
                  </button>
                </div>

                {/* Journal Prompts */}
                <div className="border-t border-secondary-100 pt-6">
                  <h3 className="font-semibold text-secondary-800 mb-4">{t('journal.needInspiration')}</h3>
                  <div className="space-y-2">
                    {journalPrompts.slice(0, 4).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentEntry({ title: '', content: prompt + '\n\n', tags: ['Reflection'] })
                          setIsWriting(true)
                        }}
                        className="block w-full text-left p-3 bg-primary-25 hover:bg-primary-50 text-primary-700 rounded-lg transition-all duration-200"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="floating-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-800">
                    {editingId ? t('journal.editEntry') : t('journal.newJournalEntry')}
                  </h2>
                  <button
                    onClick={() => {
                      setIsWriting(false)
                      setCurrentEntry({ title: '', content: '', tags: [] })
                      setEditingId(null)
                    }}
                    className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                  placeholder={t('journal.entryTitlePlaceholder')}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                />

                {/* Content Textarea */}
                <textarea
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  placeholder={t('journal.contentPlaceholder')}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="12"
                />

                {/* Tags Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t('journal.tags')}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentEntry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)} flex items-center space-x-1`}
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-current hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags
                      .filter(tag => !currentEntry.tags.includes(tag.name))
                      .map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => addTag(tag.name)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color} hover:opacity-80 transition-opacity duration-200`}
                        >
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Word Count */}
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-secondary-500">
                    {currentEntry.content.split(' ').filter(word => word.length > 0).length} words
                  </span>
                  <button
                    onClick={saveEntry}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Update' : 'Save'} Entry</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="floating-card"
            >
              <h3 className="font-semibold text-secondary-800 mb-4">Search & Filter</h3>
              
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search entries..."
                  className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Filter by tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All entries</option>
                  {allTags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {!isWriting && (
                <button
                  onClick={() => setIsWriting(true)}
                  className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Entry</span>
                </button>
              )}
            </motion.div>

            {/* Recent Tags */}
            {allTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="floating-card"
              >
                <h3 className="font-semibold text-secondary-800 mb-4">Your Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTag === tag 
                          ? 'bg-primary-500 text-white' 
                          : `${getTagColor(tag)} hover:opacity-80`
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold text-secondary-800 mb-6">
              {searchQuery || selectedTag ? 'Filtered Entries' : 'Your Entries'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="floating-card group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-800 truncate">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-secondary-500">
                        {formatEntryDate(entry.date)} • {entry.wordCount} words
                      </p>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => editEntry(entry)}
                        className="p-1 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(entry.id)}
                        className="p-1 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-secondary-600 text-sm line-clamp-3 mb-3">
                    {entry.content.substring(0, 150)}...
                  </p>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{entry.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  Delete Entry?
                </h3>
                <p className="text-secondary-600 mb-6">
                  This action cannot be undone. Your journal entry will be permanently deleted.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteEntry(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Journal