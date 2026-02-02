import api from "../../../lib/axios";

export const commentService = {
  async getPostComments(postId) {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  },

  // Get Replies for a specific comment
  async getReplies(commentId) {
    const response = await api.get(`/comments/replies/${commentId}`);
    return response.data;
  },

  // Add Comment (or Reply)
  async addComment(postId, content, parentCommentId = null) {
    const payload = { content };
    if (parentCommentId) payload.parentCommentId = parentCommentId;

    const response = await api.post(`/comments/${postId}`, payload);
    return response.data;
  },

  // Toggle Clap
  async toggleClap(commentId) {
    const response = await api.post(`/comments/clap/${commentId}`);
    return response.data;
  },
};
