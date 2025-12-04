import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/admins");
  },
  get(id) {
    return apiClient.get(`/admins/${id}`);
  },
  create(data) {
    return apiClient.post("/admins", data);
  },
  delete(id) {
    return apiClient.delete(`/admins/${id}`);
  }
};
