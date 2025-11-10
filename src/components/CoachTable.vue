<script setup>
import { ref } from 'vue';

// Define the headers (matches the keys in the coach objects)
const headers = ref([
  'Name',
  'Title',
  'Sport',
]);

// Define the data for the coaches
const coaches = ref([
  {
    name: 'James',
    title: 'Head Coach',
    sport: 'Football',
  },
  {
    name: 'Thomas',
    title: 'Assistant Coach',
    sport: 'Football',
  },  {
    name: 'Mark',
    title: 'Health Coach',
    sport: 'Football',
  },
]);
</script>

<template>
  <div class="table-container">
    
    <table class="vue-table">
      <!-- Table Header -->
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody>
        <tr v-for="(coach, index) in coaches" :key="index">
          <!-- Dynamically access the correct property using bracket notation -->
          <td>{{ coach.name }}</td>
          <td>{{ coach.title }}</td>
          <td>{{ coach.sport }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.table-container {
  padding: 1rem;
}

.vue-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden; /* Ensures border radius applies to headers */
}

.vue-table th,
.vue-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

.vue-table th {
  background-color: #007bff; /* A nice blue color for headers */
  color: white;
  font-weight: 600;
}

.vue-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Zebra striping */
}

.vue-table tbody tr:hover {
  background-color: #f1f1f1; /* Hover effect */
}
</style>