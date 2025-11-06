<script setup>
import { ref } from "vue";
import CoachTable from "../components/CoachTable.vue";
import { reactive } from "vue";

const pageTitle = ref("Coaches Dashboard"); 

// const rows = reactive( target[
//   {
//   headers: [
//       'Name',
//       'Title',
//       'Sport',
//       // 'Email'
//     ],
//   },
//   {
//  data: [
//       {
//         name: 'James',
//         title: 'Head Coach',
//         sport: 'Football',
//         // email: "james@gmail.com"
//       },
//       {
//         name: 'Thomas',
//         title: 'Assistant Coach',
//         sport: 'Football',
//         // email: "thomas@gmail.com"
//       },  {
//         name: 'Mark',
//         title: 'Health Coach',
//         sport: 'Football',
//         // email: "mk@gmail.com"
//       },
//     ],
//   }
   
  
// ])
// </script>

<template>
  
  <v-container fluid>
    <v-row justify="center" align="center" style="height: 80vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="2" class="pa-6 text-center">
          <v-card-title class="text-h5 font-weight-bold">
            {{ pageTitle }}
          </v-card-title>
          <CoachTable />
          
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
  

  
 

</template>
