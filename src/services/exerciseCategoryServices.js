import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exerciseCategories");
  },
  get(id) {
    return apiClient.get(`/exerciseCategories/${id}`);
  },
  create(data) {
    return apiClient.post("/exerciseCategories", data);
  },
  update(id, data) {
    return apiClient.put(`/exerciseCategories/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/exerciseCategories/${id}`);
  },
  deleteAll() {
    return apiClient.delete("/exerciseCategories");
  },
};

