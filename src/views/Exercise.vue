<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const activeSection = ref("Exercises");

const menuItems = [
  { title: "Home" },
  { title: "Clients" },
  { title: "Messages" },
  { title: "Check-ins" },
  {
    title: "Fitness",
    children: ["Exercises", "Workouts", "Cardio", "Schedules"]
  },
  { title: "Nutrition" },
  { title: "Explore" },
  { title: "Live" },
  { title: "Payment Plans" },
  { title: "Refer & Earn" }
];


const exercises = ref([
  {
    id: 1,
    name: "Barbell Overhead Press (Front)",
    muscleGroups: ["Anterior Delts", "Lateral Delts", "Triceps", "Serratus Anterior"],
    targetAreas: ["Shoulders", "Triceps"],
    tracking: "Repetitions",
    image: "placeholder.svg"
  },
  {
    id: 2,
    name: "Cable Biceps Curl",
    muscleGroups: ["Biceps"],
    targetAreas: ["Arms"],
    tracking: "Repetitions",
    image: "placeholder.svg"
  },
  // Add more exercises here
]);

const selectedExercise = ref(null);
const search = ref("");
const showToast = ref(true);

const filteredExercises = computed(() => {
  const query = search.value.toLowerCase();
  return exercises.value.filter((ex) =>
    ex.name.toLowerCase().includes(query)
  );
});

const selectExercise = (exercise) => {
  selectedExercise.value = exercise;
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" class="pa-4" style="border-right: 1px solid #ccc;">
        <v-text-field
          v-model="search"
          label="Search Exercises"
          prepend-icon="mdi-magnify"
          dense
          hide-details
        />
        <v-list>
          <v-list-item
            v-for="exercise in filteredExercises" 
            :key="exercise.id" 
            @click="selectExercise(exercise)"
            :class="{ 'bg-grey-lighten-3': selectedExercise?.id === exercise.id }"
          >
            <v-list-item-content>
              <v-list-item-title>{{ exercise.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-alert
          v-if="showToast"
          type="info" 
          class="mt-4" 
          border="left" 
          colored-border 
          dense 
          @click="showToast = false"
        >
          Your dashboard comes with a default set of exercises. Explore more or create your own!
        </v-alert>
      </v-col>

    
      <v-col cols="9" class="pa-4">
        <v-card v-if="selectedExercise">
          <v-card-title>{{ selectedExercise.name }}</v-card-title>
          <v-card-text>
            <p><strong>Muscle Groups:</strong> {{ selectedExercise.muscleGroups.join(", ") }}</p>
            <p><strong>Target Areas:</strong> {{ selectedExercise.targetAreas.join(", ") }}</p>
            <p><strong>Tracking:</strong> {{ selectedExercise.tracking }}</p>
            <div class="mt-4">
              <v-img :src="selectedExercise.image" alt="Exercise Illustration" max-width="300" />
            </div>
            <v-btn class="mt-4" color="primary">Add Instructions</v-btn>
          </v-card-text>
        </v-card>
        <div v-else>
          <v-alert type="info" border="left" colored-border>
            Select an exercise to view details.
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>