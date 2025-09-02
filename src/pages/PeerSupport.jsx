import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Heart, Share, Send, Users, Shield, Clock, User } from 'lucide-react'

const PeerSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newPost, setNewPost] = useState('')
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const categories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'anxiety', name: 'Anxiety', count: 42 },
    { id: 'depression', name: 'Depression', count: 38 },
    { id: 'stress', name: 'Stress', count: 29 },
    { id: 'relationships', name: 'Relationships', count: 25 },
    { id: 'self-care', name: 'Self-Care', count: 22 }
  ]

  const posts = [
    {
      id: 1,
      author: 'Anonymous',
      avatar: '🌸',
      content: "Having a really tough day today. Anxiety is through the roof and I can't seem to calm down. Anyone else feeling this way?",
      category: 'anxiety',
      likes: 24,
      replies: 8,
      timeAgo: '2 hours ago',
      isLiked: false,
      repliesList: [
        { id: 1, author: 'Anonymous', avatar: '🌿', content: "I totally understand. Try taking deep breaths - 4 counts in, 4 counts out. It helps me.", timeAgo: '1 hour ago', likes: 12 },
        { id: 2, author: 'Anonymous', avatar: '💙', content: "You're not alone. I've been there too. Remember to be kind to yourself today.", timeAgo: '45 min ago', likes: 18 },
        { id: 3, author: 'Anonymous', avatar: '🌟', content: "Have you tried the 5-4-3-2-1 grounding technique? It really helps me when I'm overwhelmed.", timeAgo: '30 min ago', likes: 15 }
      ]
    },
    {
      id: 2,
      author: 'Anonymous',
      avatar: '🌙',
      content: "Finally had a good night's sleep after weeks of insomnia! Small victories matter. What's your small win today?",
      category: 'self-care',
      likes: 31,
      replies: 12,
      timeAgo: '4 hours ago',
      isLiked: true,
      repliesList: [
        { id: 1, author: 'Anonymous', avatar: '☀️', content: "That's amazing! Sleep is so important. My small win was actually eating breakfast today.", timeAgo: '3 hours ago', likes: 8 },
        { id: 2, author: 'Anonymous', avatar: '🌈', content: "I went for a 10-minute walk outside. Fresh air really helped clear my mind.", timeAgo: '2 hours ago', likes: 14 }
      ]
    },
    {
      id: 3,
      author: 'Anonymous',
      avatar: '🌧️',
      content: "Feeling really down today. Depression is hitting hard and I don't know how to get out of this funk. Any advice?",
      category: 'depression',
      likes: 19,
      replies: 15,
      timeAgo: '6 hours ago',
      isLiked: false,
      repliesList: [
        { id: 1, author: 'Anonymous', avatar: '💪', content: "One day at a time. Sometimes just getting out of bed is a victory. You're doing great.", timeAgo: '5 hours ago', likes: 22 },
        { id: 2, author: 'Anonymous', avatar: '🎨', content: "Try doing something creative, even if it's just coloring. It helps distract my mind.", timeAgo: '4 hours ago', likes: 11 },
        { id: 3, author: 'Anonymous', avatar: '🌱', content: "Remember that this feeling is temporary. You've gotten through this before and you will again.", timeAgo: '3 hours ago', likes: 19 }
      ]
    },
    {
      id: 4,
      author: 'Anonymous',
      avatar: '⚡',
      content: "Work stress is overwhelming me. How do you all manage work-life balance? I feel like I'm drowning in deadlines.",
      category: 'stress',
      likes: 27,
      replies: 9,
      timeAgo: '8 hours ago',
      isLiked: false,
      repliesList: [
        { id: 1, author: 'Anonymous', avatar: '📝', content: "I make lists and prioritize. Sometimes just writing everything down helps me feel more in control.", timeAgo: '7 hours ago', likes: 16 },
        { id: 2, author: 'Anonymous', avatar: '🧘', content: "I set boundaries - no work emails after 6 PM. It's hard at first but really helps.", timeAgo: '6 hours ago', likes: 13 }
      ]
    },
    {
      id: 5,
      author: 'Anonymous',
      avatar: '💕',
      content: "Had a really good conversation with my partner today. Communication really is key in relationships. Feeling grateful.",
      category: 'relationships',
      likes: 33,
      replies: 6,
      timeAgo: '12 hours ago',
      isLiked: true,
      repliesList: [
        { id: 1, author: 'Anonymous', avatar: '💖', content: "That's beautiful! Open communication is so important. Happy for you!", timeAgo: '11 hours ago', likes: 9 },
        { id: 2, author: 'Anonymous', avatar: '🤝', content: "It's amazing how much better things feel when we actually talk about our feelings.", timeAgo: '10 hours ago', likes: 7 }
      ]
    }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const handleLike = (postId) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId)
  }

  const handleReply = (postId, replyContent) => {
    // In a real app, this would send to backend
    console.log('Reply to post:', postId, replyContent)
  }

  const handleNewPost = () => {
    if (newPost.trim()) {
      // In a real app, this would send to backend
      console.log('New post:', newPost)
      setNewPost('')
      setShowNewPostForm(false)
    }
  }

  const formatTimeAgo = (timeAgo) => {
    return timeAgo
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
            Peer Support Community
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Connect with others who understand. Share your experiences, find support, and know you're not alone in your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Community Stats */}
              <div className="floating-card">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-800">Community</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Active Members</span>
                    <span className="font-semibold text-secondary-800">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Posts Today</span>
                    <span className="font-semibold text-secondary-800">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Support Given</span>
                    <span className="font-semibold text-secondary-800">156</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="floating-card">
                <h3 className="text-lg font-semibold text-secondary-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-secondary-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Guidelines */}
              <div className="floating-card bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Community Guidelines</h3>
                </div>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Be kind and supportive</p>
                  <p>• Respect everyone's privacy</p>
                  <p>• No medical advice</p>
                  <p>• Report concerning posts</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* New Post Button */}
              <div className="floating-card">
                <button
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="w-full p-4 border-2 border-dashed border-secondary-300 rounded-lg text-secondary-600 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Share your thoughts...</span>
                </button>
              </div>

              {/* New Post Form */}
              {showNewPostForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="floating-card"
                >
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4">Create a Post</h3>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your experience, ask for advice, or offer support..."
                    rows={4}
                    className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowNewPostForm(false)}
                      className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNewPost}
                      disabled={!newPost.trim()}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Posts */}
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="floating-card"
                  >
                    {/* Post Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-secondary-800">{post.author}</span>
                          <span className="text-sm text-secondary-500">•</span>
                          <span className="text-sm text-secondary-500">{formatTimeAgo(post.timeAgo)}</span>
                        </div>
                        <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-secondary-700 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            post.isLiked
                              ? 'text-red-500 bg-red-50'
                              : 'text-secondary-600 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.replies}</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {selectedPost === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-secondary-100"
                      >
                        <h4 className="font-medium text-secondary-800 mb-3">Replies</h4>
                        <div className="space-y-4">
                          {post.repliesList.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center text-sm">
                                {reply.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-secondary-800">{reply.author}</span>
                                  <span className="text-xs text-secondary-500">{formatTimeAgo(reply.timeAgo)}</span>
                                </div>
                                <p className="text-sm text-secondary-700 mb-2">{reply.content}</p>
                                <button className="text-xs text-secondary-500 hover:text-primary-600 transition-colors duration-200">
                                  Like • {reply.likes}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeerSupport
