<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import WorkoutPlanServices from "../services/workoutPlanServices.js";
import WorkoutPlanExerciseServices from "../services/workoutPlanExerciseServices.js";
import Utils from "../config/utils.js";
import ExerciseServices from "../services/exerciseServices.js";

const route = useRoute();
const router = useRouter();
const user = Utils.getStore("user");

const workoutPlanId = route.params.workoutPlanId;
const workoutPlan = ref(null);
const exercises = ref([]);
const allExercises = ref([]); 
const message = ref("");

const showEditModal = ref(false);
const editTitle = ref("");
const editNotes = ref("");
const editScheduledTime = ref("");

async function loadWorkoutPlan() {
  try {
    const planRes = await WorkoutPlanServices.get(workoutPlanId);
    workoutPlan.value = planRes.data;

    editTitle.value = workoutPlan.value.title;
    editNotes.value = workoutPlan.value.notes;
    editScheduledTime.value = workoutPlan.value.scheduledTime;

    // load plan exercises
    const exRes = await WorkoutPlanExerciseServices.getByWorkoutPlan(workoutPlanId);
    let planExercises = exRes.data || [];

    // load master exercise list if not already loaded
    if (allExercises.value.length === 0) {
      const allRes = await ExerciseServices.getAll();
      allExercises.value = allRes.data || [];
    }

    // attach exerciseName manually
    exercises.value = planExercises.map(ex => {
      const match = allExercises.value.find(e => e.id === ex.exerciseId);
      return {
        ...ex,
        exerciseName: match ? match.name : `Exercise ${ex.exerciseId}`
      };
    });
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to load workout plan.";
  }
}

async function toggleCompletion(ex) {
  try {
    if (ex.isCompleted) {
      await WorkoutPlanExerciseServices.update(ex.id, { isCompleted: false });
    } else {
      await WorkoutPlanExerciseServices.markCompleted(ex.id);
    }
    await loadWorkoutPlan();
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to update status.";
  }
}

async function saveEdits() {
  try {
    await WorkoutPlanServices.update(workoutPlanId, {
      title: editTitle.value,
      notes: editNotes.value,
      scheduledTime: editScheduledTime.value
    });
    await loadWorkoutPlan();
    showEditModal.value = false;
    message.value = "Workout plan updated.";
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to update workout plan.";
  }
}

async function deletePlan() {
  try {
    await WorkoutPlanServices.delete(workoutPlanId);
    router.push({ name: "userWorkout" });
  } catch (err) {
    message.value = err?.response?.data?.message || "Failed to delete workout plan.";
  }
}

onMounted(() => {
  loadWorkoutPlan();
});
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        {{ workoutPlan?.title }}
      </v-card-title>
      <v-card-subtitle>
        Start Time: {{ workoutPlan?.scheduledTime }} <br />
        Notes: {{ workoutPlan?.notes }}
      </v-card-subtitle>

      <v-card-text>
        <b>{{ message }}</b>
        <v-list>
          <v-subheader>Exercises</v-subheader>
          <v-list-item v-for="ex in exercises" :key="ex.id">
            <v-row align="center" class="w-100">
              <v-col cols="8">
                <v-list-item-title>{{ ex.exerciseName }}</v-list-item-title>
                <v-list-item-subtitle>
                  Sets: {{ ex.sets }} | Reps: {{ ex.reps }} |
                  Duration: {{ ex.duration }} {{ ex.durationUnit }}
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn
                  :color="ex.isCompleted ? 'success' : 'grey'"
                  @click="toggleCompletion(ex)"
                >
                  {{ ex.isCompleted ? 'Completed' : 'Mark Complete' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions class="d-flex flex-column align-start">
        <div v-if="workoutPlan?.createdByUserId === user.userId">
          <v-btn color="primary" class="mb-2" @click="showEditModal = true">
            Edit Plan
          </v-btn>
          <v-btn color="error" @click="deletePlan">
            Delete Plan
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showEditModal" max-width="600px">
      <v-card>
        <v-card-title>Edit Workout Plan</v-card-title>
        <v-card-text>
          <v-text-field v-model="editTitle" label="Title" />
          <v-text-field v-model="editScheduledTime" label="Scheduled Time" type="time" />
          <v-textarea v-model="editNotes" label="Notes" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEdits">Save</v-btn>
          <v-btn text @click="showEditModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
