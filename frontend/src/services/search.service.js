import api from "../lib/axios";

export const searchService = {
  async search(query) {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
