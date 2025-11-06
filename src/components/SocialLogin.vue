<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});



const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log("Google client id (from env):", client);

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error("Google Identity Services not available. Make sure the Google script is loaded.");
    return;
  }

  try {
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

    console.log("Google sign-in button rendered");
  } catch (err) {
    console.error("Error initializing Google sign-in:", err);
  }
};

const handleCredentialResponse = async (response) => {
  console.log("handleCredentialResponse called", response);

  if (!response || !response.credential) {
    console.warn("No credential received from Google:", response);
    return;
  }

  const token = { credential: response.credential };
  console.log("Sending token to backend (AuthServices.loginUser)");

  try {
    const res = await AuthServices.loginUser(token);
    console.log("AuthServices.loginUser response:", res);

    user.value = res.data;
    Utils.setStore("user", user.value);
    fName.value = user.value.fName;
    lName.value = user.value.lName;

    console.log('About to navigate to exercises route');
    await router.push({ name: "exercises" });
    console.log('Navigation to exercises completed');
  } catch (error) {
    console.error("Error during login/token or redirect:", error);
  }
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
