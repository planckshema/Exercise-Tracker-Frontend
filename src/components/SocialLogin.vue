<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import coachServices from "../services/coachServices";
import athleteServices from "../services/athleteServices";
import { useRouter } from "vue-router";

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});
const message = ref("");

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  let token = {
    credential: response.credential,
  };
  await AuthServices.loginUser(token)
    .then(async (response) => {
      user.value = response.data;
      Utils.setStore("user", user.value);
      fName.value = user.value.fName;
      lName.value = user.value.lName;

      if (!user.value.email || !user.value.email.includes("@")) {
        console.warn("Invalid email for athlete/coach lookup:", user.value.email);
        return;
      }
      //Check if user exists in coaches or athletes
      const athleteRes = await athleteServices.getAllForUser(user.value.email);
      const coachRes = await coachServices.getAllForUser(user.value.email);

      const isAthlete = athleteRes.data && athleteRes.data.length > 0;
      const isCoach = coachRes.data && coachRes.data.length > 0;

      user.value.isAthlete = isAthlete;
      user.value.isCoach = isCoach;
      Utils.setStore("user", user.value);
      if (isAthlete || isCoach) {
        router.push({ name: "exercises" });
      } else {
        message.value = "No coach or athlete record found for this user.";
        router.push({ name: "coachOrAthlete" });
      }


    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <v-container fluid class="login-container d-flex flex-column align-center justify-space-evenly">
    <div class="login-header text-center">
      <div class="bear-circle">
        <img src="/ForgeFitLogo1.png" class="bear-image" />
      </div>
      <h1 class="app-title">Login</h1>
      <h2 class="app-subtitle">Forge Fitness</h2>
      <p class="app-tagline">Train. Transform. Repeat.</p>
    </div>

    <div id="parent_id" class="google-btn"></div>

    <v-alert v-if="message" type="error" class="mt-6">
      {{ message }}
    </v-alert>
  </v-container>
</template>


<style>
.google-btn div[role="button"],
.google-btn div[role="button"] span {
  color: #000 !important;
  font-weight: 700 !important;
}
</style>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff512f, #dd2476, #ff6a00, #ff0000);
  background-size: 300% 300%;
  animation: flameFlow 15s ease infinite;
  color: #fff;
  text-align: center;
  padding: 0 5vw;
}

.login-header {
  max-width: 100%;
  margin: 0 auto;
  padding-top: 4vh;
}

.bear-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 4px solid rgba(255,255,255,0.85);
}

.bear-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.app-title {
  font-size: 6vw;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5vw;
  margin-bottom: 1rem;
}

.app-subtitle {
  font-size: 3vw;
  font-weight: 700;
  color: #ffe0b2;
  margin-top: 1.5rem;
  letter-spacing: 0.3vw;
}

.app-tagline {
  font-size: 2vw;
  font-weight: 400;
  color: #ffe0b2;
  margin-top: 1rem;
  letter-spacing: 0.2vw;
}

/* Button spacing */
.google-btn {
  margin-top: 3vh;
  transition: transform 0.3s ease;
}

.google-btn:hover {
  transform: scale(1.05);
}

/* Flame animation */
@keyframes flameFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>