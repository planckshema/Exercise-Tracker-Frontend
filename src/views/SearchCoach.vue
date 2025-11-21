<script setup>
import AthleteServices from "../services/athleteServices";
import CoachServices from "../services/coachServices";
import CoachAthleteServices from "../services/coachAthleteServices";
import Utils from "../config/utils.js";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");

const athletes = ref([]);
const coaches = ref([]);
const requests = ref([]);

const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const message = ref("Search for coaches by name, sport, or email");


const retrieveAthletes = () => {
  AthleteServices.getAll()
    .then((res) => {
      athletes.value = res.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load athletes.";
    });
};

const retrieveCoaches = () => {
  CoachServices.getAll()
    .then((res) => {
      coaches.value = res.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load coaches.";
    });
};

const retrieveRequests = () => {
  const athlete = athletes.value.find(a => a.email === user.email);
  if (!athlete) return;
  CoachAthleteServices.getCoachesForAthlete(athlete.id)
    .then((res) => {
      requests.value = res.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load requests.";
    });
};

const getRequestStatus = (coachId) => {
  const req = requests.value.find(r => r.coachId === coachId);
  return req ? req.status : "open";
};

const hasRequest = (coachId) => {
  return requests.value.some(r => r.coachId === coachId);
};

const filteredCoaches = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return coaches.value.filter((coach) =>
    (coach.firstName?.toLowerCase() || "").includes(query) ||
    (coach.lastName?.toLowerCase() || "").includes(query) ||
    (coach.email?.toLowerCase() || "").includes(query)
  );
});
const paginatedCoaches = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCoaches.value.slice(start, end);
});

watch(searchQuery, () => {
  page.value = 1;
});

const requestForCoach = (coach) => {
  const athlete = athletes.value.find(a => a.email === user.email);
  if (!athlete) {
    message.value = "Athlete not found for this user.";
    return;
  }
  CoachAthleteServices.create({
    coachId: coach.id,
    athleteId: athlete.id,
    sport: athlete.sport,
    status: "pending",
    initiator: "athlete"
  })
    .then(() => {
      message.value = `Request sent to ${athlete.firstName} ${athlete.lastName}.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error sending request.";
    });
};

const getActionsForRequest = (coachId) => {
  const req = requests.value.find(r => r.coachId === coachId);
  if (!req) return "none";

  const currentCoach = coaches.value.find(c => c.email === user.email);
  const currentAthlete = athletes.value.find(a => a.email === user.email);

  if (req.status === "pending") {
    if (req.initiator === "athlete" && currentAthlete) return "cancel";
    //if (req.initiator === "coach" && currentCoach) return "cancel";
    //if (req.initiator === "athlete" && currentCoach) return "acceptReject";
    if (req.initiator === "coach" && currentAthlete) return "acceptReject";
  }
  if (req.status === "accepted") {
    return "remove";
  }
  return "none";
};

const acceptRequest = (coach) => {
  const athlete = athletes.value.find(a => a.email === user.email);
  CoachAthleteServices.update(coach.id, athlete.id, { status: "accepted" })
    .then(() => {
      message.value = `Request from ${coach.firstName} accepted.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error accepting request.";
    });
};

const rejectRequest = (coach) => {
  const athlete = athletes.value.find(a => a.email === user.email);
  CoachAthleteServices.update(coach.id, athlete.id, { status: "rejected" })
    .then(() => {
      message.value = `Request from ${coach.firstName} rejected.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error rejecting request.";
    });
};

const cancelRequest = (coach) => {
  const athlete = athletes.value.find(a => a.email === user.email);
  if (!athlete) {
    message.value = "Athlete not found for this user.";
    return;
  }

  const req = requests.value.find(r => r.coachId === coach.id);
  if (!req) return;
  CoachAthleteServices.delete(coach.id, athlete.id)
    .then(() => {
      message.value = `Request to ${coach.firstName} canceled.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error canceling request.";
    });
};


retrieveAthletes();
retrieveCoaches();
setTimeout(retrieveRequests, 500);
</script>

<template>
  <v-container>
    <v-text-field v-model="searchQuery" label="Search by Name or Email" prepend-icon="mdi-magnify" class="mb-4" />

    <v-card>
      <v-card-title> Find Coaches </v-card-title>
      <v-card-text>
        <b>{{ message }}</b>
      </v-card-text>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Sport</th>
            <th class="text-left">Status</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coach in paginatedCoaches" :key="coach.id">
            <td>{{ coach.firstName }} {{ coach.lastName }}</td>
            <td>{{ coach.email }}</td>
            <td>{{ coach.sport }}</td>
            <td>{{ getRequestStatus(coach.id) }}</td>
            <td>
              <!-- No request yet -->
              <v-btn v-if="getActionsForRequest(coach.id) === 'none'" color="fireOrange"
                @click="requestForCoach(coach)">
                Request For Coach
              </v-btn>

              <!-- Cancel if current user initiated -->
              <v-btn v-else-if="getActionsForRequest(coach.id) === 'cancel'" color="secondary"
                @click="cancelRequest(coach)">
                Cancel Request
              </v-btn>

              <!-- Accept/Reject if other side initiated -->
              <div v-else-if="getActionsForRequest(coach.id) === 'acceptReject'">
                <v-btn color="success" @click="acceptRequest(coach)">Accept</v-btn>
                <v-btn color="error" @click="rejectRequest(coach)">Reject</v-btn>
              </div>

              <!-- Remove if relationship is accepted -->
              <v-btn v-else-if="getActionsForRequest(athlete.id) === 'remove'" color="fireRed"
                @click="cancelRequest(athlete)">
                Remove Coach
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination v-model="page" :length="Math.ceil(filteredCoaches.length / itemsPerPage)" class="mt-4" />
    </v-card>
  </v-container>
</template>
