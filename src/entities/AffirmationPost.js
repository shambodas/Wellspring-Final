export const AffirmationPost = {
  async list(_sort = null, limit = null) {
    const posts = JSON.parse(localStorage.getItem("affirmationPosts") || "[]");
    if (limit) return posts.slice(0, limit);
    return posts;
  },

  async create(post) {
    const posts = JSON.parse(localStorage.getItem("affirmationPosts") || "[]");
    const newPost = { id: Date.now().toString(), author: "Anonymous", likes: 0, ...post };
    posts.unshift(newPost);
    localStorage.setItem("affirmationPosts", JSON.stringify(posts));
    return newPost;
  },

  async update(id, updatedFields) {
    const posts = JSON.parse(localStorage.getItem("affirmationPosts") || "[]");
    const idx = posts.findIndex((p) => p.id === id || p.id == id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...updatedFields };
      localStorage.setItem("affirmationPosts", JSON.stringify(posts));
      return posts[idx];
    }
    return null;
  }
};
