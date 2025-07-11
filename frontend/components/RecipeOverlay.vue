<template>
  <div class="overlay" v-if="visible" @click.self="closeOverlay">
    <div class="overlay-content" @click.stop>
      <!-- Close button -->
      <button class="close-button" @click="closeOverlay">×</button>
      
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
              <span>{{meal.recipe.nutrition_info.calories}}cal</span>
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
          <div v-if="activeTab === 'recipe'" v-html="instruction"></div>
          <div v-if="activeTab === 'ingredients'">
            <!-- Ingredients Content -->
            <div class="card-grid">
              <div v-for="ingredient in props.meal.components.ingredients" :key="ingredient.name" class="card horizontal-card">
                <img :src="ingredient.storage_links.thumbnail" :alt="ingredient.name" />
                <div class="card-content">
                  <p class="card-title">{{ ingredient.name }}</p>
                  <p class="card-details">{{ `Amount: ${ingredient.amount.toFixed(2)} ${ingredient.unit}` }}</p>
                </div>
              </div>

              <div v-for="seasoning in props.meal.components.seasonings" :key="seasoning.name" class="card horizontal-card">
                <img :src="seasoning.storage_links.thumbnail" :alt="seasoning.name" />
                <div class="card-content">
                  <p class="card-title">{{ seasoning.name }}</p>
                  <p class="card-details">{{ `Amount: ${seasoning.amount.toFixed(2)} ${seasoning.unit}` }}</p>
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
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 50;
  overflow-y: auto;
  padding: 1rem;
}

.overlay-content {
  background: #DAC2A8;
  padding: 1rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  height: calc(100dvh - 2rem);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: #333;
  cursor: pointer;
  z-index: 100;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.close-button:active {
  transform: translateY(0);
  background: rgba(0, 0, 0, 0.2);
}

.left-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-section h2 {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 45px;
  margin-bottom: 1rem;
}

.left-section img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  flex: 1;
  min-height: 0;
}

.right-section {
  width: 100%;
  margin-top: 1rem;
  background: #F3EADA;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tabs {
  display: flex;
  justify-content: space-around;
  position: relative;
  border-bottom: 1px solid #D3D3D3;
  flex-shrink: 0;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  color: #8A8A8A;
  position: relative;
  transition: color 0.3s ease;
  border-radius: 0;
  flex: 1;
  text-align: center;
}

.tabs button:not(:last-child) {
  margin-right: 0;
}

.tabs button.active {
  color: #333;
}

.tabs button.active::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #6B705C;
}

.tab-content {
  padding: 10px 0;
  overflow-y: auto;
  flex: 1;
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
  margin-right: 10px;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.scrollable-content {
  overflow-y: visible;
  overflow-x: hidden;
  word-wrap: break-word;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex: 1 1 100%;
}

.horizontal-card {
  flex-direction: row;
  width: 100%;
}

.card img {
  max-width: 100px;
  border-radius: 4px;
  margin-right: 16px;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1em;
  margin: 0;
  font-weight: bold;
}

.card-details {
  font-size: 1em;
  margin: 4px 0 0;
}

@media (min-width: 768px) {
  .overlay-content {
    flex-direction: row;
    padding: 2rem;
    height: auto;
  }
  .back-button {
    top: 20px;
    left: 20px;
  }
  .left-section {
    flex: 1;
    margin-right: 2rem;
    justify-content: center;
  }
  .left-section h2 {
    font-size: 2rem;
    margin-top: 0;
  }
  .right-section {
    flex: 1.2;
    margin-top: 0;
  }
  .tabs button {
    font-size: 1.2rem;
  }
  .card {
    flex-basis: calc(50% - 8px);
  }
}
</style>