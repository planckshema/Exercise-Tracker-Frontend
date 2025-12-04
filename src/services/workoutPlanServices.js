import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/workoutPlans");
  },
  get(id) {
    return apiClient.get(`/workoutPlans/${id}`);
  },
  create(data) {
    return apiClient.post("/workoutPlans", data);
  },
  update(id, data) {
    return apiClient.put(`/workoutPlans/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/workoutPlans/${id}`);
  },
  getByCoach(coachId) {
    return apiClient.get(`/workoutPlans/coach/${coachId}`);
  },
  getByAthlete(athleteId) {
    return apiClient.get(`/workoutPlans/athlete/${athleteId}`);
  }
};
