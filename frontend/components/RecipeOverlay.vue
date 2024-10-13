<template>
  <div class="overlay" v-if="visible" @click.self="closeOverlay">
    <!-- Back button -->
    <button class="back-button" @click="closeOverlay">← Back</button>
    
    <div class="overlay-content">
      <div class="left-section">
        <h2>{{ meal.recipe.name }}</h2>
        <img :src="meal.recipe.storage_links.thumbnail" alt="Meal Image" />
      </div>
      <div class="right-section">
        <div class="tabs">
          <button :class="{ active: activeTab === 'nutrition' }" @click="activeTab = 'nutrition'">Nutrition Information</button>
          <button :class="{ active: activeTab === 'recipe' }" @click="activeTab = 'recipe'">Recipe</button>
          <button :class="{ active: activeTab === 'ingredients' }" @click="activeTab = 'ingredients'">Ingredients</button>
        </div>
        <div class="tab-content scrollable-content">
          <div v-if="activeTab === 'nutrition'" class="nutrition-content">
            <!-- Nutrition Information Content -->
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/macroEnergy.svg" alt="icon" width="16" height="16">
                Calories</span>
              <span>{{meal.recipe.nutrition_info.calories}}kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/macroCarb.svg" alt="icon" width="16" height="16">Carbohydrates</span>
              <span>{{meal.recipe.nutrition_info.totalCarbohydrate}}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/macroProtein.svg" alt="icon" width="16" height="16">Proteins</span>
              <span>{{meal.recipe.nutrition_info.protein}}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/macroFat.svg" alt="icon" width="10" height="10">Fats</span>
              <span>{{meal.recipe.nutrition_info.fat}}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/macroSodium.svg" alt="icon" width="16" height="16">Sodium</span>
              <span>{{meal.recipe.nutrition_info.sodium}}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">
                <img src="/assets/img/cholesterolsIcon.png" alt="icon" width="16" height="16">Cholesterol</span>
              <span>{{meal.recipe.nutrition_info.cholesterol}}g</span>
            </div>
            <p class="preparation-time">* Preparation time: {{ meal.recipe.preparation_time }}</p>
          </div>
          <div v-if="activeTab === 'recipe'">
            <!-- Recipe Content -->
            <div v-for="(htmlString, index) in instruction" :key="index" v-html="htmlString"></div>
            <!-- Add more recipe details here -->
          </div>
          <div v-if="activeTab === 'ingredients'">
            <!-- Ingredients Content -->
            <div class="card-grid">
              <div v-for="ingredient in props.meal.components.ingredients" :key="ingredient.name" class="card horizontal-card">
                <img :src="ingredient.storage_links.thumbnail" :alt="ingredient.name" />
                <div class="card-content">
                  <p class="card-title">{{ ingredient.name }}</p>
                  <p class="card-details">{{ `Amount: ${ingredient.amount} ${ingredient.unit}` }}</p>
                </div>
              </div>

              <div v-for="seasoning in props.meal.components.seasonings" :key="seasoning.name" class="card horizontal-card">
                <img :src="seasoning.storage_links.thumbnail" :alt="seasoning.name" />
                <div class="card-content">
                  <p class="card-title">{{ seasoning.name }}</p>
                  <p class="card-details">{{ `Amount: ${seasoning.amount} ${seasoning.unit}` }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
</template>
<script setup>
const props = defineProps({
  visible: {
    type: Boolean
  },
  meal: {
    type: Object
  },
  instruction: {
    type: String
  },
})

</script>
<script>
export default {
  data() {
    return {
      activeTab: 'nutrition', // default tab
    };
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay');
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.overlay-content {
  background: #DAC2A8; /* Set to brown */
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  width: 70vw; /* 70% of the viewport width */
  height: 70vh; /* 70% of the viewport height */
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
  z-index: 100; /* Ensure it stays on top */
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center meal name relative to the image */
}

.left-section h2 {
  font-size: 2rem; /* Larger font size for the meal name */
  font-weight: bold; /* Make the meal name bold */
  margin-bottom: 20px;
  text-align: center; /* Center the text */
}

.left-section img {
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.right-section {
  flex: 1.2; /* slightly wider for better readability */
  padding-left: 20px;
  background: #F3EADA; /* Light background color */
  border-radius: 15px; /* Maintain rounded corners */
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3; /* Keep the right section above the corner mask */
  overflow: hidden; /* Ensures the pseudo-element doesn't overflow */
}



.tabs {
  margin-top: -20px;
  display: flex;
  justify-content: flex-start;
  position: relative;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem; /* Increase font size */
  color: #8A8A8A; /* Default color */
  position: relative;
  transition: color 0.3s ease;
  border-radius: 10px; /* Make buttons rounded */
}

.tabs button:not(:last-child) {
  margin-right: 20px; /* Add margin between the tabs */
}

/* Vertical line to the right of the Nutrition Information button */
.tabs button:nth-child(1)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -15px; /* Move the line farther to the right */
  transform: translateY(-50%);
  width: 2px;
  height: 50%;
  background-color: #D3D3D3; /* Light grey color for the separator */
}

/* Vertical line to the right of the Recipe button */
.tabs button:nth-child(2)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -15px; /* Ensure this line is aligned properly */
  transform: translateY(-50%);
  width: 2px;
  height: 50%;
  background-color: #D3D3D3; /* Light grey color for the separator */
}

.tabs button.active {
  color: #333; /* Darker color for active tab */
}

.tabs button.active::before {
  content: '';
  position: absolute;
  top: 0; /* Move the line to the top */
  left: 0;
  width: 100%;
  height: 3px;
  background: #6B705C;
  border-radius: 3px 3px 0 0;
  box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.2); /* Shadow to indicate active tab */
}


.tab-content {
  padding: 10px 0;
}

.nutrition-content {
  padding: 10px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #E0E0E0;
  padding: 8px 0;
}

.nutrition-item.sub-item {
  padding-left: 20px;
  color: #8A8A8A; /* Lighter color for sub-items */
}

.preparation-time {
  margin-top: 20px;
  font-style: italic;
  color: #6B705C;
}
.nutrition-label {
  display: flex;
  align-items: center;
}

.nutrition-label img {
  margin-right: 10px; /* Adjusts space between icon and text */

}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adjust the gap between cards as needed */
  max-height: 100vh; /* Set a fixed height for the container */
}

.scrollable-content {
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Disable horizontal scrolling */
  word-wrap: break-word; /* Wrap long words */
  max-height: 95%; /* Set a fixed height for the content */
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.horizontal-card {
  flex-direction: row; /* Arrange content horizontally */
  width: 100%; /* Full width for horizontal layout */
}

.card img {
  max-width: 100px; /* Adjust the image size as needed */
  border-radius: 4px;
  margin-right: 16px; /* Space between image and text */
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1em; /* Larger text for the title */
  margin: 0;
  font-weight: bold; /* Bold title for better readability */
}

.card-details {
  font-size: 1em; /* Smaller text for the details */
  margin: 4px 0 0; /* Adjust margin as needed */
}
</style>