<template>
  <div class="recipe-of-the-day-container">
    <img src="@/assets/img/Texture.svg" alt="Hearty Meal" class="recipe-of-the-day-bg">

    <div class="recipe-of-the-day-overlay">
      <div class="recipe-of-the-day-title">
        <h2>Recipe of the Day</h2>
      </div>      
      <div class="recipe-of-the-day-content">
        <div class="recipe-of-the-day-column-left">
          <p class="recipe-description">
            {{ recipeDescription }}
          </p>
          <div class="items-center justify-center flex flex-col" @click="navigateToRecipeLibrary()" style="cursor: pointer">
            <img src="@/assets/img/IconGetRecipe.png" alt="Hearty Meal" class="w-fit h-fit z-0">
            <p class="-translate-y-3">Get Recipe</p>
          </div>
        </div>
        <div class="recipe-of-the-day-column-right">
          <img :src="recipeImage" alt="Hearty Meal" class="recipe-image">
          <h2 class="text-justify -translate-y-6">{{ recipeName }}</h2>
        </div>
      </div>
      <div 
        class="view-nutrition-info"
        @mouseover="showNutrition = true" 
        @mouseleave="showNutrition = false"
      >
        <p>View nutritional information</p>
        <img src="@/assets/img/Info_alt_light.png" alt="Hearty Meal" class="w-6 h-6 z-0">
        <div 
          v-if="showNutrition" 
          class="absolute bottom-10 right-0 bg-white text-black p-4 rounded-lg shadow-lg nutrition-info-container"
          style="display: flex; column-gap: 15%; align-items: center; width: 35vh;"
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
  }
/* Tailwind CSS handles most styling; no additional CSS is required */
.recipe-of-the-day-container {
  position: relative;
  width: 90vh;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0 auto; 
}

@media (max-width: 768px) {
  .recipe-of-the-day-container {
    width: 95vw;
    height: 70vh;
    min-height: 500px;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .recipe-of-the-day-container {
    width: 75vh;
    height: 75vh;
  }
}

.recipe-of-the-day-bg {
  object-fit: cover;
  max-width: 100%;
}

.recipe-of-the-day-overlay {
  position: absolute; /* Overlay content */
  width: 90vh; /* Full width */
  height: 55vh; /* Full height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

@media (max-width: 768px) {
  .recipe-of-the-day-overlay {
    width: 95vw;
    height: 65vh;
    padding: 1rem;
  }
}


.recipe-of-the-day-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 4%;
}

.recipe-of-the-day-content {
  display: flex; /* Flex container for left and right columns */
  width: 100%; /* Full width */
  height: 50%; 
  flex: 1; /* Make it fill available space */
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
}

@media (max-width: 768px) {
  .recipe-of-the-day-content {
    flex-direction: column;
    height: auto;
    gap: 1rem;
  }
}


.recipe-of-the-day-column-left  {
  width: 60%; /* Each column takes up half the space */
  display: flex;
  flex-direction: column; /* Stack content vertically within each column */
  align-items: center; /* Center items in each column */
  justify-content: center; /* Center items in each column */
}

@media (max-width: 768px) {
  .recipe-of-the-day-column-left {
    width: 100%;
    order: 2;
  }
}

.recipe-of-the-day-column-right {
  width: 40%; /* Each column takes up half the space */
  display: flex;
  flex-direction: column; /* Stack content vertically within each column */
  align-items: center; /* Center items in each column */
  justify-content: center; /* Center items in each column */
}

@media (max-width: 768px) {
  .recipe-of-the-day-column-right {
    width: 100%;
    order: 1;
  }
}

.recipe-description {
  font-size: 100%;
  width: 400px;
  height: fit-content;
  max-height: 200px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .recipe-description {
    width: 100%;
    max-width: 350px;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 1rem;
  }
}

.recipe-image{
  height: 200px; 
  width: 200px;
  border-radius: 10px;
  margin-bottom: 15%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .recipe-image {
    height: 150px;
    width: 150px;
    margin-bottom: 0.5rem;
  }
}

.view-nutrition-info {
  position: absolute;
  bottom: 5%;
  right: 9%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12px;
  width: 100%;
  font-size: 0.75rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .view-nutrition-info {
    position: relative;
    bottom: auto;
    right: auto;
    justify-content: center;
    width: auto;
    margin-top: 1rem;
    padding-right: 0;
  }
}

.nutrition-info-container p {
  margin-bottom: 2.5%;
}

@media (max-width: 768px) {
  .nutrition-info-container {
    width: 90vw !important;
    max-width: 300px;
    bottom: auto !important;
    top: 100%;
    right: 50% !important;
    transform: translateX(50%);
    font-size: 0.8rem;
  }
  
  .recipe-of-the-day-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}
</style>
