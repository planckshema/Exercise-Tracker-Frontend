import apiClient from "./services.js";

export default {

  create(data) {
  return apiClient.post("/coachAthletes", data);
  }, 

  update(coachId, athleteId, data) {
    return apiClient.put(`/coachAthletes/${coachId}/${athleteId}`, data);
  },

  delete(coachId, athleteId) {
    return apiClient.delete(`/coachAthletes/${coachId}/${athleteId}`);
  },

  getAthletesForCoach(coachId) {
    return apiClient.get(`/coachAthletes/coach/${coachId}`);
  },

  getCoachesForAthlete(athleteId) {
    return apiClient.get(`/coachAthletes/athlete/${athleteId}`);
  },

};
