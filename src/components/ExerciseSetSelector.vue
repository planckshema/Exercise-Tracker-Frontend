<script setup>
import { ref, onMounted } from "vue";
import ExerciseSetServices from "../services/exerciseSetServices";

const sets = ref([]);
const selectedSetId = ref(null);

const emit = defineEmits(["select-set", "clear-set"]);

const loadSets = () => {
  ExerciseSetServices.getAll().then((res) => {
    sets.value = res.data || [];
  });
};

const applySet = () => {
  const set = sets.value.find((s) => s.id === Number(selectedSetId.value));
  if (set) emit("select-set", set);
};

const clearSet = () => {
  selectedSetId.value = null;
  emit("clear-set");
};

onMounted(loadSets);
</script>

<template>
  <v-card class="mb-4" outlined>
    <v-card-title class="py-2">Exercise Sets</v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedSetId"
        :items="sets"
        item-title="name"
        item-value="id"
        label="Choose a set"
        dense
        hide-details
      />

      <div class="mt-2">
        <v-btn small color="primary" class="mr-2" @click="applySet" :disabled="!selectedSetId">
          Apply Set
        </v-btn>
        <v-btn small color="secondary" text @click="clearSet">Clear</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
