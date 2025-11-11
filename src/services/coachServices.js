import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/coachs");
  },
  getAllForUser(userId) {
    return apiClient.get("/coachs/userTut/" + userId);
  },
  get(id) {
    return apiClient.get(`/coachs/${id}`);
  },
  create(data) {
    return apiClient.post("/coachs", data);
  },
  update(id, data) {
    return apiClient.put(`/coachs/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/coachs/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/coachs`);
  },

};
