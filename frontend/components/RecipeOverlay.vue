<template>
  <div class="overlay" v-if="visible" @click.self="closeOverlay">
    <!-- Back button -->
    <button class="back-button" @click="closeOverlay">← Back</button>
    
    <div class="overlay-content">
      <div class="left-section">
        <h2>{{ meal.mealName }}</h2>
        <img :src="meal.imageSrc" alt="Meal Image" />
      </div>
      <div class="right-section">
        <div class="tabs">
          <button :class="{ active: activeTab === 'nutrition' }" @click="activeTab = 'nutrition'">Nutrition Information</button>
          <button :class="{ active: activeTab === 'recipe' }" @click="activeTab = 'recipe'">Recipe</button>
        </div>
        <div class="tab-content">
          <div v-if="activeTab === 'nutrition'" class="nutrition-content">
            <!-- Nutrition Information Content -->
            <div class="nutrition-item">
              <span>Energy</span>
              <span>337kcal</span>
            </div>
            <div class="nutrition-item">
              <span>Fat</span>
              <span>18.0g</span>
            </div>
            <div class="nutrition-item sub-item">
              <span>Saturated fat</span>
              <span>12.0g</span>
            </div>
            <div class="nutrition-item">
              <span>Carbohydrates</span>
              <span>33.0g</span>
            </div>
            <div class="nutrition-item">
              <span>Sugar</span>
              <span>6.8g</span>
            </div>
            <div class="nutrition-item">
              <span>Protein</span>
              <span>10.0g</span>
            </div>
            <div class="nutrition-item">
              <span>Sodium</span>
              <span>0.9g</span>
            </div>
            <p class="preparation-time">* Preparation time: 10 minutes</p>
          </div>
          <div v-if="activeTab === 'recipe'">
            <!-- Recipe Content -->
            <p>Preparation time: 10 minutes</p>
            <!-- Add more recipe details here -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    meal: Object,
  },
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
  width: 80%; /* Reduced the image size to 80% of the container's width */
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

.tabs::after {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(100% / 2 - 1px); /* Center the separator between the tabs */
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


</style>