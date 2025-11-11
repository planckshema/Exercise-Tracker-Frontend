import apiClient from "./services.js";

export default {
  getAllAthletes(coachId) {
    return apiClient.get(`/coachs/${coachId}/athletes`);
  },
  getAthlete(coachId, id) {
    return apiClient.get(`/coachs/${coachId}/athletes/${id}`);
  },
  createAthlete(coachId, data) {
    return apiClient.post(`/coachs/${coachId}/athletes`, data);
  },
  updateAthlete(coachId, id, data) {
    return apiClient.put(`/coachs/${coachId}/athletes/${id}`, data);
  },
  deleteAthlete(coachId, id) {
    return apiClient.delete(`/coachs/${coachId}/athletes/${id}`);
  },
};
