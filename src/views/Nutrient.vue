<script setup>
import { ref, computed, onMounted } from "vue";
import NutritionServices from "../services/nutritionServices";
import MealPlanSelector from "../components/MealPlanSelector.vue";

const plans = ref([]);
const selectedPlan = ref(null);
const search = ref("");
const message = ref("Nutrition Plans");

const loadPlans = () => {
  NutritionServices.getAll()
    .then((res) => {
      plans.value = res.data || [];
      selectedPlan.value = null;
    })
    .catch((e) => {
      message.value = e?.response?.data?.message || "Failed to load nutrition plans.";
    });
};

onMounted(loadPlans);

const filteredPlans = computed(() => {
  const q = search.value.toLowerCase();
  return plans.value.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
});

const applyPlan = (plan) => {
  selectedPlan.value = plan;
  message.value = `Loaded plan: ${plan.name}`;
};

const clearPlan = () => {
  selectedPlan.value = null;
  message.value = "Cleared plan";
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" class="pa-4" style="border-right: 1px solid #ccc;">
        <MealPlanSelector @select-plan="applyPlan" @clear-plan="clearPlan" />

        <v-text-field v-model="search" label="Search Plans" prepend-icon="mdi-magnify" dense hide-details />

        <v-list>
          <v-list-item v-for="plan in filteredPlans" :key="plan.id" @click="applyPlan(plan)" :class="{ 'bg-grey-lighten-3': selectedPlan?.id === plan.id }">
            <v-list-item-content>
              <v-list-item-title>{{ plan.name }}</v-list-item-title>
              <v-list-item-subtitle class="text--secondary">{{ plan.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="9" class="pa-4">
        <v-card v-if="selectedPlan">
          <v-card-title>{{ selectedPlan.name }}</v-card-title>
          <v-card-text>
            <p>{{ selectedPlan.description }}</p>
            <v-divider class="my-2" />
            <v-list two-line>
              <v-list-item v-for="meal in selectedPlan.meals" :key="meal.id">
                <v-list-item-content>
                  <v-list-item-title>{{ meal.time }} — {{ meal.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ meal.notes }} — {{ meal.calories }} kcal</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <div v-else>
          <v-alert type="info" border="left" colored-border>{{ message }}</v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
