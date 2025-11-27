import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exercises");
  },
  getAllForCategory(categoryId) {
    return apiClient.get(`/exercises/category/${categoryId}`);
  },
  get(id) {
    return apiClient.get(`/exercises/${id}`);
  },
  create(categoryId, data) {
    return apiClient.post(`/exercises/category/${categoryId}`, data);
  },
  update(id, data) {
    return apiClient.put(`/exercises/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/exercises/${id}`);
  },
};
