<!-- <script setup>
import VueCal from "vue-cal"
import "vue-cal/dist/vuecal.css"
import { ref, onMounted } from "vue"

const events = ref([])

function generateWeeklyEvents() {
  const result = []

  const workouts = [
    { weekday: 2, title: "Leg Day" },  
    { weekday: 5, title: "Chest Day" }  
  ]

  const start = new Date()
  const end = new Date()
  end.setMonth(end.getMonth() + 6) 

  let current = new Date(start)

  while (current <= end) {
    const day = current.getDay() // Sunday = 0, Monday = 1, ...

    workouts.forEach(w => {
      if (day === w.weekday) {
        const dateStr = current.toISOString().slice(0, 10)

        result.push({
          start: dateStr,
          end: dateStr,
          title: w.title
        })
      }
    })

    current.setDate(current.getDate() + 1)
  }

  return result
}

onMounted(() => {
  events.value = generateWeeklyEvents()
})
</script> -->

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
import { ref, onMounted } from "vue"

const events = ref([])

// Weekly workout schedule
const workouts = [
  { weekday: 1, title: "Chest Day" },  // Monday
  { weekday: 3, title: "Back Day" },   // Wednesday
  { weekday: 5, title: "Leg Day" },    // Friday
  { weekday: 0, title: "Rest Day" }    // Sunday
]

function generateWeeklyEvents() {
  const result = []

  const start = new Date()
  const end = new Date()
  end.setMonth(end.getMonth() + 6)  // Generate 6 months ahead

  let current = new Date(start)

  while (current <= end) {
    const day = current.getDay()

    workouts.forEach(w => {
      if (day === w.weekday) {
        const dateStr = current.toISOString().slice(0, 10)

        result.push({
          start: dateStr,
          end: dateStr,
          title: w.title
        })
      }
    })

    current.setDate(current.getDate() + 1)
  }

  return result
}

onMounted(() => {
  events.value = generateWeeklyEvents()
})
</script>

<style scoped>
h1 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>

<!--
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
-->