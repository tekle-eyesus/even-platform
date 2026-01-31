import api from "../../../lib/axios";

export const hubService = {
  async getAllHubs() {
    const response = await api.get("/hubs");
    return response.data;
  },
};
