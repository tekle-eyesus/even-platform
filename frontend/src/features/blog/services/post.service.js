import apiClient from "../../../lib/axios";

export const postService = {
    async getAllPosts(params = {}) {
        // params: { page, limit, hub, author, tag }
        const response = await apiClient.get("/posts", { params });
        // Backend returns structure: { statusCode, data: { posts, pagination }, message, success }
        return response.data;
    },

    async getPostBySlug(slug) {
        const response = await apiClient.get(`/posts/${slug}`);
        return response.data;
    },

    async createPost(postData) {
        const response = await apiClient.post("/posts", postData);
        return response.data;
    },

    // ... update, delete etc.
};
