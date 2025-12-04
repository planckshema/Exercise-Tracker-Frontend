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
const message = ref("Search for athletes by name, sport, or email");


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
  const coach = coaches.value.find(c => c.email === user.email);
  if (!coach) return;
  CoachAthleteServices.getAthletesForCoach(coach.id)
    .then((res) => {
      requests.value = res.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Failed to load requests.";
    });
};

const getRequestStatus = (athleteId) => {
  const req = requests.value.find(r => r.athleteId === athleteId);
  return req ? req.status : "open";
};

const hasRequest = (athleteId) => {
  return requests.value.some(r => r.athleteId === athleteId);
};

const filteredAthletes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return athletes.value.filter((athlete) =>
    (athlete.firstName?.toLowerCase() || "").includes(query) ||
    (athlete.lastName?.toLowerCase() || "").includes(query) ||
    (athlete.email?.toLowerCase() || "").includes(query)
  );
});
const paginatedAthletes = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAthletes.value.slice(start, end);
});

watch(searchQuery, () => {
  page.value = 1;
});

const requestToCoach = (athlete) => {
  const coach = coaches.value.find(c => c.email === user.email);
  if (!coach) {
    message.value = "Coach not found for this user.";
    return;
  }
  CoachAthleteServices.create({
    coachId: coach.id,
    athleteId: athlete.id,
    sport: athlete.sport,
    status: "pending",
    initiator: "coach"
  })
    .then(() => {
      message.value = `Request sent to ${athlete.firstName} ${athlete.lastName}.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error sending request.";
    });
};


const getActionsForRequest = (athleteId) => {
  const req = requests.value.find(r => r.athleteId === athleteId);
  if (!req) return "none";

  const currentCoach = coaches.value.find(c => c.email === user.email);
  const currentAthlete = athletes.value.find(a => a.email === user.email);

  if (req.status === "pending") {
    if (req.initiator === "coach") return "cancel";
    if (req.initiator === "athlete") return "acceptReject";
  }
  if (req.status === "accepted") {
    return "remove";
  }
  return "none";
};

const acceptRequest = (athlete) => {
  const coach = coaches.value.find(c => c.email === user.email);
  CoachAthleteServices.acceptRequest(coach.id, athlete.id)
    .then(() => {
      message.value = `Request from ${athlete.firstName} accepted.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error accepting request.";
    });
};

const rejectRequest = (athlete) => {
  const coach = coaches.value.find(c => c.email === user.email);
  CoachAthleteServices.rejectRequest(coach.id, athlete.id)
    .then(() => {
      message.value = `Request from ${athlete.firstName} rejected.`;
      retrieveRequests();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error rejecting request.";
    });
};

const cancelRequest = (athlete) => {
  const coach = coaches.value.find(c => c.email === user.email);
  if (!coach) {
    message.value = "Coach not found for this user.";
    return;
  }
  const req = requests.value.find(r => r.athleteId === athlete.id);
  if (!req) return;
  CoachAthleteServices.delete(coach.id, athlete.id)
    .then(() => {
      message.value = `Request to ${athlete.firstName} canceled.`;
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
      <v-card-title> Find Athletes </v-card-title>
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
          <tr v-for="athlete in paginatedAthletes" :key="athlete.id">
            <td>{{ athlete.firstName }} {{ athlete.lastName }}</td>
            <td>{{ athlete.email }}</td>
            <td>{{ athlete.sport }}</td>
            <td>{{ getRequestStatus(athlete.id) }}</td>
            <td>
              <!-- No request yet -->
              <v-btn v-if="getActionsForRequest(athlete.id) === 'none'" color="success"
                @click="requestToCoach(athlete)">
                Request To Coach
              </v-btn>

              <!-- Cancel if current user initiated -->
              <v-btn v-else-if="getActionsForRequest(athlete.id) === 'cancel'" color="accent"
                @click="cancelRequest(athlete)">
                Cancel Request
              </v-btn>

              <!-- Accept/Reject if other side initiated -->
              <div v-else-if="getActionsForRequest(athlete.id) === 'acceptReject'">
                <v-btn color="success" @click="acceptRequest(athlete)">Accept</v-btn>
                <v-btn color="error" @click="rejectRequest(athlete)">Reject</v-btn>
              </div>

              <!-- Remove if relationship is accepted -->
              <v-btn v-else-if="getActionsForRequest(athlete.id) === 'remove'" color="primary"
                @click="cancelRequest(athlete)">
                Remove Coach
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination v-model="page" :length="Math.ceil(filteredAthletes.length / itemsPerPage)" class="mt-4" />
    </v-card>
  </v-container>
</template>