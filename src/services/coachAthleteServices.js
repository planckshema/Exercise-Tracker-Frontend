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


   getAllAthletesForCoach(coachId) {
    return apiClient.get(`/coachAthletes/coach/${coachId}/all`);
  },

  // Get pending requests for a coach (athletes requesting to be coached)
  getPendingCoachRequests(coachId) {
    return apiClient.get(`/coachAthletes/coach/${coachId}/pending`);
  },

  // Get pending requests for an athlete (coaches requesting to coach)
  getPendingAthleteRequests(athleteId) {
    return apiClient.get(`/coachAthletes/athlete/${athleteId}/pending`);
  },

  // Accept a request
  acceptRequest(coachId, athleteId) {
    return apiClient.put(`/coachAthletes/${coachId}/${athleteId}/accept`);
  },

  // Reject a request
  rejectRequest(coachId, athleteId) {
    return apiClient.delete(`/coachAthletes/${coachId}/${athleteId}/reject`);
  },
};
