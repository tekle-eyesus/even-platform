import api from "../../../lib/axios";

export const postService = {
  // Get all posts with pagination & filters
  async getAllPosts(params = {}) {
    // params can be { page, limit, hub, tag }
    const response = await api.get("/posts", { params });
    return response.data;
  },

  // Get single post
  async getPostBySlug(slug) {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  // Get Trending (for the Hero section)
  async getTrending() {
    const response = await api.get("/analytics/trending");
    return response.data;
  },
};
