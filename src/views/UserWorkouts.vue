<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import WorkoutPlanServices from "../services/workoutPlanServices.js";
import CoachServices from "../services/coachServices.js";
import CoachAthleteServices from "../services/coachAthleteServices.js";

const router = useRouter();
const user = Utils.getStore("user");

const coach = ref(null);
const athletes = ref([]);
const workouts = ref([]);
const message = ref("View, Edit or Delete Workout Plans");

function getAthleteName(id) {
  const athlete = athletes.value.find(a => a.id === id);
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : `Athlete ${id}`;
}

function displayCompletion(val) {
  return val === 1 ? "Completed" : "Not Completed";
}

const viewWorkout = (plan) => {
  router.push({ name: "viewWorkout", params: { id: plan.id } });
};

const editWorkout = (plan) => {
  router.push({ name: "editWorkout", params: { id: plan.id } });
};

const deleteWorkout = async (plan) => {
  try {
    await WorkoutPlanServices.delete(plan.id);
    await retrieveWorkouts();
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to delete workout.";
  }
};

const retrieveWorkouts = async () => {
  try {
    const coachRes = await CoachServices.getAll();
    coach.value = (coachRes?.data || []).find(c => c.email === user.email);
    if (!coach.value) {
      message.value = "Coach record not found.";
      return;
    }

    const athleteRes = await CoachAthleteServices.getAthletesForCoach(coach.value.id);
    athletes.value = (athleteRes?.data || []).map(rel => rel.athlete || rel);

    const plansRes = await WorkoutPlanServices.getByCoach(coach.value.id);
    workouts.value = (plansRes?.data || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load workouts.";
  }
};

onMounted(() => {
  retrieveWorkouts();
});
</script>



<template>
  <v-container>
    <br /><br />
    <v-card>
      <v-card-title>Workout Plans</v-card-title>
      <v-card-text>
        <b>{{ message }}</b>
      </v-card-text>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-left">Athlete</th>
            <th class="text-left">Scheduled Time</th>
            <th class="text-left">Status</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in workouts" :key="plan.id">
            <td>{{ plan.title }}</td>
            <td>{{ getAthleteName(plan.assignedAthleteId) }}</td>
            <td>{{ plan.scheduledTime }}</td>
            <td>{{ displayCompletion(plan.isCompleted) }}</td>
            <td>
              <v-icon small class="mx-2" @click="editWorkout(plan)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mx-2" @click="viewWorkout(plan)">
                mdi-format-list-bulleted-type
              </v-icon>
              <v-icon small class="mx-2" @click="deleteWorkout(plan)">
                mdi-trash-can
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>
