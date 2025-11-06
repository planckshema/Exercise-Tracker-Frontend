<template>
  <div>
    <h1>My Exercise Calendar</h1>

    <vue-cal
      style="height: 600px"
      :events="events"
      :time="false"
    ></vue-cal>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: "FrontPage",
  components: {
    VueCal
  },
  data() {
    return {
      events: [
        { start: '2025-11-06', end: '2025-11-06', title: 'Run 5km' },
        { start: '2025-11-07', end: '2025-11-07', title: 'Yoga 30 min' }
      ]
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
