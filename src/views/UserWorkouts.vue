<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import WorkoutPlanServices from "../services/workoutPlanServices.js";
import WorkoutPlanExerciseServices from "../services/workoutPlanExerciseServices.js";
import ExerciseServices from "../services/exerciseServices.js";
import CoachServices from "../services/coachServices.js";
import AthleteServices from "../services/athleteServices.js";

const user = Utils.getStore("user");

const exercises = ref([]);
const selectedExercises = ref([]);
const title = ref("");
const scheduledTime = ref(""); 
const notes = ref("");
const message = ref("");

const showPlanModal = ref(false);
const showExerciseModal = ref(false);
const myWorkouts = ref([]);
const exerciseInputs = ref([]);
const createdPlanId = ref(null);

const coachMatch = ref(null);
const athleteMatch = ref(null);

function setMessage(err, fallback) {
  message.value = err?.response?.data?.message || err?.message || fallback;
}

function toDisplayTime(hhmmss) {
  if (!hhmmss) return "";
  const [hour, minute, second] = hhmmss.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, second);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

async function detectRole() {
  const coachRes = await CoachServices.getAll();
  const athleteRes = await AthleteServices.getAll();
  coachMatch.value = (coachRes.data || []).find(c => c.email === user.email) || null;
  athleteMatch.value = (athleteRes.data || []).find(a => a.email === user.email) || null;
}

async function loadMyWorkouts() {
  try {
    await detectRole();

    let plans = [];

    if (coachMatch.value) {
      const coachPlansRes = await WorkoutPlanServices.getByCoach(coachMatch.value.id);
      plans = (coachPlansRes?.data || []).filter(p => !p.assignedAthleteId);
    } else if (athleteMatch.value) {
      const assignedRes = await WorkoutPlanServices.getByAthlete(athleteMatch.value.id);
      const assignedPlans = assignedRes?.data || [];

      const allRes = await WorkoutPlanServices.getAll();
      const ownPlans = (allRes?.data || []).filter(p => p.createdByUserId === user.userId);

      const merged = [...assignedPlans, ...ownPlans];
      const seen = new Set();
      plans = merged.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    } else {
      message.value = "No coach or athlete record found for this user.";
    }

    for (const plan of plans) {
      try {
        const exRes = await WorkoutPlanExerciseServices.getByWorkoutPlan(plan.id);
        plan.exercises = exRes.data || [];
      } catch (err) {
        plan.exercises = [];
      }
    }

    myWorkouts.value = plans;
  } catch (err) {
    setMessage(err, "Failed to load workouts.");
  }
}


function displayCompletion(plan) {
  if (!plan.exercises || plan.exercises.length === 0) {
    return "No Exercises";
  }
  const allDone = plan.exercises.every(ex => Number(ex.isCompleted) === 1);
  return allDone ? "Completed" : "Not Completed";
}


onMounted(async () => {
  try {
    if (!user?.email) {
      message.value = "No user in store. Please log in again.";
      return;
    }

    const exerciseRes = await ExerciseServices.getAll();
    exercises.value = exerciseRes?.data || [];

    await loadMyWorkouts();
  } catch (err) {
    setMessage(err, "Failed to load data.");
  }
});

function getExerciseName(id) {
  const match = exercises.value.find(e => e.id === id);
  return match ? match.name : `Exercise ${id}`;
}

async function createWorkoutPlan() {
  if (selectedExercises.value.length === 0) {
    message.value = "Please select at least one exercise.";
    return;
  }
  if (!scheduledTime.value) {
    message.value = "Scheduled time is required.";
    return;
  }

  try {
    if (!coachMatch.value && !athleteMatch.value) {
      await detectRole();
    }

    let assignedCoachId = null;
    let assignedAthleteId = null;

    if (coachMatch.value) {
      assignedCoachId = coachMatch.value.id;
      assignedAthleteId = null;
    } else if (athleteMatch.value) {
      assignedCoachId = null;
      assignedAthleteId = athleteMatch.value.id;
    }

    const planRes = await WorkoutPlanServices.create({
      title: title.value.trim(),
      scheduledTime: scheduledTime.value,
      notes: (notes.value || "").trim(),
      assignedCoachId,
      assignedAthleteId,
      createdByUserId: user.userId
    });

    createdPlanId.value = planRes.data.id;

    exerciseInputs.value = selectedExercises.value.map(exId => ({
      exerciseId: exId,
      sets: "",
      reps: "",
      duration: "",
      durationUnit: "mins",
      isCompleted: 0
    }));

    showPlanModal.value = false;
    showExerciseModal.value = true;

    selectedExercises.value = [];
    title.value = "";
    scheduledTime.value = "";
    notes.value = "";
  } catch (err) {
    setMessage(err, "Error creating workout plan.");
  }
}

async function submitExercises() {
  try {
    for (const ex of exerciseInputs.value) {
      await WorkoutPlanExerciseServices.create({
        workoutPlanId: createdPlanId.value,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        durationUnit: ex.durationUnit,
        isCompleted: 0
      });
    }
    message.value = "Exercises saved!";
    showExerciseModal.value = false;
    createdPlanId.value = null;
    exerciseInputs.value = [];

    await loadMyWorkouts();
  } catch (err) {
    setMessage(err, "Error saving exercises.");
  }
}

async function cancelExerciseModal() {
  try {
    if (createdPlanId.value) {
      await WorkoutPlanServices.delete(createdPlanId.value);
    }
    showExerciseModal.value = false;
    createdPlanId.value = null;
    exerciseInputs.value = [];
    message.value = "Workout plan discarded.";
  } catch (err) {
    setMessage(err, "Failed to discard workout plan.");
  }
}
</script>


<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-text>
        <b>{{ message }}</b>
        <v-btn color="primary" @click="showPlanModal = true">
          Add Workout Plan
        </v-btn>
      </v-card-text>

      <v-card-text>
        <div v-if="myWorkouts.length === 0">
          No workout plans yet.
        </div>
        <div v-else>
          <v-row>
            <v-col cols="12" md="6" lg="4" v-for="plan in myWorkouts" :key="plan.id">
              <v-card outlined>
                <v-card-title>{{ plan.title }}</v-card-title>
                <v-card-subtitle>
                  Time: {{ toDisplayTime(plan.scheduledTime) }} <br />
                  Status: {{ displayCompletion(plan) }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-icon small class="mx-2" @click="$router.push({ name: 'myWorkout', params: { workoutPlanId: plan.id } })">
                    mdi-eye
                  </v-icon>
                  <v-icon small class="mx-2" @click="WorkoutPlanServices.delete(plan.id).then(loadMyWorkouts)">
                    mdi-trash-can
                  </v-icon>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showPlanModal" max-width="600px">
      <v-card>
        <v-card-title>Create Workout Plan</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedExercises"
            :items="exercises"
            item-title="name"
            item-value="id"
            label="Select Exercises"
            multiple
          />
          <v-text-field v-model="title" label="Workout Title" />
          <v-text-field v-model="scheduledTime" label="Scheduled Time" type="time" />
          <v-text-field v-model="notes" label="Notes" maxlength="255" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createWorkoutPlan">Save</v-btn>
          <v-btn text @click="showPlanModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showExerciseModal" max-width="650px">
      <v-card>
        <v-card-title>Enter Exercise Details</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="ex in exerciseInputs" :key="ex.exerciseId">
              <v-list-item-content>
                <v-list-item-title>{{ getExerciseName(ex.exerciseId) }}</v-list-item-title>
                <v-text-field v-model="ex.sets" label="Sets" type="number" />
                <v-text-field v-model="ex.reps" label="Reps" type="number" />
                <v-text-field v-model="ex.duration" label="Duration" type="number" />
                <v-select
                  v-model="ex.durationUnit"
                  :items="['mins', 'secs', 'hours']"
                  label="Duration Unit"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitExercises">Submit Exercises</v-btn>
          <v-btn text @click="cancelExerciseModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
