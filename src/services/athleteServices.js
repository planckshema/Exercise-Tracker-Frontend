import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/athletes");
  },
  getAllForUser(email) {
    return apiClient.get("/athletes/userTut/" + email);
  },
  get(id) {
    return apiClient.get(`/athletes/${id}`);
  },
  create(data) {
    return apiClient.post("/athletes", data);
  },
  update(id, data) {
    return apiClient.put(`/athletes/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/athletes/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/athletes`);
  },

};
