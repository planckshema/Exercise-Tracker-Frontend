<script setup>
import { ref, onMounted } from "vue";
import AthleteServices from "../services/athleteServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const athlete = ref({
  id: null,
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phoneNumber: "",
  sport: "",
  gender: "",
  height: "",
  weight: "",
  coachId: null
});
const message = ref("Enter data and click save");

const saveAthlete = () => {
  const data = {
    firstName: user.fName,
    lastName: user.lName,
    position: athlete.value.position,
    email: user.email,
    phoneNumber: athlete.value.phoneNumber,
    sport: athlete.value.sport,
    gender: athlete.value.gender,
    height: athlete.value.height,
    weight: athlete.value.weight,
    userId: user.userId,
    coachId: null
  };
  AthleteServices.create(data)
    .then((response) => { 
      athlete.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({ name: "exercises" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({ name: "athleteOrAthlete" });
};

onMounted(() => {
  user.value = Utils.getStore("user");
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>New Athlete User</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- <v-text-field
          v-model="athlete.firstName"
          id="firstName"
          :counter="50"
          label="First Name"
          required
        ></v-text-field> -->

        <!-- <v-text-field
          v-model="athlete.lastName"
          id="lastName"
          :counter="50"
          label="Last Name"
          required
        ></v-text-field> -->

        <v-text-field
          v-model="athlete.position"
          id="position"
          :counter="50"
          label="Position"
          required
        ></v-text-field>

        <!-- <v-text-field
          v-model="athlete.email"
          id="email"
          :counter="100"
          label="Email"
          required
        ></v-text-field> -->

        <v-text-field
          v-model="athlete.phoneNumber"
          id="phoneNumber"
          :counter="15"
          label="Phone Number"
          required
        ></v-text-field>

        <v-text-field
          v-model="athlete.sport"
          id="sport"
          :counter="50"
          label="Sport"
          required
        ></v-text-field>

        <v-select
          v-model="athlete.gender"
          :items="['Male', 'Female']"
          label="Gender"
          required
        ></v-select>

        <v-text-field
          v-model="athlete.height"
          id="height"
          label="Height (in cm or inches)"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model="athlete.weight"
          id="weight"
          label="Weight (in pounds)"
          type="number"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveAthlete"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>

