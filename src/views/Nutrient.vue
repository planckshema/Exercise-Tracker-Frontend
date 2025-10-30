<script setup>
import { ref } from "vue";

const pageTitle = ref("Nutrient Dashboard"); // Change to "Athlete Dashboard" for Athlete.vue
</script>

<template>
  <v-container fluid>
    <v-row justify="center" align="center" style="height: 80vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="2" class="pa-6 text-center">
          <v-card-title class="text-h5 font-weight-bold">
            {{ pageTitle }}
          </v-card-title>
          <v-card-text>
            <v-icon color="primary" size="48">mdi-food-apple</v-icon> <!-- Use mdi-account for Athlete -->
            <p class="mt-4 text-subtitle-1">
              This page is under construction. 
            </p>
            <v-alert type="info" class="mt-4" border="left" colored-border>
              Plan: Start by defining your data structure and create key features to include.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
