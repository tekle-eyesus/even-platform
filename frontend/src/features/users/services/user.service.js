import api from "../../../lib/axios";

export const userService = {
  async getUserProfile(username) {
    const response = await api.get(`/users/p/${username}`);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch("/users/update-account", data);
    return response.data;
  },

  async getUserPosts(userId) {
    const response = await api.get("/posts", { params: { author: userId } });
    return response.data;
  },
};
