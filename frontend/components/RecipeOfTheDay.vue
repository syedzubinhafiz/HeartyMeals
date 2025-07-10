<template>
  <div class="recipe-of-the-day-container">
    <img src="@/assets/img/Texture.svg" alt="Hearty Meal" class="recipe-of-the-day-bg">

    <div class="recipe-of-the-day-overlay" @click="navigateToRecipeLibrary()">
      <h2 class="recipe-of-the-day-title">Recipe of the Day</h2>
      
      <div class="recipe-of-the-day-content">
        <div class="recipe-image-container">
          <img :src="imageSrc" alt="Recipe Image" class="recipe-image" @error="handleImageError">
        </div>
        <div class="recipe-details">
          <div class="recipe-name-container">
            <h3 class="recipe-name">{{ truncatedName }}</h3>
            <div 
              class="view-nutrition-info"
              @mouseover="showNutrition = true" 
              @mouseleave="showNutrition = false"
              @click.stop
            >
              <img src="@/assets/img/Info_alt_light.png" alt="Info" class="info-icon">
              <div 
                v-if="showNutrition" 
                class="nutrition-info-container"
              >
                <div class="nutrition-grid">
                  <span>{{ props.recipeNutrition.calories }}cal</span>
                  <span>{{ props.recipeNutrition.protein }}g protein</span>
                  <span>{{ props.recipeNutrition.fat }}g fat</span>
                  <span>{{ props.recipeNutrition.carbohydrates }}g carbs</span>
                </div>
              </div>
            </div>
          </div>
          <p class="recipe-description">{{ truncatedDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import placeholderImg from "@/assets/img/nasiAyam.png";

const props = defineProps({
  recipeName: {
    type: String,
    default: "Heart-Healthy Nasi Ulam (Herb Rice)",
    required: true
  },
  recipeDescription: {
    type: String,
    default: "Traditional Malaysian herb rice with fresh local herbs, reduced-fat coconut, and toasted ikan bilis",
    required: true
  },
  recipeImage: {
    type: String,
    default: "/assets/img/nasiAyam.png",
    required: false
  },
  recipeId: {
    type: String,
    default: "1",
    required: true
  },
  recipeNutrition: {
    type: Object,
    default: () => ({
      calories: 350,
      fat: 12,
      sodium: 420,
      protein: 15,
      carbohydrates: 45,
      cholesterol: 25
    }),
    required: true
  }
});

const imageSrc = ref(props.recipeImage || placeholderImg);

// Computed properties for text truncation
const truncatedName = computed(() => {
  // More aggressive truncation for mobile
  const isMobile = window?.innerWidth <= 480;
  const maxLength = isMobile ? 25 : 35;
  return props.recipeName.length > maxLength ? props.recipeName.substring(0, maxLength) + '...' : props.recipeName;
});

const truncatedDescription = computed(() => {
  // More aggressive truncation for mobile
  const isMobile = window?.innerWidth <= 480;
  const maxLength = isMobile ? 80 : 120;
  return props.recipeDescription.length > maxLength ? props.recipeDescription.substring(0, maxLength) + '...' : props.recipeDescription;
});

watch(() => props.recipeImage, (newVal) => {
  imageSrc.value = newVal || placeholderImg;
});

function handleImageError() {
  imageSrc.value = placeholderImg;
}

const showNutrition = ref(false);

async function navigateToRecipeLibrary() {
  // Navigate to recipe library
  // use props to get data
  localStorage.setItem('recipeId', props.recipeId);

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
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.5rem;
  overflow: visible !important;
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
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-height: 200px;
  justify-content: center;
  overflow: visible !important;
}

.recipe-of-the-day-overlay:hover {
  transform: scale(1.01);
}

.recipe-of-the-day-title {
  font-size: clamp(1.2rem, 3.5vw, 1.6rem);
  font-weight: 600;
  width: 100%;
  margin: 0;
  line-height: 1.2;
}

.recipe-of-the-day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;
  padding: 0 0.5rem;
}

.recipe-image-container {
  width: 100%;
  max-width: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
  object-fit: cover;
  box-shadow: 0 3px 8px rgba(0,0,0,0.3);
  border: 1.5px solid rgba(255,255,255,0.2);
}

.recipe-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  flex: 1;
  padding: 0 0.5rem;
}

.recipe-name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  width: 100%;
}

.recipe-name {
  font-size: clamp(0.9rem, 2.6vw, 1.1rem);
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.recipe-description {
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  line-height: 1.3;
  max-width: 38ch;
  margin: 0;
  text-align: center;
  opacity: 0.95;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.view-nutrition-info {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.view-nutrition-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.info-icon {
  width: 0.9rem;
  height: 0.9rem;
  opacity: 0.9;
}

.nutrition-info-container {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  color: black;
  padding: 0.6rem;
  border-radius: 0.4rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  width: max-content;
  z-index: 10;
  text-align: center;
  font-size: 0.7rem;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem 0.8rem;
  text-align: center;
}

.nutrition-grid span {
  white-space: nowrap;
  font-weight: 500;
}

/* Mobile-first responsive adjustments */
@media (max-width: 380px) {
  .recipe-of-the-day-container {
    padding: 0.4rem;
  }

  .recipe-of-the-day-overlay {
    padding: 1.25rem 1rem;
    gap: 0.6rem;
    min-height: 180px;
  }

  .recipe-of-the-day-content {
    padding: 0 0.25rem;
  }

  .recipe-image-container {
    max-width: 65px;
  }

  .recipe-details {
    padding: 0 0.25rem;
  }

  .recipe-name {
    font-size: 0.8rem;
    line-height: 1.1;
  }

  .recipe-description {
    font-size: 0.7rem;
    max-width: 26ch;
  }

  .info-icon {
    width: 0.8rem;
    height: 0.8rem;
  }

  .nutrition-info-container {
    font-size: 0.65rem;
    padding: 0.5rem;
  }

  .nutrition-grid {
    gap: 0.2rem 0.6rem;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .recipe-of-the-day-overlay {
    padding: 1.3rem 1.1rem;
    gap: 0.7rem;
  }

  .recipe-of-the-day-content {
    padding: 0 0.4rem;
  }

  .recipe-image-container {
    max-width: 85px;
  }

  .recipe-details {
    padding: 0 0.4rem;
  }

  .recipe-description {
    max-width: 32ch;
  }
}

@media (min-width: 768px) {
  .recipe-of-the-day-container {
    padding: 0.75rem;
  }

  .recipe-of-the-day-overlay {
    gap: 1rem;
    padding: 1.75rem 1.75rem;
    min-height: 220px;
  }
  
  .recipe-of-the-day-content {
    flex-direction: row;
    align-items: center;
    gap: 1.75rem;
    justify-content: center;
    max-width: 100%;
    padding: 0 1rem;
  }

  .recipe-image-container {
    width: auto;
    max-width: 100px;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .recipe-details {
    align-items: flex-start;
    text-align: left;
    flex: 1;
    max-width: 280px;
    padding: 0 1rem 0 0;
  }

  .recipe-name-container {
    justify-content: flex-start;
  }

  .recipe-name {
    text-align: left;
  }

  .recipe-description {
    text-align: left;
    max-width: 100%;
  }

  .info-icon {
    width: 1rem;
    height: 1rem;
  }

  .nutrition-info-container {
    font-size: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .recipe-of-the-day-overlay {
    padding: 2rem 2rem;
    min-height: 240px;
  }

  .recipe-of-the-day-content {
    gap: 2rem;
    padding: 0 1.25rem;
  }

  .recipe-image-container {
    max-width: 110px;
    margin-left: 0.75rem;
  }

  .recipe-details {
    max-width: 300px;
    padding: 0 1.25rem 0 0;
  }
}
</style>
