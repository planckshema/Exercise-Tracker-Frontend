<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import WorkoutPlanServices from "../services/workoutPlanServices.js";
import WorkoutPlanExerciseServices from "../services/workoutPlanExerciseServices.js";
import CoachServices from "../services/coachServices.js";
import CoachAthleteServices from "../services/coachAthleteServices.js";
import ExerciseServices from "../services/exerciseServices.js";

const user = Utils.getStore("user");

const coach = ref(null);
const athletes = ref([]);
const workouts = ref([]);
const allExercises = ref([]);
const message = ref("View, Edit or Delete Workout Plans");

const showEditModal = ref(false);
const editPlan = ref(null);
const editExercises = ref([]);

function toDisplayTime(hhmmss) {
  if (!hhmmss) return "";
  const [hour, minute] = hhmmss.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getAthleteName(id) {
  const athlete = athletes.value.find(a => a.id === id);
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : `Athlete ${id}`;
}

function displayCompletion(val) {
  return val === 1 ? "Completed" : "Not Completed";
}

const openEditModal = async (plan) => {
  editPlan.value = { ...plan };
  try {
    const res = await WorkoutPlanExerciseServices.getByWorkoutPlan(plan.id);
    editExercises.value = (res.data || []).map(ex => {
      const match = allExercises.value.find(e => e.id === ex.exerciseId);
      return {
        id: ex.id, // ✅ confirmed from your logs
        workoutPlanId: ex.workoutPlanId,
        exerciseId: ex.exerciseId,
        exerciseName: match?.name || `Exercise ${ex.exerciseId}`,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        durationUnit: ex.durationUnit || "mins",
        isCompleted: ex.isCompleted
      };
    });
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load exercises.";
  }
  showEditModal.value = true;
};

const saveWorkout = async () => {
  showEditModal.value = false;
  try {
    await WorkoutPlanServices.update(editPlan.value.id, {
      title: editPlan.value.title,
      scheduledTime: editPlan.value.scheduledTime?.length === 5
        ? editPlan.value.scheduledTime + ":00"
        : editPlan.value.scheduledTime,
      notes: editPlan.value.notes || ""
    });

    for (const ex of editExercises.value) {
      if (!ex.id || typeof ex.id !== "number") {
        console.warn("Skipping update: invalid workoutPlanExercise ID", ex);
        continue;
      }

      const payload = {
        sets: ex.sets === "" ? null : Number(ex.sets),
        reps: ex.reps === "" ? null : Number(ex.reps),
        duration: ex.duration === "" ? null : Number(ex.duration),
        durationUnit: ex.durationUnit || "mins"
      };

      try {
        await WorkoutPlanExerciseServices.update(ex.id, payload);
      } 
      catch (err) {
        // Log but don’t break the loop
        console.error(`Failed to update exercise ${ex.id}`, err);
      }
    }

    message.value = "Workout plan updated!";
    await retrieveWorkouts();
  } catch (err) {
    console.error("Update error:", err);
    message.value = err?.response?.data?.message || "Error updating workout.";
  }
};

const deleteWorkout = async (plan) => {
  try {
    await WorkoutPlanServices.delete(plan.id);
    await retrieveWorkouts();
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to delete workout.";
  }
};

const cancelEdit = async () => {
  showEditModal.value = false;
  await retrieveWorkouts();
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
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load workouts.";
  }
};

const loadExercises = async () => {
  try {
    const res = await ExerciseServices.getAll();
    allExercises.value = res.data || [];
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load exercises.";
  }
};

onMounted(async () => {
  await retrieveWorkouts();
  await loadExercises();
});
</script>


<template>
  <v-container>
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
            <td>{{ toDisplayTime(plan.scheduledTime) }}</td>
            <td>{{ displayCompletion(plan.isCompleted) }}</td>
            <td>
              <v-icon small class="mx-2" @click="openEditModal(plan)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mx-2" @click="deleteWorkout(plan)">
                mdi-trash-can
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="showEditModal" max-width="700px">
      <v-card>
        <v-card-title>Edit Workout Plan</v-card-title>
        <v-card-text>
          <v-text-field v-model="editPlan.title" label="Title" />
          <v-text-field v-model="editPlan.scheduledTime" label="Scheduled Time" type="time" />
          <v-text-field v-model="editPlan.notes" label="Notes" />

          <v-divider class="my-4"></v-divider>
          <h4>Exercises</h4>
          <v-list>
            <v-list-item v-for="ex in editExercises" :key="ex.id">
              <v-list-item-content>
                <v-list-item-title>{{ ex.exerciseName }}</v-list-item-title>
                <v-text-field v-model="ex.sets" label="Sets" type="number" />
                <v-text-field v-model="ex.reps" label="Reps" type="number" />
                <v-text-field v-model="ex.duration" label="Duration" type="number" />
                <v-select
                  v-model="ex.durationUnit"
                  :items="['mins', 'secs', 'hours']"
                  label="Duration Unit"
                />
                <div class="mt-2">
                  <strong>Status:</strong> {{ displayCompletion(ex.isCompleted) }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveWorkout">Save</v-btn>
          <v-btn text @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>