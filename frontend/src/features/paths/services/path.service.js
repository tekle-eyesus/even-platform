import api from "../../../lib/axios";

export const pathService = {
  async getPaths(params = {}) {
    const response = await api.get("/paths", { params });
    return response.data;
  },

  async getPath(pathId) {
    const response = await api.get(`/paths/${pathId}`);
    return response.data;
  },

  async createPath(pathData) {
    const response = await api.post("/paths", pathData);
    return response.data;
  },

  async getMyPaths() {
    const response = await api.get("/paths/me");
    return response.data;
  },

  async getProgress(pathId) {
    const response = await api.get(`/paths/${pathId}/progress`);
    return response.data;
  },

  async updateProgress(pathId, stepId, completed) {
    const response = await api.post(`/paths/${pathId}/progress`, {
      stepId,
      completed,
    });
    return response.data;
  },
};
