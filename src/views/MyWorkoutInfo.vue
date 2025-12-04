<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const athleteName = ref(route.query.name);
const sport = ref(route.query.sport);
const startTime = ref(route.query.time);
const exercises = ref([]);
const totalDuration = ref("30 mins");

onMounted(() => {
  exercises.value = [
    { name: "Warm-up Jog", duration: "5 mins" },
    { name: "Agility Ladder", duration: "15 mins" },
    { name: "Shooting Drills", duration: "20 mins" },
  ];
});
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        {{ athleteName }} — {{ sport }}
      </v-card-title>
      <v-card-subtitle>
        Start Time: {{ startTime }} | Total Duration: {{ totalDuration }}
      </v-card-subtitle>

      <v-card-text>
        <v-list>
          <v-subheader>Planned Exercises</v-subheader>
          <v-list-item
            v-for="(exercise, index) in exercises"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>{{ exercise.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-grey">
                {{ exercise.duration }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>
