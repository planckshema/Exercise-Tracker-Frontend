<template>
  <v-container>
    <h1 class="text-center mb-6">Exercise Calendar</h1>

    <vue-cal
      style="height: 600px;"
      :time="false"
      :events="events"
    ></vue-cal>
  </v-container>
</template>

<script setup>
import VueCal from "vue-cal"
import "vue-cal/dist/vuecal.css"
import { ref } from "vue"

const events = ref([
  { start: "2025-11-07", end: "2025-11-07", title: "Leg Day" },
  { start: "2025-11-08", end: "2025-11-08", title: "Chest & Triceps" },
  { start: "2025-11-09", end: "2025-11-09", title: "Rest" }
])
</script>

<style scoped>
h1 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
