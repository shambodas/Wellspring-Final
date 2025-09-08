import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Users,
  Plus,
  ThumbsUp,
  Share,
  Flag,
  Star,
  Clock,
  Shield,
  Smile,
  Send,
  User,
} from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

const CommunitySupport = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content: "",
    isAnonymous: true,
    category: "support",
  });
  const [showNewPost, setShowNewPost] = useState(false);
  
  // Peer Support states
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newPeerPost, setNewPeerPost] = useState('')
  const [showNewPeerPostForm, setShowNewPeerPostForm] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const categories = [
    { id: "support", name: "Support & Encouragement", color: "bg-blue-100 text-blue-800", icon: Heart },
    { id: "success", name: "Success Stories", color: "bg-green-100 text-green-800", icon: Star },
    { id: "advice", name: "Advice & Tips", color: "bg-purple-100 text-purple-800", icon: MessageCircle },
    { id: "daily", name: "Daily Check-in", color: "bg-yellow-100 text-yellow-800", icon: Smile },
  ];

  const peerCategories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'anxiety', name: 'Anxiety', count: 42 },
    { id: 'depression', name: 'Depression', count: 38 },
    { id: 'stress', name: 'Stress', count: 29 },
    { id: 'relationships', name: 'Relationships', count: 25 },
    { id: 'self-care', name: 'Self-Care', count: 22 }
  ]

  const samplePosts = [
    {
      id: 1,
      author: "Anonymous",
      content:
        "Just wanted to share that I completed my first week of mood tracking! 🎉 It's been really eye-opening to see my patterns. Small steps, but I'm proud of myself.",
      category: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      comments: 8,
      isLiked: false,
      mood: "happy",
    },
    {
      id: 2,
      author: "Mindful_Student",
      content:
        "Having a tough day with exam anxiety. The 4-7-8 breathing technique from the app has been helping, but still feeling overwhelmed. Any other suggestions?",
      category: "support",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 12,
      comments: 15,
      isLiked: true,
      mood: "anxious",
    },
    {
      id: 3,
      author: "WellnessJourney",
      content:
        "Reminder: It's okay to have bad days. It's okay to not be productive. It's okay to rest. Your worth isn't determined by your output. 💜",
      category: "support",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 67,
      comments: 23,
      isLiked: true,
      mood: "supportive",
    },
    {
      id: 4,
      author: "Anonymous",
      content:
        "Daily check-in: Today I practiced gratitude and wrote in my journal. Also had a great conversation with a friend. Feeling more balanced than yesterday. How's everyone doing?",
      category: "daily",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 18,
      comments: 12,
      isLiked: false,
      mood: "grateful",
    },
    {
      id: 5,
      author: "TherapyGrad",
      content:
        "For anyone struggling with negative self-talk: Try the 3-3-3 rule. Name 3 things you see, 3 sounds you hear, and 3 things you can touch. It helps ground you in the present moment.",
      category: "advice",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 45,
      comments: 19,
      isLiked: false,
      mood: "helpful",
    },
  ];

  const peerPosts = [
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

  const communityStats = [
    { label: "Active Members", value: "2,847", icon: Users },
    { label: "Posts This Week", value: "156", icon: MessageCircle },
    { label: "Support Given", value: "1,234", icon: Heart },
    { label: "Success Stories", value: "89", icon: Star },
  ];

  const supportGroups = [
    {
      id: 1,
      name: "Student Support Circle",
      members: 428,
      description: "A safe space for students to share academic stress and support each other",
      isJoined: true,
    },
    {
      id: 2,
      name: "Anxiety & Stress Management",
      members: 672,
      description: "Coping strategies and mutual support for managing anxiety",
      isJoined: false,
    },
    {
      id: 3,
      name: "Daily Gratitude Practice",
      members: 234,
      description: "Share daily gratitudes and positive moments",
      isJoined: true,
    },
    {
      id: 4,
      name: "Mindfulness & Meditation",
      members: 389,
      description: "Discuss mindfulness practices and meditation experiences",
      isJoined: false,
    },
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleNewPost = () => {
    if (!newPost.content.trim()) return;

    const post = {
      id: posts.length + 1,
      author: newPost.isAnonymous ? "Anonymous" : "You",
      content: newPost.content,
      category: newPost.category,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
      mood: "neutral",
    };

    setPosts([post, ...posts]);
    setNewPost({ content: "", isAnonymous: true, category: "support" });
    setShowNewPost(false);
  };

  // Peer Support handlers
  const handlePeerLike = (postId) => {
    console.log('Liked post:', postId)
  }

  const handlePeerReply = (postId, replyContent) => {
    console.log('Reply to post:', postId, replyContent)
  }

  const handleNewPeerPost = () => {
    if (newPeerPost.trim()) {
      console.log('New post:', newPeerPost)
      setNewPeerPost('')
      setShowNewPeerPostForm(false)
    }
  }

  const formatTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatTimeAgo = (timeAgo) => {
    return timeAgo
  }

  const getCategoryData = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      anxious: "😰",
      supportive: "💜",
      grateful: "🙏",
      helpful: "💡",
      neutral: "💭",
    };
    return moodEmojis[mood] || "💭";
  };

  const filteredPeerPosts = selectedCategory === 'all' 
    ? peerPosts 
    : peerPosts.filter(post => post.category === selectedCategory)

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
            {t('community.title')}
          </h1>
          <p className="text-secondary-600">
            {t('community.subtitle')}
          </p>
        </motion.div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="floating-card text-center py-4"
            >
              <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary-800">
                {stat.value}
              </div>
              <div className="text-sm text-secondary-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 shadow-md">
          {[
            { id: "feed", label: "Community Feed", icon: MessageCircle },
            { id: "peer", label: "Peer Support", icon: Users },
            { id: "groups", label: "Support Groups", icon: Users },
            { id: "guidelines", label: "Guidelines", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Community Feed Tab */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* New Post Button */}
                <div className="floating-card">
                  <button
                    onClick={() => setShowNewPost(!showNewPost)}
                    className="w-full p-4 border-2 border-dashed border-secondary-300 rounded-lg text-secondary-600 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t('community.shareSomething')}</span>
                  </button>
                </div>

                {/* New Post Form */}
                {showNewPost && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="floating-card"
                  >
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                      Create a Post
                    </h3>
                    <textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      placeholder="Share your experience, ask for advice, or offer support..."
                      rows={4}
                      className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.isAnonymous}
                            onChange={(e) =>
                              setNewPost({
                                ...newPost,
                                isAnonymous: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          <span className="text-sm text-secondary-600">
                            Post anonymously
                          </span>
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              category: e.target.value,
                            })
                          }
                          className="px-3 py-1 border border-secondary-200 rounded-lg text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowNewPost(false)}
                          className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleNewPost}
                          disabled={!newPost.content.trim()}
                          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          <span>Post</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Posts */}
                <div className="space-y-6">
                  {posts.map((post, index) => (
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
                          {getMoodEmoji(post.mood)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-secondary-800">
                              {post.author}
                            </span>
                            <span className="text-sm text-secondary-500">•</span>
                            <span className="text-sm text-secondary-500">
                              {formatTime(post.timestamp)}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getCategoryData(
                              post.category
                            )?.color}`}
                          >
                            {getCategoryData(post.category)?.name}
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
                                ? "text-red-500 bg-red-50"
                                : "text-secondary-600 hover:text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                post.isLiked ? "fill-current" : ""
                              }`}
                            />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                            <Share className="w-4 h-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="floating-card">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                    Community Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Posts Today</span>
                      <span className="font-semibold text-secondary-800">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Active Now</span>
                      <span className="font-semibold text-secondary-800">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Support Given</span>
                      <span className="font-semibold text-secondary-800">89</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="floating-card">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className="w-full flex items-center justify-between p-3 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-all duration-200"
                      >
                        <span>{category.name}</span>
                        <span className="text-sm bg-secondary-100 px-2 py-1 rounded-full">
                          {Math.floor(Math.random() * 50) + 10}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Guidelines */}
                <div className="floating-card bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">
                      Community Guidelines
                    </h3>
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
          </div>
        )}

        {/* Peer Support Tab */}
        {activeTab === "peer" && (
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
                    {peerCategories.map((category) => (
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
                    onClick={() => setShowNewPeerPostForm(!showNewPeerPostForm)}
                    className="w-full p-4 border-2 border-dashed border-secondary-300 rounded-lg text-secondary-600 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Share your thoughts...</span>
                  </button>
                </div>

                {/* New Post Form */}
                {showNewPeerPostForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="floating-card"
                  >
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">Create a Post</h3>
                    <textarea
                      value={newPeerPost}
                      onChange={(e) => setNewPeerPost(e.target.value)}
                      placeholder="Share your experience, ask for advice, or offer support..."
                      rows={4}
                      className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => setShowNewPeerPostForm(false)}
                        className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNewPeerPost}
                        disabled={!newPeerPost.trim()}
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
                  {filteredPeerPosts.map((post, index) => (
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
                            onClick={() => handlePeerLike(post.id)}
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
        )}

        {activeTab === "groups" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6 text-primary-500" />
              <span>Support Groups</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportGroups.map((group) => (
                <div
                  key={group.id}
                  className="border rounded-lg p-4 flex flex-col justify-between"
                >
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-secondary-600">
                    {group.description}
                  </p>
                  <p className="text-xs text-secondary-400">
                    {group.members} members
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "guidelines" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary-500" />
              <span>Community Guidelines</span>
            </h2>
            <ul className="list-disc list-inside text-sm text-secondary-600 space-y-1">
              <li>Keep all discussions confidential.</li>
              <li>No bullying, harassment, or hate speech.</li>
              <li>Share advice, but avoid medical diagnoses.</li>
              <li>Report inappropriate content to moderators.</li>
              <li>This is a safe space for everyone.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySupport;