<script setup>
import { ref, onMounted } from "vue";
import NutritionServices from "../services/nutritionServices";

const plans = ref([]);
const selectedPlanId = ref(null);

const emit = defineEmits(["select-plan", "clear-plan"]);

const loadPlans = () => {
  NutritionServices.getAll().then((res) => {
    plans.value = res.data || [];
  }).catch(()=>{ plans.value = []; });
};

const applyPlan = () => {
  const p = plans.value.find((s) => s.id === Number(selectedPlanId.value));
  if (p) emit("select-plan", p);
};

const clear = () => {
  selectedPlanId.value = null;
  emit("clear-plan");
};

onMounted(loadPlans);
</script>

<template>
  <v-card outlined class="mb-4">
    <v-card-title class="py-2">Meal Plans</v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedPlanId"
        :items="plans"
        item-title="name"
        item-value="id"
        label="Choose a meal plan"
        dense
        hide-details
      />
      <div class="mt-2">
        <v-btn small color="primary" class="mr-2" @click="applyPlan" :disabled="!selectedPlanId">Apply</v-btn>
        <v-btn small text color="secondary" @click="clear">Clear</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
