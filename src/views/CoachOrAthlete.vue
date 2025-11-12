<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";

const router = useRouter();
const user = ref({});

onMounted(() => {
  user.value = Utils.getStore("user");
});

const chooseRole = (role) => {
  if (role === "coach") {
    router.push({ name: "newCoach" }); 
  } else if (role === "athlete") {
    router.push({ name: "newAthlete" }); 
  }
};
</script>

<template>
  <v-container class="text-center">
    <v-row justify="center" class="mt-10">
      <v-col cols="12">
        <h2>Welcome, {{ user.fName }}! Choose your role:</h2>
      </v-col>

      <v-col cols="12" md="6">
        <v-btn
          color="primary"
          large
          block
          @click="chooseRole('athlete')"
        >
          I'm an Athlete
        </v-btn>
      </v-col>

      <v-col cols="12" md="6">
        <v-btn
          color="secondary"
          large
          block
          @click="chooseRole('coach')"
        >
          I'm a Coach
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
