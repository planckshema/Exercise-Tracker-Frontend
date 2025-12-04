<script setup>
import ExerciseServices from "../services/exerciseServices";
import ExerciseCategoryServices from "../services/exerciseCategoryServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(true);
const categories = ref([]);

const exercise = ref({
  id: null,
  name: "",
  description: "",
  equipment: "",
  duration: null,
  duration_value: 0, 
  duration_unit: "seconds",
  categoryId: null
});

const message = ref("Enter exercise data and click save");


const loadCategories = () => {
  ExerciseCategoryServices.getAll()
    .then((res) => {
      categories.value = res.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load coaches.";
    });
};


// duration seconds conversion based on time choice
const calculateDuration = () => {
  const value = Number(exercise.value.duration_value) || 0;
  switch (exercise.value.duration_unit) {
    case "hours":
      exercise.value.duration = value * 3600;
      break;
    case "minutes":
      exercise.value.duration = value * 60;
      break;
    case "seconds":
      exercise.value.duration = value;
      break;
    default:
      exercise.value.duration = value;
  }
};


const saveExercise = () => {
  calculateDuration();
  const data = {
    name: exercise.value.name,
    description: exercise.value.description,
    equipment: exercise.value.equipment,
    duration: exercise.value.duration,
    categoryId: exercise.value.categoryId
  };

  ExerciseServices.create(exercise.value.categoryId, data)
    .then((response) => {
      exercise.value.id = response.data.id;
      router.push({ name: "exercises", params: { categoryId: exercise.value.categoryId } });
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error saving exercise.";
    });
};

const cancel = () => {
  router.push({ name: "exercises", params: { categoryId: exercise.value.categoryId  } });
};


onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Add Exercise</v-toolbar-title>
      </v-toolbar>

      <h4>{{ message }}</h4>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="exercise.name"
          id="name"
          :counter="50"
          label="Exercise Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="exercise.description"
          id="description"
          :counter="300"
          label="Description"
        ></v-text-field>

        <v-text-field
          v-model="exercise.equipment"
          id="equipment"
          :counter="50"
          label="Equipment"
        ></v-text-field>

        <v-text-field
          v-model="exercise.duration_value"
          id="duration"
          type="number"
          label="Duration"
        ></v-text-field>

        <v-select
          v-model="exercise.duration_unit"
          :items="
          [
            { title: 'Hours', value: 'hours' },
            { title: 'Minutes', value: 'minutes' },
            { title: 'Seconds', value: 'seconds' }
          ]"
          item-title="title"
          item-value="value"
          label="Duration Unit"
          required
        />

        <v-select
          v-model="exercise.categoryId"
          :items="categories"
          item-title="name"   
          item-value="id"
          label="Select Category"
          required
        />

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveExercise"
        >
          Add
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>
