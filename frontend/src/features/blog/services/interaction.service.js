import api from "../../../lib/axios";

export const interactionService = {
  async toggleLike(postId, type = "like") {
    const response = await api.post(`/likes/${postId}`, { type });
    return response.data;
  },
  async getLikeStatus(postId) {
    const response = await api.get(`/likes/${postId}/status`);
    return response.data;
  },

  // --- BOOKMARKS ---
  async toggleBookmark(postId) {
    const response = await api.post(`/bookmarks/${postId}`);
    return response.data;
  },
  async getBookmarkStatus(postId) {
    const response = await api.get(`/bookmarks/${postId}/status`);
    return response.data;
  },

  async toggleFollow(userId) {
    const response = await api.post(`/subscriptions/users/${userId}`);
    return response.data;
  },

  async getBookmarkedPosts() {
    const response = await api.get("/bookmarks");
    return response.data;
  },

  async getShareLinks(postId) {
    const response = await api.post(`/share/${postId}`);
    return response.data;
  },
};
