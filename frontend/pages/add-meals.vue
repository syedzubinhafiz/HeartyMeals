<template>
  <div class="page-container" @click="handleClickOutside">
    <header class="header">
      <Header></Header>
    </header>

    <div class="image-container">
      <img src="@/assets/img/recipe_lib/bg.svg" class="background-image"/>
      <div class="text-overlay">
        <h2 class="hero-title">Add Meals</h2>
      </div>
    </div>

    <div class="body">
      <div class="left-base">
        <img :src="leftBase" class="left-decoration">
      </div>
      
      <div class="right-base">
        <img :src="rightBase" class="right-decoration">
      </div>

      <!-- Desktop positioning (original) -->
      <div class="back-button">
        <ButtonOrange @click="back" class="back-btn">
          <span class="back-text">Back</span>
        </ButtonOrange>
      </div>
      
      <div class="stomach-button-container">
        <div v-if="selectedMeals.length > 0" class="counter">{{selectedMeals.length}}</div>
        <button @click="openStomachOverlay" class="shadow-md stomach-button">
          <img :src="stomachIcon" alt="Stomach" class="stomach-icon">
          <p class="stomach-text">Stomach</p>
        </button>
      </div>

      <!-- Mobile Controls Header -->
      <div class="mobile-controls">
        <ButtonOrange @click="back" class="back-btn mobile-back-btn">
          <span class="back-text">Back</span>
        </ButtonOrange>
        
        <div class="mobile-stomach-container">
          <div v-if="selectedMeals.length > 0" class="counter">{{selectedMeals.length}}</div>
          <button @click="openStomachOverlay" class="stomach-button mobile-stomach-btn">
            <img :src="stomachIcon" alt="Stomach" class="stomach-icon">
            <span class="stomach-text">Stomach</span>
          </button>
        </div>
      </div>

      <div class="search-bar" ref="searchBar">
        <img src="../assets/icon/Search_Icon.svg" alt="Search Icon" class="search-icon">
        <input
          type="text"
          v-model="query"
          @input="debouncedOnInput"
          placeholder="Enter Keywords (e.g. Chicken, Rice)"
          class="search-input"
          aria-label="Search Recipe"
        />
        <img :src="filter_on ? activeFilterIcon : filterIcon" alt="Filter" class="filter-button" @click="toggleFilterOverlay">
        <RecipeFilterOverlay 
          v-show="isFilterOverlayVisible" 
          @hideOverlay="isFilterOverlayVisible = false" 
          @applyFilters="applyFilters"
          @clearFilters="clearFilters"
         />
      </div>

      <div class="search-result-text-display">
        <p class="aligned-paragraph" v-if="query">Search Result of "{{ query }}"</p>
        <p class="aligned-paragraph" v-if="!query">Recently Added</p>
      </div>

      <div class="search-result-container" @scroll="onScroll">
        <div class="search-result-item-display">
          <div class="custom-recipe-card" id="follower" @click="openCustomRecipeOverlay">
            <img src="@/assets/icon/round-add-icon.svg" alt="Add" class="custom-add-icon">
            Customize Your Own Recipe 
          </div>          
          <RecipeCard 
            id="reference"
            v-for="(recipe, index) in searchResults" 
            :key="index"
            :meal-id="recipe.id" 
            :meal-name="recipe.name"
            :meal-description="recipe.description"
            :labels="recipe.recommended_meal_time ?? {}"
            :is-custom-recipe="recipe.user && recipe.user.user_id != null && recipe.user.user_id !== undefined"
            :is-admin-approved="recipe.is_approved"
            :image-src="recipe.storage_links.thumbnail"
            @click.native="openAddMealOverlay(recipe.id)"     
            class="recipe-card-item"
          />
          <div v-if="isLoading" class="loading-indicator">Loading...</div>
        </div>
      </div>
    </div>
    
    <CustomDishPopup v-model:isPopupOpen="isCustomRecipeOverlayVisible" @close="closeCustomRecipeOverlay" class="text-black"/>

    <StomachSidebar
      :visible="isStomachOverlayVisible"
      @closeSidebar="closeStomachOverlay"
      @updatePortion="updatePortion"
      @removeSelectedMeal="removeSelectedMeal"
      @logMeal="proceedToSummary"
      :selectedMeals="selectedMeals"
      :mealDate="mealInfo.logDate"
      :mealType="mealInfo.logType"
    />
    
    <AddMealsOverlay
      :visible="isAddMealOverlayVisible"
      :mealId="mealId" 
      :meal="recipeInfo"
      :userDailyBudget="userDailyNutrients"
      :userRemainingNutrients="userRemainingNutrients"
      @closeOverlay="closeAddMealOverlay"
      @addMeal="addMeal"
    />

    <footer class="footer">
      <Footer></Footer>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useNuxtApp, navigateTo, useRuntimeConfig } from "#app";
import { debounce } from "chart.js/helpers";
import { useToast } from "vue-toast-notification";
import RecipeCard from "@/components/RecipeCard.vue";
import RecipeFilterOverlay from "@/components/RecipeFilterOverlay.vue";
import StomachSidebar from "@/components/Stomach/StomachSidebar.vue";
import AddMealsOverlay from "@/components/AddMealsOverlay.vue";
import filterIcon from "@/assets/icon/filter-icon.svg";
import activeFilterIcon from "@/assets/icon/active-filter-icon.svg";
import stomachIcon from "@/assets/icon/stomach-icon.svg";
import leftBase from "@/assets/img/meal_logging/left_base.svg";
import rightBase from "@/assets/img/meal_logging/right_base.svg";
import CustomDishPopup from '~/components/CustomDish/Popup.vue';
import { useMealLoggingStore } from '@/stores/mealLogging.js';

definePageMeta({
  layout: "emptylayout",
  middleware: ["auth"],
  components: {
    RecipeCard,
    RecipeFilterOverlay,
    StomachSidebar,
    AddMealsOverlay,
    CustomDishPopup,
  },
});

const {$axios} = useNuxtApp();
const config = useRuntimeConfig();

// for saving meal info 
const mealInfo = ref({});

// for search query
const isLoading = ref(false);
const query = ref("");
const searchResults = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const searchBar = ref(null);

//for filter overlay
const isFilterOverlayVisible = ref(false);
const filter_on = ref(false);
const savedFilters = ref({
    cuisine: [],
    dietary: [],
    foodCategory: [],
    recommended_meal_time: {
        Breakfast: false,
        Lunch: false,
        Dinner: false,
        Other: false,
    }
});

// for stomach overlay
const isStomachOverlayVisible = ref(false);
const mealStore = useMealLoggingStore();
const selectedMeals = computed(() => mealStore.unsavedMealList); // reactive computed property from Pinia store

// for add meal overlay
const isAddMealOverlayVisible = ref(false);
const mealId = ref("");
const recipeInfo = ref({});
const userDailyNutrients = ref(null);
const userOriginalRemainingNutrients = ref(null);
const userRemainingNutrients = ref(null);

// for custom recipe overlay
const isCustomRecipeOverlayVisible = ref(false);

watch(query, (newQuery) => {
    if (newQuery === "") {
        searchResults.value = [];
        pageNumber.value = 1;
        fetchRecipes(savedFilters.value);
    }
})

async function fetchRecipes(filter = {}){
    if (isLoading.value) return;

    isLoading.value = true;
    const token = localStorage.getItem("accessToken");
    
    try {
      const suffix =  '/recipe/get';
      let meal_type = [];

      if (filter.recommended_meal_time.Breakfast) meal_type.push('Breakfast');
      if (filter.recommended_meal_time.Lunch) meal_type.push('Lunch');
      if (filter.recommended_meal_time.Dinner) meal_type.push('Dinner');
      if (filter.recommended_meal_time.Other) meal_type.push('Other');

      if (meal_type.length === 0){
        meal_type = meal_type.map(item => item.toString());
      }

      const response = await $axios.get(suffix, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          page: pageNumber.value,
          pageSize: pageSize.value,
          search: query.value || undefined,
          mealType: meal_type.length > 0 ? JSON.stringify(meal_type) : undefined,
          cuisine: JSON.stringify(filter.cuisine),
          dietary: JSON.stringify(filter.dietary),
          food_category: JSON.stringify(filter.foodCategory),
        }
      });

      const data = response.data;

      if (data.data.length === 0){
        isLoading.value = false;
        return;
      }

      // Ensure proper object creation for each recipe to avoid Pinia hydration issues
      const safeRecipes = data.data.map(recipe => ({
        ...recipe,
        nutrition_info: recipe.nutrition_info ? { ...recipe.nutrition_info } : {},
        storage_links: recipe.storage_links ? { ...recipe.storage_links } : {},
        recommended_meal_time: recipe.recommended_meal_time ? { ...recipe.recommended_meal_time } : {},
        user: recipe.user ? { ...recipe.user } : null
      }));
      searchResults.value = [...searchResults.value, ...safeRecipes];
      totalPages.value = data.totalPages;
      pageNumber.value += 1;
      isLoading.value = false;
      console.log(searchResults.value);
    } catch (error) {
        console.error("Error fetching recipes", error);
    }
}

const debouncedOnInput = debounce(async ()=> {
  pageNumber.value = 1;
  searchResults.value = [];
  await fetchRecipes(savedFilters.value);
}, 300);

function onScroll(event) {
  const bottom =  event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;

  if (bottom){
    fetchRecipes(savedFilters.value);
  }
}

function handleBeforeUnload(e) {
  const confirmationMessage = 'Your selected meal won\'t be logged or saved if you leave this page.';
  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome <34
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('load', adjustSize);
  window.addEventListener('resize', adjustSize);

  if (typeof localStorage === "undefined" && !config.public.isDebug ) navigateTo("/meal-logging");

  if (typeof localStorage === "undefined" && config.public.isDebug) {
    localStorage.setItem("mealInfo", JSON.stringify({
      logType: "logging",
      mealType: "Breakfast",
      logDate: new Date().toISOString(),
      expiryTime: new Date().getTime() + 1000000,
    }));
  }

  if(localStorage.getItem("mealInfo")){
    // check if expired - ensure proper object creation
    const parsedMealInfo = JSON.parse(localStorage.getItem("mealInfo"));
    mealInfo.value = { ...parsedMealInfo };
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
    } else {
    // Ensure proper object creation from localStorage
    mealInfo.value = { ...parsedMealInfo };
    }
  } else {
    navigateTo("/meal-logging");
  }

  fetchRecipes(savedFilters.value);
  document.addEventListener("click", handleClickOutside);
  setTimeout(() => {
    adjustSize();
  }, 100);

  console.log('mealStore', mealStore)
  console.log('unsavedMealList?', mealStore?.unsavedMealList)

  // Clear unsaved meal list using proper store action
  mealStore.clearUnsavedList()
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('load', adjustSize);
  window.removeEventListener('resize', adjustSize);
  document.removeEventListener("click", handleClickOutside);
});

function adjustSize() {
  const follower = document.getElementById('follower');
  const reference = document.getElementById('reference');
  
  if (follower && reference) {
    follower.style.width = `${reference.offsetWidth}px`;
  }
}

function handleClickOutside(event) {
  if (searchBar.value && !searchBar.value.contains(event.target)) {
    isFilterOverlayVisible.value = false;
  }
}

async function toggleFilterOverlay() {
  isFilterOverlayVisible.value = !isFilterOverlayVisible.value;
}

async function applyFilters(filters) {
  pageNumber.value = 1;
  searchResults.value = [];
  savedFilters.value = filters;
  filter_on.value = true;
  isFilterOverlayVisible.value = false;
  await fetchRecipes(filters);
}

async function clearFilters() {
  pageNumber.value = 1;
  searchResults.value = [];
  savedFilters.value = {
    cuisine: [],
    dietary: [],
    foodCategory: [],
    recommended_meal_time: {
      Breakfast: false,
      Lunch: false,
      Dinner: false,
      Other: false,
    }
  };
  filter_on.value = false;
  isFilterOverlayVisible.value = false;
  await fetchRecipes(savedFilters.value);
}

function openStomachOverlay() {
  isStomachOverlayVisible.value = true;
}

function closeStomachOverlay() {
  isStomachOverlayVisible.value = false;
}

async function openAddMealOverlay(id) {
  mealId.value = id;
  try{
    const token = localStorage.getItem('accessToken');
    const recipe_info_response = await $axios.get(`/recipe/get`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params:{
        recipeId: id
      }
    });

    // Ensure proper object creation to avoid Pinia hydration issues
    const recipeData = recipe_info_response.data;
    recipeInfo.value = {
      ...recipeData,
      recipe: recipeData.recipe ? {
        ...recipeData.recipe,
        nutrition_info: recipeData.recipe.nutrition_info ? { ...recipeData.recipe.nutrition_info } : {},
        storage_links: recipeData.recipe.storage_links ? { ...recipeData.recipe.storage_links } : {},
        serving_size: recipeData.recipe.serving_size || 1
      } : {},
      components: recipeData.components ? {
        ingredients: recipeData.components.ingredients ? recipeData.components.ingredients.map(ing => ({ ...ing })) : [],
        seasonings: recipeData.components.seasonings ? recipeData.components.seasonings.map(seas => ({ ...seas })) : []
      } : { ingredients: [], seasonings: [] }
    };
    if(userDailyNutrients.value === null){

      const user_budget_response = await $axios.get('/user/budget', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params:{
          startDate: mealInfo.value.logDate,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
      
      // Ensure proper object creation to avoid Pinia hydration issues
      userDailyNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][0] };
      
      if (userRemainingNutrients.value === null){
        userOriginalRemainingNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][2] };
        userRemainingNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][2] };
      }
      console.log(selectedMeals.value);
      if (selectedMeals.value.length > 0){
        selectedMeals.value.forEach((meal) => {
          // Safely access nutrition_info with null checks
          const nutritionInfo = meal.recipe?.nutrition_info || {};
          const portion = meal.portion || 1;
          const servingSize = meal.recipe?.serving_size || 1;
          const multiplier = portion / servingSize;
          
          userRemainingNutrients.value = {
            calories: parseFloat((userRemainingNutrients.value.calories - (nutritionInfo.calories || 0) * multiplier).toFixed(2)),
            carbs: parseFloat((userRemainingNutrients.value.carbs - (nutritionInfo.totalCarbohydrate || 0) * multiplier).toFixed(2)),
            protein: parseFloat((userRemainingNutrients.value.protein - (nutritionInfo.protein || 0) * multiplier).toFixed(2)),
            fat: parseFloat((userRemainingNutrients.value.fat - (nutritionInfo.fat || 0) * multiplier).toFixed(2)),
            sodium: parseFloat((userRemainingNutrients.value.sodium - (nutritionInfo.sodium || 0) * multiplier).toFixed(2)),
            cholesterol: parseFloat((userRemainingNutrients.value.cholesterol - (nutritionInfo.cholesterol || 0) * multiplier).toFixed(2)),
          }
        });
      }
    }
  } catch (error) {
    console.error(error)
    console.error("Error fetching recipe info");
  }
  console.log(recipeInfo.value);
  console.log(userDailyNutrients.value);
  console.log(userOriginalRemainingNutrients.value);
  console.log(userRemainingNutrients.value);
  isAddMealOverlayVisible.value = true;
}

function closeAddMealOverlay() {
  isAddMealOverlayVisible.value = false;
}

function openCustomRecipeOverlay() {
  isCustomRecipeOverlayVisible.value = true;
}

async function closeCustomRecipeOverlay() {
  isCustomRecipeOverlayVisible.value = false;
  await fetchRecipes(savedFilters.value);
}

async function back() {
  localStorage.removeItem("mealInfo");
  if (mealInfo.value.logType === "planning") {
    await navigateTo("/meal-planning");
  } else {
    await navigateTo("/meal-logging");
  }
}

function updatePortion(id, portion) {
  const meal = mealStore.unsavedMealList.value.find((m) => m.id === id);
  if (meal) meal.portion = portion;
}

function removeSelectedMeal(id) {
  console.log('trigger remove meal in page');
  mealStore.unsavedMealList.value = mealStore.unsavedMealList.value.filter((m) => m.id !== id);
}

async function proceedToSummary(){
  console.log('[proceedToSummary] current unsaved list', selectedMeals.value);
  const list = selectedMeals.value;
  if(!Array.isArray(list) || list.length === 0){
    useToast().error("Please add meals to log");
    return;
  }

  // Increase the expire time by 5min in local storage
  mealInfo.value.expiryTime = new Date().getTime() + (5*60*1000);
  localStorage.setItem("mealInfo", JSON.stringify(mealInfo.value));

  // store list length for future validation if needed
  // Note: selectedMeals no longer passed via localStorage; summary page reads from Pinia.

  if(userDailyNutrients.value === null){

    const token = localStorage.getItem('accessToken');
    const user_budget_response = await $axios.get('/user/budget', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params:{
        startDate: mealInfo.value.logDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
    
    // Ensure proper object creation to avoid Pinia hydration issues
    userDailyNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][0] };
    
    if (userRemainingNutrients.value === null){
      userOriginalRemainingNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][2] };
      userRemainingNutrients.value = { ...user_budget_response.data[mealInfo.value.logDate][2] };
    }
    console.log(selectedMeals.value);
    if (selectedMeals.value.length > 0){
      selectedMeals.value.forEach((meal) => {
        // Safely access nutrition_info with null checks
        const nutritionInfo = meal.recipe?.nutrition_info || {};
        const portion = meal.portion || 1;
        const servingSize = meal.recipe?.serving_size || 1;
        const multiplier = portion / servingSize;
        
        userRemainingNutrients.value = {
          calories: parseFloat((userRemainingNutrients.value.calories - (nutritionInfo.calories || 0) * multiplier).toFixed(2)),
          carbs: parseFloat((userRemainingNutrients.value.carbs - (nutritionInfo.totalCarbohydrate || 0) * multiplier).toFixed(2)),
          protein: parseFloat((userRemainingNutrients.value.protein - (nutritionInfo.protein || 0) * multiplier).toFixed(2)),
          fat: parseFloat((userRemainingNutrients.value.fat - (nutritionInfo.fat || 0) * multiplier).toFixed(2)),
          sodium: parseFloat((userRemainingNutrients.value.sodium - (nutritionInfo.sodium || 0) * multiplier).toFixed(2)),
          cholesterol: parseFloat((userRemainingNutrients.value.cholesterol - (nutritionInfo.cholesterol || 0) * multiplier).toFixed(2)),
        }
      });
    }
  }
  
  // Save nutrition data to localStorage for summary page
  const nutritionDataForSummary = [
    userDailyNutrients.value,
    userOriginalRemainingNutrients.value,  // Remaining budget BEFORE selected meal
    userRemainingNutrients.value           // Remaining budget AFTER selected meal(s)
  ];
  localStorage.setItem('userNutrientsInfo', JSON.stringify(nutritionDataForSummary));
  
  await navigateTo("/summary");
}

function addMeal(id, portion, afterAddingMeal) {
  console.log('[add-meals] addMeal called with:', { id, portion, afterAddingMeal });
  console.log('[add-meals] recipeInfo.value:', recipeInfo.value);
  
  // Ensure proper object structure for store
  const mealToAdd = {
    recipe: recipeInfo.value.recipe ? { ...recipeInfo.value.recipe } : {},
    id,
    portion,
  };
  
  console.log('[add-meals] mealToAdd:', mealToAdd);
  console.log('[add-meals] selectedMeals before:', selectedMeals.value);
  
  mealStore.addMeal(mealToAdd);
  
  console.log('[add-meals] selectedMeals after:', selectedMeals.value);
  
  userRemainingNutrients.value = { ...afterAddingMeal };
  mealId.value = "";
  recipeInfo.value = {};
  useToast().success("Meal added to the stomach");
  closeAddMealOverlay();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

/* Desktop-first styles (original layout) */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 40;
}

.image-container {
  position: relative;
  width: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-overlay {
  position: absolute;
  width: 100%;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hero-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.body {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.left-base {
  position: absolute;
  top: 42%;
  left: 0;
}

.left-decoration {
  width: 85%;
}

.right-base {
  position: absolute;
  top: 35%;
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

.back-button {
  position: absolute;
  top: 30%;
  left: 5%;
}

.back-btn {
  background-color: #FFA17A;
  color: #993300;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-btn:hover {
  background-color: #E5946B;
}

.back-text {
  font-size: 1rem;
}

.stomach-button-container {
  position: absolute;
  right: 5%;
  top: 30%;
}

.counter {
  position: absolute;
  left: 125%;
  top: 5%;
  background-color: red;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 50%; 
  width: 25px; 
  height: 25px; 
  text-align: center; 
  line-height: 25px; 
  transform: translate(-50%, -50%);
  z-index: 1; 
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.stomach-button {
  background-color: #FFA17A;
  display: flex;
  align-items: center;
  color: #993300;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  gap: 8px;
}

.stomach-button:hover {
  background-color: #E5946B;
}

.stomach-icon {
  height: 24px;
  width: 24px;
}

.stomach-text {
  margin: 0;
  font-size: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 2px 15px;
  position: relative;
  margin-top: 2%;
}

.search-icon {
  height: 20px;
  width: 20px;
  margin-right: 10px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.filter-button {
  cursor: pointer;
  height: 20px;
  width: 20px;
  margin-left: 10px;
}

.search-result-text-display {
  height: 5%;
  width: 60%;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  padding-bottom: 2.5%;
  margin-top: 2%;
}

.aligned-paragraph {
  text-align: left;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  font-weight: bold;
  color: #333;
  font-size: 15px;
}

.search-result-container {
  width: 60%;
  height: 65%;
  overflow-y: auto;
}

.search-result-item-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  padding: 15px;
}

.custom-recipe-card {
  background-color: #FFFEF1;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Source Code Pro", monospace;
  font-weight: 700;
  font-size: 1.2rem;
  gap: 8px;
  cursor: pointer;
  padding: 15px;
}

.custom-add-icon {
  height: 24px;
  width: 24px;
}

.recipe-card-item {
  cursor: pointer;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  color: #666;
  grid-column: 1 / -1;
}

/* Hide mobile controls on desktop */
.mobile-controls {
  display: none;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .page-container {
    height: auto;
    min-height: 100vh;
    overflow-x: hidden; /* Prevent horizontal scroll */
    padding-bottom: 120px; /* Ensure content doesn't get cut by footer */
    box-sizing: border-box;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 200px; /* Ensure adequate height on mobile */
  }

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text-overlay {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 2.5rem;
    color: white;
    font-weight: 700;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .left-base,
  .right-base {
    display: none; /* Hide decorative elements on mobile */
  }

  /* Hide desktop controls on mobile */
  .back-button,
  .stomach-button-container {
    display: none !important;
  }

  .body {
    padding: 0;
    gap: 0;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Mobile Controls Header */
  .mobile-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #D4C0A1; /* Beige background to match page */
    position: relative;
    z-index: 30;
    width: 100%;
    box-sizing: border-box;
    order: 1; /* Place after hero section */
  }

  .mobile-back-btn {
    padding: 8px 12px;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-stomach-container {
    position: relative;
  }

  .mobile-stomach-container .counter {
    position: absolute;
    left: 100%;
    top: -5px;
    background-color: red;
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    transform: translate(-50%, -50%);
    z-index: 1;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .mobile-stomach-btn {
    background-color: #FFA17A;
    display: flex;
    align-items: center;
    color: #993300;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    gap: 6px;
    min-height: 44px;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .mobile-stomach-btn:hover {
    background-color: #E5946B;
  }

  .mobile-stomach-btn .stomach-icon {
    height: 20px;
    width: 20px;
  }

  .mobile-stomach-btn .stomach-text {
    font-size: 0.875rem;
  }

  .search-bar {
    width: calc(100% - 2rem);
    margin: 1rem;
    margin-top: 0;
    padding: 12px 16px;
    box-sizing: border-box;
    order: 2; /* Place after mobile controls */
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 50px;
    position: relative;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    margin: 0 10px;
  }

  .search-icon,
  .filter-button {
    height: 20px;
    width: 20px;
    flex-shrink: 0;
  }

  .filter-button {
    cursor: pointer;
    margin-left: 10px;
  }

  .search-result-text-display {
    width: 100%;
    padding: 0 1rem;
    margin-top: 1rem;
    box-sizing: border-box;
    order: 3; /* Place after search bar */
  }

  .search-result-container {
    width: 100%;
    height: auto;
    flex: 1;
    margin-bottom: 120px; /* Increased space for footer */
    overflow-x: hidden;
    overflow-y: auto;
    order: 4; /* Place last */
    min-height: 400px; /* Ensure minimum height */
  }

  .search-result-item-display {
    display: grid;
    grid-template-columns: 1fr; /* Single column on mobile */
    grid-gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    width: 100%;
  }

  .custom-recipe-card {
    min-height: 80px;
    font-size: 1rem;
    padding: 1rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 15px;
    background-color: #FFFEF1;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    font-family: 'Source Code Pro', monospace;
    font-weight: 600;
  }

  .recipe-card-item {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* Mobile-specific recipe card styles */
  .recipe-card-item .card {
    width: 100%;
    max-width: 100%;
    min-width: auto;
    min-height: 140px;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .recipe-card-item .top-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }

  .recipe-card-item .image-container {
    width: 100px;
    min-width: 100px;
    height: 100px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .recipe-card-item .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    background-color: #f5f5f5;
  }

  .recipe-card-item .img[src=""],
  .recipe-card-item .img:not([src]),
  .recipe-card-item .img[src*="undefined"] {
    display: none;
  }

  .recipe-card-item .image-container::after {
    content: "🍽️";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #ccc;
    z-index: 1;
  }

  .recipe-card-item .img:not([src=""]):not([src*="undefined"]) + ::after {
    display: none;
  }

  .recipe-card-item .content {
    flex: 1;
    min-width: 0;
    margin-left: 0;
  }

  .recipe-card-item .meal-name {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .recipe-card-item .meal-description {
    font-size: 0.75rem;
    line-height: 1.3;
    margin: 0 0 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .recipe-card-item .labels {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .recipe-card-item .label {
    padding: 4px 8px;
    font-size: 0.7rem;
    border-radius: 16px;
    min-height: 24px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .recipe-card-item .custom-tag {
    font-size: 0.6rem;
    padding: 2px 6px;
  }

  .recipe-card-item .top-right {
    top: 8px;
    right: 8px;
  }

  .recipe-card-item .top-right img {
    width: 16px;
    height: 16px;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .search-bar {
    width: 70%;
  }

  .search-result-text-display,
  .search-result-container {
    width: 80%;
  }

  .search-result-item-display {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Very Small Mobile (iPhone SE, etc.) */
@media (max-width: 375px) {
  .mobile-controls {
    padding: 0.75rem;
  }

  .mobile-back-btn,
  .mobile-stomach-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .mobile-stomach-btn .stomach-text {
    display: none; /* Hide stomach text on very small screens */
  }

  .search-bar {
    padding: 10px 14px;
    margin: 0.75rem;
    width: calc(100% - 1.5rem);
  }

  .custom-recipe-card {
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .search-result-item-display {
    padding: 0.75rem;
    grid-gap: 0.75rem;
  }

  .recipe-card-item .card {
    padding: 10px;
  }

  .recipe-card-item .image-container {
    width: 90px;
    min-width: 90px;
    height: 90px;
  }

  .recipe-card-item .img {
    height: 100%;
  }

  .recipe-card-item .meal-name {
    font-size: 0.9rem;
  }

  .recipe-card-item .meal-description {
    font-size: 0.7rem;
  }

  .recipe-card-item .label {
    padding: 3px 6px;
    font-size: 0.65rem;
    min-height: 20px;
  }
}

/* Large Desktop Styles */
@media (min-width: 1440px) {
  .search-result-item-display {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>