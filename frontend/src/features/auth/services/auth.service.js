import api from "../../../lib/axios";

export const authService = {
  // Register
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get Current User (for persistence on refresh)
  async getCurrentUser() {
    const response = await api.get("/users/me");
    return response.data;
  },
};
