<template>
  <div class="recipe-of-the-day-container">
    <img src="@/assets/img/Texture.svg" alt="Hearty Meal" class="recipe-of-the-day-bg">

    <div class="recipe-of-the-day-overlay">
      <h2 class="recipe-of-the-day-title">Recipe of the Day</h2>
      
      <div class="recipe-of-the-day-content">
        <div class="recipe-image-container">
          <img :src="recipeImage" alt="Hearty Meal" class="recipe-image">
        </div>
        <div class="recipe-details">
          <h3 class="recipe-name">{{ recipeName }}</h3>
          <p class="recipe-description">{{ recipeDescription }}</p>
        </div>
      </div>

      <div class="recipe-of-the-day-footer">
        <div class="get-recipe-button" @click="navigateToRecipeLibrary()">
          <img src="@/assets/img/IconGetRecipe.png" alt="Get Recipe" class="get-recipe-icon">
          <span>Get Recipe</span>
        </div>
        <div 
          class="view-nutrition-info"
          @mouseover="showNutrition = true" 
          @mouseleave="showNutrition = false"
        >
          <span>View nutritional information</span>
          <img src="@/assets/img/Info_alt_light.png" alt="Info" class="info-icon">
          <div 
            v-if="showNutrition" 
            class="nutrition-info-container"
          >
            <div>
              <p>Calories: {{ recipeNutrition.calories }}cal</p>
              <p>Sodium: {{ recipeNutrition.sodium }}mg</p>
              <p>Carbohydrates: {{ recipeNutrition.carbohydrates }}g</p>
            </div>
            <div>
              <p>Fat: {{ recipeNutrition.fat }}g</p>
              <p>Protein: {{ recipeNutrition.protein }}g</p>
              <p>Cholesterol: {{ recipeNutrition.cholesterol }}mg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recipeName: {
    type: String,
    default: "Nasi Ayam",
    required: true
  },
  recipeDescription: {
    type: String,
    default: "Packed with flavours and low on salt, this newly created nasi lemak recipe is a must have to expand your library of recipes.",
    required: true
  },
  recipeImage: {
    type: String,
    default: "@/assets/img/nasiAyam.png",
    required: true
  },
  recipeId: {
    type: String,
    default: "1",
    required: true
  },
  recipeNutrition: {
    type: Object,
    default: {
      calories: 0,
      fat: 0,
      sodium: 0,
      protein: 0,
      carbohydrates: 0,
      cholesterol: 0
    },
    required: true
  }
});

const recipeName = ref("");
const recipeDescription = ref("");
const recipeImage = ref("");
const recipeId = ref("");
const recipeNutrition = ref({
  calories: 0,
  fat: 0,
  sodium: 0,
  protein: 0,
  carbohydrates: 0,
  cholesterol: 0
});

// Watch for changes to props
watch(() => props.recipeName, (newVal, oldVal) => {
  recipeName.value = newVal;
});

watch(() => props.recipeDescription, (newVal, oldVal) => {
  recipeDescription.value = newVal;
});

watch(() => props.recipeImage, (newVal, oldVal) => {
  recipeImage.value = newVal;
});

watch(() => props.recipeId, (newVal, oldVal) => {
  recipeId.value = newVal;
});

watch(() => props.recipeNutrition, (newVal, oldVal) => {
  recipeNutrition.value.calories = newVal.calories;
  recipeNutrition.value.fat = newVal.fat;
  recipeNutrition.value.sodium = newVal.sodium;
  recipeNutrition.value.cholesterol = newVal.cholesterol;
  recipeNutrition.value.protein = newVal.protein;
  recipeNutrition.value.carbohydrates = newVal.carbohydrates;
}, { deep: true });

const showNutrition = ref(false);

async function navigateToRecipeLibrary() {
  // Navigate to recipe library
  // use props to get data
  localStorage.setItem('recipeId', recipeId.value);

  await navigateTo('/recipe-library');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
* {
  font-family: 'Overpass', sans-serif;
  box-sizing: border-box;
}

.recipe-of-the-day-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.recipe-of-the-day-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.recipe-of-the-day-overlay {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  gap: 1.5rem;
  padding: 1.5rem;
}

.recipe-of-the-day-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
}

.recipe-of-the-day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.recipe-image-container {
  width: 100%;
  max-width: 200px;
}

.recipe-image {
  width: 100%;
  max-width: 180px;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 0.75rem;
  object-fit: cover;
}

.recipe-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.recipe-name {
  font-size: clamp(1.125rem, 3vw, 1.25rem);
  font-weight: 600;
}

.recipe-description {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.4;
  max-width: 45ch;
}

.recipe-of-the-day-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.get-recipe-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: clamp(1rem, 3vw, 1.125rem);
}

.get-recipe-icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 0.5rem;
}

.view-nutrition-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.75rem, 2.5vw, 0.875rem);
  cursor: pointer;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nutrition-info-container {
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  color: black;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  gap: 1.5rem;
  width: max-content;
  z-index: 10;
  text-align: left;
}

@media (min-width: 768px) {
  .recipe-name {
    font-size: clamp(1.125rem, 3vw, 1.5rem);
  }
  .recipe-of-the-day-content {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  .recipe-image-container {
    width: 45%;
    order: 2; /* Image on the right */
  }

  .recipe-details {
    width: 55%;
    order: 1; /* Text on the left */
    align-items: flex-start;
    text-align: left;
  }
}
</style>
