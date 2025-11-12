<script setup>
import { ref, onMounted } from "vue";
import CoachServices from "../services/coachServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const coach = ref({
  id: null,
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phoneNumber: "",
  sport: "",
  gender: "",
  height: "",
  weight: ""
});
const message = ref("Enter data and click save");

const saveCoach = () => {
  const data = {
    firstName: user.fName,
    lastName: user.lName,
    role: coach.value.role,
    email: user.email,
    phoneNumber: coach.value.phoneNumber,
    sport: coach.value.sport,
    gender: coach.value.gender,
    height: coach.value.height,
    weight: coach.value.weight,
    userId: user.userId,
  };
  CoachServices.create(data)
    .then((response) => {
        if (response?.data?.id) {
      coach.value.id = response.data.id;
      console.log("Coach added:", response.data);
      router.push({ name: "exercises" });
    } else {
      message.value = "Coach created, but no ID returned.";
    }
    //   coach.value.id = response.data.id;
    //   console.log("add " + response.data);
    //   router.push({ name: "exercises" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({ name: "coachOrAthlete" });
};

onMounted(() => {
  user.value = Utils.getStore("user");
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>New Coach User</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- <v-text-field
          v-model="coach.firstName"
          id="firstName"
          :counter="50"
          label="First Name"
          required
        ></v-text-field> -->

        <!-- <v-text-field
          v-model="coach.lastName"
          id="lastName"
          :counter="50"
          label="Last Name"
          required
        ></v-text-field> -->

        <v-text-field
          v-model="coach.role"
          id="role"
          :counter="50"
          label="Role"
          required
        ></v-text-field>

        <!-- <v-text-field
          v-model="coach.email"
          id="email"
          :counter="100"
          label="Email"
          required
        ></v-text-field> -->

        <v-text-field
          v-model="coach.phoneNumber"
          id="phoneNumber"
          :counter="15"
          label="Phone Number"
          required
        ></v-text-field>

        <v-text-field
          v-model="coach.sport"
          id="sport"
          :counter="50"
          label="Sport"
          required
        ></v-text-field>

        <v-select
          v-model="coach.gender"
          :items="['Male', 'Female']"
          label="Gender"
          required
        ></v-select>

        <v-text-field
          v-model="coach.height"
          id="height"
          label="Height (in cm or inches)"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model="coach.weight"
          id="weight"
          label="Weight (in pounds)"
          type="number"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveCoach"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>

