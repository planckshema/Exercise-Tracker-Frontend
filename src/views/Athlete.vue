<script setup>
import { ref, onMounted } from "vue";
import AthleteServices from "../services/athleteServices";
import CoachAthleteServices from "../services/coachAthleteServices";
import Utils from "../config/utils.js";

const user = Utils.getStore("user");
const pageTitle = ref("Coach Dashboard");
const athletesToday = ref([]);
const message = ref("");

// Format: YYYY-MM-DD for comparison
const todayISO = new Date().toISOString().split("T")[0];

// Format: "Friday, November 8" for display
const todayDisplay = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
});

// Fetch and filter athlete workouts
const retrieveAthletes = async () => {
  try {
    const response = await AthleteServices.getAllAthletes(user.userId);
    const allAthletes = response.data;

    athletesToday.value = allAthletes
      .flatMap((athlete) =>
        athlete.workouts
          ?.filter((w) => w.date === todayISO)
          .map((w) => ({
            name: athlete.name,
            time: w.time,
            duration: w.duration,
            type: w.type
          }))
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  } catch (e) {
    message.value = e.response?.data?.message || "Failed to load athlete data.";
  }
};


const getColor = (index) => {
  const colors = ["blue", "green", "grey"];
  return colors[index % colors.length];
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

onMounted(() => {
  retrieveAthletes();
});
</script>

<template>
  <v-container>
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="auto">
        <span class="text-h5 font-weight-bold">
          Hello Coach {{ user.fName }} {{ user.lName }}!
        </span>
      </v-col>
      <v-col cols="auto">
        <v-chip color="primary" text-color="white" class="ma-2" label>
          {{ todayDisplay }}
        </v-chip>
      </v-col>
    </v-row>

    <v-card elevation="3" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">
        Today's Athlete Workouts
      </v-card-title>
      <v-divider class="mb-4"></v-divider>

      <v-row>
        <v-col
          v-for="(athlete, index) in athletesToday"
          :key="index"
          cols="12"
          md="6"
        >
          <v-card class="pa-3" elevation="1" outlined>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar
                  size="40"
                  :color="getColor(index)"
                  class="text-white font-weight-bold"
                >
                  {{ getInitials(athlete.name) }}
                </v-avatar>
              </v-col>
              <v-col>
                <div class="font-weight-medium">
                  {{ athlete.name }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ athlete.type }} at {{ athlete.time }} for
                  {{ athlete.duration }} minutes
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-if="!athletesToday.length" type="info" class="mt-4">
        No workouts scheduled for today.
      </v-alert>
    </v-card>
  </v-container>
</template>




<!-- <script setup>
import { ref } from "vue";

const pageTitle = ref("Coach Dashboard");

// Hardcoded sample data for today's workouts
const athletesToday = ref([
  {
    name: "Sarah (Sample Client)",
    time: "18:15",
    duration: 15,
    type: "Call"
  },
  {
    name: "Sarah (Sample Client)",
    time: "18:30",
    duration: 15,
    type: "Call"
  },
  {
    name: "Jordan Lee",
    time: "19:00",
    duration: 30,
    type: "Workout"
  },
  {
    name: "Taylor Nguyen",
    time: "20:00",
    duration: 45,
    type: "Nutrition Check-In"
  }
]);

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
});

// Generate a color from index for visual variety
const getColor = (index) => {
  const colors = ["blue", "green","grey"];
  return colors[index % colors.length];
};

// Extract initials from name
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
</script>

<template>
  <v-container>
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="auto">
        <span class="text-h5 font-weight-bold">{{ pageTitle }}</span>
      </v-col>
      <v-col cols="auto">
        <v-chip color="primary" text-color="white" class="ma-2" label>
          {{ today }}
        </v-chip>
      </v-col>
    </v-row>

    <v-card elevation="3" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">
        Today's Athlete Workouts
      </v-card-title>
      <v-divider class="mb-4"></v-divider>

      <v-row>
        <v-col
          v-for="(athlete, index) in athletesToday"
          :key="index"
          cols="12"
          md="6"
        >
          <v-card class="pa-3" elevation="1" outlined>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar
                  size="40"
                  :color="getColor(index)"
                  class="text-white font-weight-bold"
                >
                  {{ getInitials(athlete.name) }}
                </v-avatar>
              </v-col>
              <v-col>
                <div class="font-weight-medium">
                  {{ athlete.name }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ athlete.type }} at {{ athlete.time }} for
                  {{ athlete.duration }} minutes
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-if="!athletesToday.length" type="info" class="mt-4">
        No workouts scheduled for today.
      </v-alert>
    </v-card>
  </v-container>
</template> -->
