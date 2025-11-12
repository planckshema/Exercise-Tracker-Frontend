import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import CoachOrAthlete from "./views/CoachOrAthlete.vue";
import NewCoachUser from "./views/NewCoachUser.vue";
import Coach from "./views/Coaches.vue";
import Exercise from "./views/Exercise.vue";
import Nutrient from "./views/Nutrient.vue";
import NewAthleteUser from "./views/NewAthleteUser.vue";
import Athlete from "./views/Athlete.vue";
import TutorialsList from "./views/TutorialsList.vue";
import EditTutorial from "./views/EditTutorial.vue";
import AddTutorial from "./views/AddTutorial.vue";
import ViewTutorial from "./views/ViewTutorial.vue";
import AddLesson from "./views/AddLesson.vue";
import EditLesson from "./views/EditLesson.vue";

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
      path: "/exercises",
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
      path: "/tutorials",
      name: "tutorials",
      component: TutorialsList,
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: EditTutorial,
      props: true,
    },
    {
      path: "/add",
      name: "add",
      component: AddTutorial,
    },
    {
      path: "/view/:id",
      name: "view",
      component: ViewTutorial,
      props: true,
    },
    {
      path: "/addLesson/:tutorialId",
      name: "addLesson",
      component: AddLesson,
      props: true,
    },
    {
      path: "/editLesson/:tutorialId/:lessonId",
      name: "editLesson",
      component: EditLesson,
      props: true,
    },
  ],
});

export default router;
