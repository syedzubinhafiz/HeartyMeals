<template>
  <div class="overlay" v-if="visible" @click.self="closeOverlay">
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
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  width: 75vw; /* 75% of the viewport width */
  height: 75vh; /* 75% of the viewport height */
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-section img {
  width: 100%;
  border-radius: 10px;
}

.right-section {
  flex: 1; /* slightly wider for better readability */
  padding-left: 20px;
  background: #FAF5E9; /* Light background color for the right section */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  position: relative;
}

.tabs button.active {
  border-bottom: 3px solid #6B705C; /* A darker color for active tab */
  color: #6B705C;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #6B705C;
  border-radius: 3px 3px 0 0;
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
