<script setup>
import forgeFitLogo from "/ForgeFitLogo1.png";            ////CHANGE THIS TO YOUR OWN LOGO
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const user = ref(null);
const title = ref("Forge Fitness");
const initials = ref("");
const name = ref("");
const logoURL = ref("");

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
      // Still force clear if backend fails
      Utils.removeItem("user");
      localStorage.clear();
      user.value = null;
      initials.value = "";
      name.value = "";
      router.push({ name: "login" });
    });
};

onMounted(() => {
  logoURL.value = forgeFitLogo;
  resetMenu();
});
</script>

<template>
  <div>
    <v-navigation-drawer app permanent width="260">
    <!-- Logo and Title -->
    <div class="d-flex align-center pa-4">
      <router-link :to="{ name: 'tutorials' }">
        <v-img :src="logoURL" height="80" width="80" class="mr-2" />
      </router-link>
      <span class="text-h6 font-weight-bold">{{ title }}</span>
    </div>

    <!-- Navigation Buttons -->
    <v-list dense nav>
      <v-list-item :to="{ name: 'exercises' }">
        <v-list-item-title>Fitness</v-list-item-title>
      </v-list-item>
      <!-- Expandable Fitness Section -->
      <v-list-group value="true">
        <v-list-item :to="{ name: 'exercises' }">
          <v-list-item-title>Cardio</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-item :to="{ name: 'nutrients' }">
        <v-list-item-title>Nutrients</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'athletes' }">
        <v-list-item-title>Athletes</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'coaches' }">
        <v-list-item-title>Coaches</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Divider -->
    <v-divider class="my-4" />

    <!-- User Info & Logout -->
    <div v-if="user" class="pa-4">
      <v-avatar color="secondary" class="mb-2">
        <span class="accent--text font-weight-bold">{{ initials }}</span>
      </v-avatar>
      <div class="text-subtitle-1 font-weight-medium">{{ name }}</div>
      <div class="text-caption mb-2">{{ user.email }}</div>
      <v-btn block color="primary" @click="logout">Logout</v-btn>
    </div>
  </v-navigation-drawer>
    <!-- <v-app-bar app>
      <router-link :to="{ name: 'tutorials' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar> -->
  </div>
</template>
