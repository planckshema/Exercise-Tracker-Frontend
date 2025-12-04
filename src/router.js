import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import CoachOrAthlete from "./views/CoachOrAthlete.vue";
import NewCoachUser from "./views/NewCoachUser.vue";
import SearchCoach from "./views/SearchCoach.vue";
import Coach from "./views/Coaches.vue";
import Exercise from "./views/Exercise.vue";
import Nutrient from "./views/Nutrient.vue";
import NewAthleteUser from "./views/NewAthleteUser.vue";
import SearchAthlete from "./views/SearchAthlete.vue";
import Athlete from "./views/Athlete.vue";
import AddExercise from "./views/AddExercise.vue";
import ViewCategory from "./views/ViewCategory.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/coachOrAthlete",
      name: "coachOrAthlete",
      component: CoachOrAthlete,
    },
     {
      path: "/exercises/:categoryId?",
      name: "exercises",
      component: Exercise,
    },
    {
      path: "/nutrients",
      name: "nutrients",
      component: Nutrient,
    },
    {
      path: "/newAthlete",
      name: "newAthlete",
      component: NewAthleteUser,
    },
    {
      path: "/athletes",
      name: "athletes",
      component: Athlete,
    },
     {
      path: "/searchAthlete",
      name: "searchAthlete",
      component: SearchAthlete,
    },
    {
      path: "/newCoach",
      name: "newCoach",
      component: NewCoachUser,
    },
     {
      path: "/coaches",
      name: "coaches",
      component: Coach,
    },
    {
      path: "/searchCoach",
      name: "searchCoach",
      component: SearchCoach,
    },
     {
      path: "/addExercise/:categoryId",
      name: "addExercise",
      component: AddExercise,
      props: true,
    },
    {
      path: "/viewCategory",
      name: "viewCategory",
      component: ViewCategory,
      props: true,
    },
  ]
});

export default router;
