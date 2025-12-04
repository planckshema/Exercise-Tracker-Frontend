<script setup>
import UserServices from "../services/userServices";
import CoachServices from "../services/coachServices";
import AthleteServices from "../services/athleteServices";
import { ref, onMounted, computed } from "vue";

const users = ref([]);
const coaches = ref([]);
const athletes = ref([]);
const message = ref("View and Delete Users, Coaches, and Athletes");

const searchQuery = ref("");

const retrieveAll = () => {
  UserServices.getAll()
    .then(res => { users.value = res.data; })
    .catch(e => { message.value = e.response?.data?.message || "Error retrieving users"; });

  CoachServices.getAll()
    .then(res => { coaches.value = res.data; })
    .catch(e => { message.value = e.response?.data?.message || "Error retrieving coaches"; });

  AthleteServices.getAll()
    .then(res => { athletes.value = res.data; })
    .catch(e => { message.value = e.response?.data?.message || "Error retrieving athletes"; });
};

const deleteUser = (user) => {
  UserServices.delete(user.id).then(retrieveAll)
    .catch(e => { message.value = e.response?.data?.message || "Error deleting user"; });
};

const deleteCoach = (coach) => {
  CoachServices.delete(coach.id).then(retrieveAll)
    .catch(e => { message.value = e.response?.data?.message || "Error deleting coach"; });
};

const deleteAthlete = (athlete) => {
  AthleteServices.delete(athlete.id).then(retrieveAll)
    .catch(e => { message.value = e.response?.data?.message || "Error deleting athlete"; });
};

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(u =>
    u.fName?.toLowerCase().includes(q) ||
    u.lName?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  );
});

const filteredCoaches = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return coaches.value.filter(c =>
    c.firstName?.toLowerCase().includes(q) ||
    c.lastName?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q)
  );
});

const filteredAthletes = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return athletes.value.filter(a =>
    a.firstName?.toLowerCase().includes(q) ||
    a.lastName?.toLowerCase().includes(q) ||
    a.email?.toLowerCase().includes(q)
  );
});

onMounted(() => {
  retrieveAll();
});
</script>


<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Manage People</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <b>{{ message }}</b>
        <v-text-field
          v-model="searchQuery"
          label="Search by name or email"
          prepend-inner-icon="mdi-magnify"
          class="mt-4"
        />
      </v-card-text>

      <v-card-title>Users</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td>{{ u.fName }}</td>
            <td>{{ u.lName }}</td>
            <td>{{ u.email }}</td>
            <td>
              <v-icon small class="mx-2" @click="deleteUser(u)">mdi-trash-can</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card-title>Coaches</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filteredCoaches" :key="c.id">
            <td>{{ c.firstName }}</td>
            <td>{{ c.lastName }}</td>
            <td>{{ c.email }}</td>
            <td>
              <v-icon small class="mx-2" @click="deleteCoach(c)">mdi-trash-can</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card-title>Athletes</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filteredAthletes" :key="a.id">
            <td>{{ a.firstName }}</td>
            <td>{{ a.lastName }}</td>
            <td>{{ a.email }}</td>
            <td>
              <v-icon small class="mx-2" @click="deleteAthlete(a)">mdi-trash-can</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

