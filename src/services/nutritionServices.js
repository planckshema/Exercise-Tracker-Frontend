import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/nutrition-plans");
  },
  get(id) {
    return apiClient.get(`/nutrition-plans/${id}`);
  },
};
