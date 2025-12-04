<script setup>
import { ref, onMounted } from "vue";
import ExerciseServices from "../services/exerciseServices.js";
import CoachServices from "../services/coachServices.js";
import CoachAthleteServices from "../services/coachAthleteServices.js";
import WorkoutPlanServices from "../services/workoutPlanServices.js";
import WorkoutPlanExerciseServices from "../services/workoutPlanExerciseServices.js";
import Utils from "../config/utils.js";

const user = Utils.getStore("user");
const coach = ref(null);
const athletes = ref([]);
const exercises = ref([]);
const selectedAthlete = ref(null);
const selectedExercises = ref([]);
const title = ref("");
const scheduledTime = ref(""); 
const notes = ref("");
const message = ref("");

const showPlanModal = ref(false);
const showExerciseModal = ref(false);
const todaysWorkouts = ref([]);
const exerciseInputs = ref([]);
const createdPlanId = ref(null);

function setMessage(err, fallback) {
  message.value = err?.response?.data?.message || err?.message || fallback;
}

function toDisplayTime(hhmmss) {
  if (!hhmmss) return "";
  const [hour, minute, second] = hhmmss.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, second);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}


async function loadTodaysWorkouts() {
  try {
    const plansRes = await WorkoutPlanServices.getByCoach(coach.value.id);
    todaysWorkouts.value = (plansRes?.data || []).filter(plan => {
      const ts = plan?.scheduledTime;
      if (!ts) return false;
      if (!plan.assignedCoachId || !plan.assignedAthleteId) return false;

      const parts = ts.split(":").map(Number);
      if (parts.length !== 3) return false;
      const [hour, minute, second] = parts;
      const totalSeconds = hour * 3600 + minute * 60 + second;
      return totalSeconds < 86400;
    });
  } catch (err) {
    setMessage(err, "Failed to load workouts.");
  }
}


function getAthleteName(id) {
  const athlete = athletes.value.find(a => a.id === id);
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : `Athlete ${id}`;
}

function displayCompletion(val) {
  return val === 1 ? "Completed" : "Not Completed";
}

onMounted(async () => {
  try {
    if (!user?.email) {
      message.value = "No user in store. Please log in again.";
      return;
    }

    const coachRes = await CoachServices.getAll();
    coach.value = (coachRes?.data || []).find(c => c.email === user.email);
    if (!coach.value) {
      message.value = "Coach record not found for this user.";
      return;
    }

    const athleteRes = await CoachAthleteServices.getAthletesForCoach(coach.value.id);
    athletes.value = (athleteRes?.data || []).map(rel => rel.athlete || rel);

    const exerciseRes = await ExerciseServices.getAll();
    exercises.value = exerciseRes?.data || [];

    await loadTodaysWorkouts();
  } catch (err) {
    setMessage(err, "Failed to load data.");
  }
});

function getExerciseName(id) {
  const match = exercises.value.find(e => e.id === id);
  return match ? match.name : `Exercise ${id}`;
}

async function assignWorkout() {
  if (!selectedAthlete.value || selectedExercises.value.length === 0) {
    message.value = "Please select an athlete and at least one exercise.";
    return;
  }
  if (!coach.value) {
    message.value = "Coach not found for this user.";
    return;
  }
  if (!scheduledTime.value) {
    message.value = "Scheduled time is required.";
    return;
  }

  try {
    const hhmmss = toDisplayTime(scheduledTime.value);
    const planRes = await WorkoutPlanServices.create({
      title: title.value.trim(),
      scheduledTime: hhmmss,
      createdByUserId: user.userId,
      assignedAthleteId: selectedAthlete.value,
      assignedCoachId: coach.value.id,
      notes: (notes.value || "").trim()
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

    selectedAthlete.value = null;
    selectedExercises.value = [];
    title.value = "";
    scheduledTime.value = "";
    notes.value = "";
  } catch (err) {
    setMessage(err, "Error assigning workout.");
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

    await loadTodaysWorkouts();
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
        <v-btn color="primary" type="button" @click="showPlanModal = true">Assign Workout Plan</v-btn>
      </v-card-text>

      <v-card-text>
        <div v-if="todaysWorkouts.length === 0">
          No scheduled workouts today.
        </div>
        <div v-else>
          <v-list>
            <v-subheader>Today's Workouts</v-subheader>
            <v-list-item v-for="plan in todaysWorkouts" :key="plan.id">
              <v-list-item-content>
                <v-list-item-title>{{ plan.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  Athlete: {{ getAthleteName(plan.assignedAthleteId) }} |
                  Time: {{ toDisplayTime(plan.scheduledTime) }} |
                  Status: {{ displayCompletion(plan.isCompleted) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-list>
        </div>
      </v-card-text>

      <v-card-text>
        <v-list>
          <v-subheader>My Athletes</v-subheader>
          <v-list-item v-for="athlete in athletes" :key="athlete.id">
            <v-list-item-content>
              <v-list-item-title>{{ athlete.firstName }} {{ athlete.lastName }}</v-list-item-title>
              <v-list-item-subtitle>{{ athlete.email }} | {{ athlete.sport }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showPlanModal" max-width="600px">
      <v-card>
        <v-card-title>Assign Workout Plan</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedAthlete"
            :items="athletes"
            item-title="firstName"
            item-value="id"
            label="Select Athlete"
          />
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
          <v-btn color="primary" type="button" @click="assignWorkout">Save</v-btn>
          <v-btn text type="button" @click="showPlanModal = false">Cancel</v-btn>
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
          <v-btn color="primary" type="button" @click="submitExercises">Submit Exercises</v-btn>
          <v-btn text type="button" @click="cancelExerciseModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
