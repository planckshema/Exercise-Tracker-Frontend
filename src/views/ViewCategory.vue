<script setup>
import ExerciseCategoryServices from "../services/exerciseCategoryServices";
import { ref, onMounted } from "vue";

const categories = ref([]);
const message = ref("Add or Delete Categories");

const showAddModal = ref(false);
const newCategory = ref({
  name: "",
  description: ""
});

const retrieveCategories = () => {
  ExerciseCategoryServices.getAll()
    .then((response) => {
      categories.value = response.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error retrieving categories";
    });
};

const openAddModal = () => {
  newCategory.value = { name: "", description: "" };
  showAddModal.value = true;
};

const saveCategory = () => {
  ExerciseCategoryServices.create(newCategory.value)
    .then(() => {
      showAddModal.value = false;
      retrieveCategories();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error saving category";
    });
};

const deleteCategory = (category) => {
  ExerciseCategoryServices.delete(category.id)
    .then(() => {
      retrieveCategories();
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error deleting category";
    });
};

onMounted(() => {
  retrieveCategories();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Exercise Categories</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-card>
        <v-card-title>
          Categories
          <v-btn class="mx-2" color="success" @click="openAddModal">
            Add Category
          </v-btn>
        </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Description</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.description }}</td>
              <td>
                <v-icon small class="mx-4" @click="deleteCategory(item)">
                  mdi-trash-can
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>

    <v-dialog v-model="showAddModal" max-width="500px">
      <v-card>
        <v-card-title>Add New Category</v-card-title>
        <v-card-text>
          <v-text-field
            label="Name"
            v-model="newCategory.name"
            required
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="newCategory.description"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveCategory">Save</v-btn>
          <v-btn color="secondary" @click="showAddModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
