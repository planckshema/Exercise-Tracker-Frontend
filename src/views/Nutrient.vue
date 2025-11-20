<script>
export default {
  name: 'NutrientTracker',
  data() {
    return {
      eatenItems: [],
      newItemName: '',
      newCalories: null,
      newProtein: null,
    };
  },
  computed: {
    totalCalories() {
      // Calculates the sum of calories from all eaten items
      return this.eatenItems.reduce((sum, item) => sum + item.calories, 0);
    },
    totalProtein() {
      // Calculates the sum of protein from all eaten items
      return this.eatenItems.reduce((sum, item) => sum + item.protein, 0);
    }
  },
  methods: {
    addItem() {
      if (this.newItemName && this.newCalories > 0 && this.newProtein >= 0) {
        this.eatenItems.push({
          name: this.newItemName,
          calories: this.newCalories,
          protein: this.newProtein,
        });
        // Reset inputs after adding
        this.newItemName = '';
        this.newCalories = null;
        this.newProtein = null;
      } else {
          alert("Please enter valid item name, calories, and protein.");
      }
    },
    removeItem(index) {
      this.eatenItems.splice(index, 1);
    }
  }
};
</script>


<template>
  <div class="nutrient-tracker-container">
    <h1>Daily Nutrient Intake Tracker</h1>


    <!-- Item Input Section -->
    <div class="input-section">
      <input
        v-model="newItemName"
        placeholder="Item Name (e.g., Apple)"
        class="input-field"
      />
      <input
        v-model.number="newCalories"
        type="number"
        placeholder="Calories"
        class="input-field small-input"
      />
      <input
        v-model.number="newProtein"
        type="number"
        placeholder="Protein (g)"
        class="input-field small-input"
      />
      <button @click="addItem" class="add-button">Add Item</button>
    </div>


    <!-- Summary Section -->
    <div class="summary-section">
      <h3>Today's Totals</h3>
      <p>Total Calories: <strong>{{ totalCalories }} kcal</strong></p>
      <p>Total Protein: <strong>{{ totalProtein }} g</strong></p>
    </div>


    <!-- Item List Section -->
    <div class="item-list-section">
      <h3>Calories Today</h3>
      <ul>
        <li v-for="(item, index) in eatenItems" :key="index" class="item-item">
          <span>{{ item.name }}</span>
          <span class="item-details">{{ item.calories }} kcal | {{ item.protein }}g protein</span>
          <button @click="removeItem(index)" class="remove-button">&times;</button>
        </li>
      </ul>
      <p v-if="eatenItems.length === 0">No items added yet.</p>
    </div>
  </div>
</template>






<style scoped>
.nutrient-tracker-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}


.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}


.input-field {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}


.small-input {
    width: 100px;
    flex-grow: 0;
}


.add-button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.add-button:hover {
  background-color: #45a049;
}


.summary-section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}


.item-list-section ul {
  list-style-type: none;
  padding: 0;
}


.item-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}


.item-details {
    font-size: 0.9em;
    color: #555;
    margin-left: auto; /* Pushes the details and button to the right */
    margin-right: 10px;
}


.remove-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.remove-button:hover {
  background-color: #e53935;
}
</style>
