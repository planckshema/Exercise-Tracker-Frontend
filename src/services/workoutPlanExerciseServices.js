import apiClient from "./services.js";

export default {
  getByWorkoutPlan(workoutPlanId) {
    return apiClient.get(`/workoutPlanExercises/plan/${workoutPlanId}`);
  },
  get(id) {
    return apiClient.get(`/workoutPlanExercises/${id}`);
  },
  create(data) {
    return apiClient.post("/workoutPlanExercises", data);
  },
  update(id, data) {
    return apiClient.put(`/workoutPlanExercises/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/workoutPlanExercises/${id}`);
  },
  markCompleted(id) {
    return apiClient.patch(`/workoutPlanExercises/${id}/complete`);
  }
};
