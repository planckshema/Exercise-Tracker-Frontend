import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exercise-sets");
  },
  get(id) {
    return apiClient.get(`/exercise-sets/${id}`);
  },
};
