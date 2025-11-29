<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExerciseServices from "../services/exerciseServices";


const route = useRoute();
const router = useRouter();
const selectedCategoryId = ref(null);

const exercises = ref([]);
const selectedExercise = ref(null);

const message = ref("Exercises");



const loadExercises = async (categoryId) => {
  ExerciseServices.getAllForCategory(categoryId)
    .then((res) => {
      exercises.value = res.data;
      selectedExercise.value = null;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load exercises.";
    });
};

watch(
  () => route.params.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      selectedCategoryId.value = Number(newCategoryId);
      loadExercises(selectedCategoryId.value);
    }
  },
  { immediate: true }
);

const search = ref("");
const showToast = ref(true);

const filteredExercises = computed(() => {
  const query = search.value.toLowerCase();
  return exercises.value.filter((ex) =>
    ex.name.toLowerCase().includes(query)
  );
});


const goToAddExercise = () => {
   if (selectedCategoryId.value) 
   {
    router.push({ name: "addExercise"});
  }
  else 
  {
    message.value = "Please select a category first.";
  }
};


const selectExercise = (exercise) => {
  selectedExercise.value = exercise;
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" class="pa-4" style="border-right: 1px solid #ccc;">
        <v-text-field v-model="search" label="Search Exercises" prepend-icon="mdi-magnify" dense hide-details />

        <v-btn class="mt-2" color="success" block @click="goToAddExercise">
          + Add Exercise
        </v-btn>


        <v-list>
          <v-list-item v-for="exercise in filteredExercises" :key="exercise.id" @click="selectExercise(exercise)"
            :class="{ 'bg-grey-lighten-3': selectedExercise?.id === exercise.id }">
            <v-list-item-content>
              <v-list-item-title>{{ exercise.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>


      <v-col cols="9" class="pa-4">
        <v-card v-if="selectedExercise">
          <v-card-title>{{ selectedExercise.name }}</v-card-title>
          <v-card-text>
            <p><strong>Description:</strong> {{ selectedExercise.description }}</p>
            <p><strong>Equipment:</strong> {{ selectedExercise.equipment }}</p>
            <p><strong>Duration:</strong> {{ selectedExercise.duration }} seconds</p>
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