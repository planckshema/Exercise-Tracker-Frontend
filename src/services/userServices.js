import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/users");
  },
  delete(id) {
    return apiClient.delete(`/users/${id}`);
  }
};
