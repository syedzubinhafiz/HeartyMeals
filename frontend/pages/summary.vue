<template>
  <div class="page-container">
    <header class="header">
      <Header></Header>
    </header>
    
    <div class="left-base">
      <img :src="leftBase" class="left-decoration">
    </div>
    
    <div class="right-base">
      <img :src="rightBase" class="right-decoration">
    </div>

    <div class="back-button" @click="back">
      <img src="@/assets/icon/white-back-icon.svg" alt="Back" class="back-icon">
      <span class="back-text">Back</span>
    </div>

    <div class="title">
      <h1>Summary</h1>
    </div>

    <div class="body">
      <div class="summary-content">
        <div class="selected-meal-container">
          <div v-for="meal in selectedMeals" :key="meal.id" class="meal">
            <button class="remove-selected-meal" @click="removeSelectedMeal(meal.id)">×</button>
            <div class="image-container">
              <img :src="meal.recipe.storage_links.thumbnail" alt="Meal">
            </div>
            
            <div class="meal-info">
              <span class="meal-name">{{ meal.recipe.name }}</span>

              <div class="nutrition-list-container">
                <div class="nutrient-label">
                  <label>Calories:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.calories * (meal.portion/meal.recipe.serving_size)).toFixed(1))}}</span>
                    <label> cal</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Carbs:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.totalCarbohydrate * (meal.portion/meal.recipe.serving_size)).toFixed(1))}}</span>
                    <label> g</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Protein:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.protein * (meal.portion/meal.recipe.serving_size)).toFixed(1))}}</span>
                    <label> g</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Fats:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.fat * (meal.portion/meal.recipe.serving_size)).toFixed(1))}}</span>
                    <label> g</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Sodium:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.sodium * (meal.portion/meal.recipe.serving_size)).toFixed(1))}}</span>
                    <label> mg</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Cholesterol:</label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.cholesterol * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> mg</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="portion-setting">
              <input 
                class="serving-input"
                type="number" 
                v-model="meal.portion" 
                @input="updateChanges(meal.id, meal.portion)" 
                min="0.5" 
                step="0.5"
                placeholder="Serving"
              >
            </div>
          </div>
        </div>

        <div class="nutrition-widget">
          <span class="nutrition-title">Total Nutrition</span>
          <div v-for="(nutrient, index) in nutrients" :key="index" class="tooltip-wrapper">
            <div 
              class="tooltip-container"
              @mouseenter="showTooltip(index)" 
              @mouseleave="hideTooltip"
            >
              <!-- Nutrition Bar Component -->
              <NutritionBar
                :icon="nutrient.icon"
                :label="nutrient.label"
                :totalValue="userDailyBudget[nutrient.key]"
                :currentValue="userDailyBudget[nutrient.key] - baseRemainingNutrients[nutrient.key]"
                :afterMealValue="userDailyBudget[nutrient.key] - userAfterMealNutrients[nutrient.key]"
                :unit="nutrient.unit"
                :maxColor="nutrient.maxColor"
                :currentColor="nutrient.currentColor"
                :afterMealColor="nutrient.afterMealColor"
                :fontColor="nutrient.fontColor"
                :progressBarContainerStyle="'margin-top: 2.5%; margin-bottom: 2.5%;'"
              />
              
              <!-- Custom Tooltip -->
              <div v-if="activeTooltip === index" class="custom-tooltip">
                <div v-for="line in tooltips[index]" :key="line">
                  {{ line }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Done button positioned in main content area -->
    <div class="done-button" @click="logMeal">
      <img src="@/assets/icon/done-icon.svg" alt="Done" class="done-icon">
      <span class="done-text">Done</span>
    </div>
    
    <footer class="footer">
      <Footer></Footer>
    </footer>

    <div v-if="isLoading" class="loading-greyed-bg">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp, navigateTo } from "#app";
import { useToast } from "vue-toast-notification";
import leftBase from "@/assets/img/meal_logging/summary_left_base.svg";
import rightBase from "@/assets/img/meal_logging/summary_right_base.svg";
import NutritionBar from "~/components/Nutrient/NutritionBar.vue";
import { useMealLoggingStore } from '@/stores/mealLogging.js';
import usePersistMeals from '@/composables/persistMeals.js';

const {$axios} = useNuxtApp();

const isLoading = ref(false);
const mealStore = useMealLoggingStore();
const selectedMeals = computed(() => mealStore.unsavedMealList); // reactive computed property
const mealInfo = ref({});
const userDailyBudget = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});
const userRemainingNutrients = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});
const userAfterMealNutrients = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});

// ADD base remaining nutrients to preserve original remaining budget before selected meals are consumed
const baseRemainingNutrients = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});

const nutrients =  [
  {
    key: 'calories',
    icon: "/assets/img/caloriesIcon.png",
    label: 'Calories',
    unit: 'cal',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
  {
    key: 'carbs',
    icon: "/assets/img/carbIcon.png",
    label: 'Carbs',
    unit: 'g',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
  {
    key: 'protein',
    icon: "/assets/img/proteinIcon.png",
    label: 'Protein',
    unit: 'g',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
  {
    key: 'fat',
    icon: "/assets/img/fatsIcon.png",
    label: 'Fats',
    unit: 'g',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
  {
    key: 'sodium',
    icon: "/assets/img/sodiumIcon.png",
    label: 'Sodium',
    unit: 'mg',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
  {
    key: 'cholesterol',
    icon: "/assets/img/cholesterolsIcon.png",
    label: 'Cholesterol',
    unit: 'mg',
    maxColor: '#e9e5cd',
    currentColor: '#d7d1b4',
    afterMealColor: '#b8b396',
    fontColor: '#b8b396',
  },
];

const activeTooltip = ref(null);
const tooltips = ref([]);

function showTooltip(index) {
  const nutrient = nutrients[index];
  const currentConsumed = userDailyBudget.value[nutrient.key] - baseRemainingNutrients.value[nutrient.key];
  const afterMealConsumed = userDailyBudget.value[nutrient.key] - userAfterMealNutrients.value[nutrient.key];
  const dailyBudget = userDailyBudget.value[nutrient.key];
  
  tooltips.value[index] = [
    `Current consumed: ${Math.max(0, currentConsumed.toFixed(1))} ${nutrient.unit}`,
    `After meal consumed: ${Math.max(0, afterMealConsumed.toFixed(1))} ${nutrient.unit}`,
    `Daily budget: ${dailyBudget} ${nutrient.unit}`
  ];
  
  activeTooltip.value = index;
}

function hideTooltip() {
  activeTooltip.value = null;
}

definePageMeta({
  layout: "emptylayout",
  middleware: ["auth"]
});

onMounted(() => {
  if(localStorage.getItem("mealInfo")){
    mealInfo.value = JSON.parse(localStorage.getItem("mealInfo"));
    const currentTime = new Date().getTime();
    const expiryTime = mealInfo.value.expiryTime;
    if (currentTime > expiryTime){
      localStorage.removeItem("mealInfo");
      useToast().warning("Session expired, redirecting to previous page");
      
      if (mealInfo.value.logType === "planning"){
        setTimeout(async () => {
          await navigateTo("/meal-planning");
        }, 1500);    
      } else {
        setTimeout(async () => {
          await navigateTo("/meal-logging");
        }, 1500);
      }
    }
  } else {
    navigateTo("/meal-logging");
  }

  // Load nutrition data from localStorage
  if(localStorage.getItem('userNutrientsInfo')){
    const nutritionData = JSON.parse(localStorage.getItem('userNutrientsInfo'));
    userDailyBudget.value = nutritionData[0];
    userRemainingNutrients.value = nutritionData[1];
    userAfterMealNutrients.value = nutritionData[2];
    baseRemainingNutrients.value = { ...userRemainingNutrients.value };
  }

  console.log('[summary] Selected meals from store:', selectedMeals.value);
  console.log('[summary] mealInfo:', mealInfo.value);
  console.log('[summary] userDailyBudget:', userDailyBudget.value);
  console.log('[summary] userRemainingNutrients:', userRemainingNutrients.value);
  console.log('[summary] userAfterMealNutrients:', userAfterMealNutrients.value);

  calculateAfterMealNutrients();
});

function calculateAfterMealNutrients() {
  const remainingCopy = { ...baseRemainingNutrients.value };
  selectedMeals.value.forEach((meal) => {
    const nutritionInfo = meal.recipe?.nutrition_info || {};
    const portion = meal.portion || 1;
    const servingSize = meal.recipe?.serving_size || 1;
    const multiplier = portion / servingSize;

    remainingCopy.calories = parseFloat(Math.max(0, remainingCopy.calories - (nutritionInfo.calories || 0) * multiplier).toFixed(2));
    remainingCopy.carbs = parseFloat(Math.max(0, remainingCopy.carbs - (nutritionInfo.totalCarbohydrate || 0) * multiplier).toFixed(2));
    remainingCopy.protein = parseFloat(Math.max(0, remainingCopy.protein - (nutritionInfo.protein || 0) * multiplier).toFixed(2));
    remainingCopy.fat = parseFloat(Math.max(0, remainingCopy.fat - (nutritionInfo.fat || 0) * multiplier).toFixed(2));
    remainingCopy.sodium = parseFloat(Math.max(0, remainingCopy.sodium - (nutritionInfo.sodium || 0) * multiplier).toFixed(2));
    remainingCopy.cholesterol = parseFloat(Math.max(0, remainingCopy.cholesterol - (nutritionInfo.cholesterol || 0) * multiplier).toFixed(2));
  });

  userAfterMealNutrients.value = remainingCopy;
}

function updateChanges(id, portion) {
  const meal = selectedMeals.value.find((m) => m.id === id);
  if (meal) {
    meal.portion = portion;
    calculateAfterMealNutrients();
  }
}

function removeSelectedMeal(id) {
  mealStore.removeMeal(id);
  calculateAfterMealNutrients();
}

function back() {
  navigateTo("/add-meals");
}

async function logMeal() {
  isLoading.value = true;
  const { saveUnsavedMeals } = usePersistMeals();
  
  try {
    const loggedMeals = await saveUnsavedMeals(mealInfo.value);
    
    if(loggedMeals){
      mealStore.clearUnsavedList();
      localStorage.removeItem("mealInfo");
      localStorage.removeItem('userNutrientsInfo');
      
      useToast().success("Meals logged successfully!");
      
      if (mealInfo.value.logType === "planning"){
        setTimeout(async () => {
          await navigateTo("/meal-planning");
        }, 1500);    
      } else {
        setTimeout(async () => {
          await navigateTo("/meal-logging");
        }, 1500);
      }
    }
  } catch (error) {
    console.error('Error logging meals:', error);
    useToast().error("Failed to log meals. Please try again.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');

* {
  font-family: 'Overpass', sans-serif;
  box-sizing: border-box;
}

/* Desktop-first styles (original layout) */
.header, .footer {
  position: fixed;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 40;
}

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 0;
}

.left-base {
  position: absolute;
  top: 20%;
  left: 0;
}

.left-decoration {
  width: 85%;
}

.right-base {
  position: absolute;
  top: 9%;
  right: 0;
}

.right-decoration {
  width: 100%;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 5rem;
  margin-bottom: 2.5rem;
}

.back-button {
  position: absolute;
  width: fit-content;
  top: 15%; /* Position below title but above content */
  left: 5%; /* Align with meal container */
  z-index: 20; /* lower than header (40) so header layers above */
  padding: 8px 12px;
  background-color: #87A98D;
  color: #FFFEF1;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-items: center;
  border-radius: 15px;
  gap: 8px;
}

.back-button:hover {
  background-color: #749279;
}

.back-icon {
  height: 16px;
  width: 16px;
}

.back-text {
  font-size: 1rem;
}

.done-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #87A98D;
  color: #FFFEF1;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 20;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.2s;
}

.done-button:hover,
.done-button:focus {
  background-color: #749279;
}

.done-icon {
  height: 20px;
  width: 20px;
}

.done-text {
  font-size: 1.2rem;
}

.body {
  width: 100%;
  height: 100%;
  padding: 0 1rem 2rem 1rem;
  box-sizing: border-box;
}

.summary-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 4rem;
  max-width: 1100px;
  margin: 6rem auto 0 auto;
  width: 100%;
  min-height: 60vh;
}

.selected-meal-container {
  flex: 2;
  min-width: 320px;
  max-width: 600px;
  margin-right: 0;
  position: relative;
  overflow-y: auto;
  padding: 1rem 0.5rem;
  background: none;
}

.nutrition-widget {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  margin-left: 0;
  padding: 2rem 1.5rem 2.5rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
  background-color: #FFFEF1;
}

.remove-selected-meal {
  position: absolute;
  top: 4%;
  right: 2.5%;
  font-size: 1.7rem;
  font-weight: bold;
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal {
  position: relative;
  width: 100%;
  min-height: 120px;
  background-color: #FFFEF1;
  margin: 0 0 2rem 0;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
  padding: 1.5rem 1rem;
}

.image-container img {
  width: 115px;
  height: 115px;
  object-fit: cover;
  border-radius: 15px;
  padding: 5%;
}

.meal-info {
  width: 70%;
  height: 80%;
  display: flex;
  flex-direction: column;
}

.meal-name {
  font-size: 1.2rem;
  padding-left: 1.5%;
  font-weight: bolder;
  width: 100%;
}

.nutrient-label {
  display: grid;
  grid-template-columns: 40% 60%;
}

.nutrient-label label {
  font-size: 0.8rem;
  font-weight: bold;
}

.nutrient-label span {
  padding-left: 5%;
  padding-right: 1%;
  font-size: 0.8rem;
}

.nutrition-list-container {
  display: grid;
  grid-template-columns: 50% 50%;
  padding-left: 1.5%;
  padding-top: 0.5%;
}

.portion-setting {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.serving-input {
  width: 70%;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  text-align: center;
  margin-top: 5%;
  padding: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
}

.nutrition-widget {
  background-color: #FFFEF1;
  padding: 1.5% 2.5% 2.5rem 2.5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
  margin-bottom: 2.5rem;
}

.nutrition-title {
  font-weight: 600;
  font-size: 150%;
  margin-left: -5%;
  margin-bottom: 1rem;
}

.tooltip-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 0%;
}

.tooltip-container {
  position: relative;
  cursor: initial;
}

.custom-tooltip {
  position: absolute;
  top: -100%; 
  left: 75%;
  transform: translateX(-50%);
  background-color: rgb(227, 212, 190);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 2vh;
  z-index: 10;
  width: 25vh;
  cursor: initial;
  font-size: 90%;
  font-weight: 600;
  padding: 2vh;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: 1; 
}

.loading-greyed-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 100px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 15px solid #FFFEF1;
  border-right-color: #87A98D;
  animation: l2 1s infinite linear;
}

@keyframes l2 {
  to { transform: rotate(1turn); }
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .left-base,
  .right-base {
    display: none; /* Hide decorative elements on mobile */
  }

  .title {
    position: relative;
    top: auto;
    left: auto;
    text-align: center;
    margin: 0.75rem 0 0.5rem 0;
    font-size: 1.5rem;
    padding-top: 64px; /* Account for fixed header */
  }

  .back-button {
    position: relative;
    top: auto;
    left: auto;
    /* push below the fixed header (≈64px) plus small gap */
    margin: 4.25rem 0 1rem 0;
    padding: 10px 14px;
    align-self: flex-start;
    z-index: 20;
  }

  .body {
    padding: 0.75rem 1rem 1.5rem 1rem;
  }

  .summary-content {
    gap: 1.5rem;
    margin: 1.5rem 0.25rem 0 0.25rem;
  }

  .selected-meal-container {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: auto;
    max-height: 60vh;
    order: 1;
    padding: 0.5rem 0.25rem;
  }

  .meal {
    width: 100%;
    height: auto;
    min-height: 120px;
    margin: 0 0 1.25rem 0;
    flex-direction: column;
    padding: 1rem 0.5rem;
  }

  .image-container {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .image-container img {
    width: 80px;
    height: 80px;
    padding: 0;
  }

  .meal-info {
    width: 100%;
    height: auto;
    text-align: center;
  }

  .meal-name {
    font-size: 1.1rem;
    padding-left: 0;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .nutrition-list-container {
    grid-template-columns: 1fr 1fr;
    padding-left: 0;
    gap: 0.5rem;
  }

  .nutrient-label {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.25rem;
  }

  .nutrient-label label {
    font-size: 0.75rem;
  }

  .nutrient-label span {
    padding-left: 0;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .portion-setting {
    width: 100%;
    margin-top: 0.5rem;
  }

  .serving-input {
    width: 100px;
    margin-top: 0;
    font-size: 1rem;
    padding: 8px;
  }

  .remove-selected-meal {
    top: 8px;
    right: 8px;
    font-size: 1.5rem;
    width: 32px;
    height: 32px;
  }

  .nutrition-widget {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    min-height: 40vh;
    max-height: 60vh;
    height: auto;
    flex-grow: 1;
    order: 2;
    margin: 0.5rem 0 1.5rem 0;
    padding: 1.25rem 0.75rem 1.5rem 0.75rem;
  }

  .nutrition-title {
    font-size: 1.25rem;
    margin-left: 0;
    text-align: center;
    margin-bottom: 1rem;
  }

  .done-button {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    /* Extra space above & below so it sits on beige background and clears fixed footer */
    margin: 2.5rem auto 4rem auto;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    z-index: 20;
  }

  .page-container {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding-bottom: 64px; /* Space for footer */
  }

  .custom-tooltip {
    left: 50%;
    width: 180px;
    font-size: 0.75rem;
    padding: 0.75rem;
    top: -120%; /* Better positioning for mobile */
  }
}

@media (max-width: 900px) {
  .summary-content {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    margin: 2rem 0 0 0;
  }
  .selected-meal-container,
  .nutrition-widget {
    max-width: 100%;
    min-width: 0;
    margin-left: 0;
    margin-right: 0;
  }
  .nutrition-widget {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .body {
    padding: 0.75rem 1rem 1.5rem 1rem;
  }
  .meal,
  .nutrition-widget {
    width: 100%;
    max-width: none;
    margin: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  .body {
    padding: 0.5rem 0.75rem 1rem 0.75rem;
  }
  .meal,
  .nutrition-widget {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

.serving-input:focus,
.remove-selected-meal:focus,
.done-button:focus,
.back-button:focus {
  outline: 2px solid #87A98D;
  outline-offset: 2px;
}
</style>