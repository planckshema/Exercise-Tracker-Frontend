<script setup>
import { ref, onMounted } from "vue";
import CoachServices from "../services/coachServices.js";
import CoachAthleteServices from "../services/coachAthleteServices.js";
import Utils from "../config/utils.js";

const user = Utils.getStore("user");
const coaches = ref([]);
const message = ref("My Coaches");

// Load all coaches for this athlete
async function loadCoaches() {
  try {
    // Get all coach relationships for this athlete
    const res = await CoachAthleteServices.getCoachesForAthlete(user.userId);
    // Normalize: each rel may have a `coach` object or just coachId
    coaches.value = (res?.data || []).map(rel => rel.coach || rel);
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load coaches.";
  }
}

// Remove coach relationship
async function removeCoach(coachId) {
  try {
    // use the delete method defined in your service
    await CoachAthleteServices.delete(coachId, user.userId);
    message.value = "Coach removed.";
    await loadCoaches();
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to remove coach.";
  }
}

onMounted(() => {
  loadCoaches();
});
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        My Coaches
      </v-card-title>

      <v-card-text>
        <b>{{ message }}</b>
        <div v-if="coaches.length === 0">
          No coaches assigned.
        </div>
        <div v-else>
          <v-list>
            <v-subheader>My Coaches</v-subheader>
            <v-list-item v-for="coach in coaches" :key="coach.id">
              <v-list-item-content>
                <v-list-item-title>
                  {{ coach.firstName }} {{ coach.lastName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ coach.email }} | {{ coach.sport }} | {{ coach.role }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="error" @click="removeCoach(coach.id)">
                  Remove
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>