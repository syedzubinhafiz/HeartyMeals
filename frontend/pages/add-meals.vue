<template>
  <div class="page-container" @click="handleClickOutside">
    <header class="header">
      <Header></Header>
    </header>

    <div class="image-container">
      <img src="@/assets/img/recipe_lib/bg.svg" class="background-image"/>
      <div class="text-overlay">
        <h2 class="text-white text-3xl font-bold text-center">Add Meals</h2>
      </div>
    </div>

    <div class="body">

      <div class="left-base">
        <img :src="leftBase" style="width: 85%;">
      </div>
      
      <div class="right-base" >
        <img :src="rightBase" >
      </div>

      <div class="back-button">
        <ButtonOrange @click="back">Back</ButtonOrange>
      </div>
      

      <div class="stomach-button-container">
        <div class="counter">{{selectedMeals.length}}</div>
        <button @click="openStomachOverlay" class="shadow-md stomach-button">
          <img :src="stomachIcon" alt="" style="padding-right: 10%;">
          <p style="position:relative; top: 15%">Stomach</p>
        </button>
      </div>

      <div class="search-bar" ref="searchBar">
        <img src="../assets/icon/Search_Icon.svg" alt="Search Icon">
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
          @clearFilters ="clearFilters"
         />
      </div>

      <div class="search-result-text-display">
        <p class="aligned-paragraph" style="font-size: 15px; margin-top: 20px;" v-if="query">Search Result of "{{ query }}"</p>
        <p class="aligned-paragraph" style="font-size: 15px; margin-top: 20px;" v-if="!query">Recently Added</p>
      </div>

      <div class="search-result-container" @scroll="onScroll">
        <div class="search-result-item-display">

          <div class="custom-recipe-card" id="follower" @click="openCustomRecipeOverlay" >
              <img src="@/assets/icon/round-add-icon.svg" alt="">
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
          style="cursor: pointer;"
          />
          <div v-if="isLoading" class="loading-indicator">Loading...</div>
        </div>
      </div>
    </div>
    
    <CustomDishPopup v-model:isPopupOpen="isCustomRecipeOverlayVisible"  @close="closeCustomRecipeOverlay" class="text-black"/>

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
import { ref, onMounted } from "vue";
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


definePageMeta({
  layout: "emptylayout",
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
const selectedMeals = ref([]);

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

      searchResults.value = [...searchResults.value, ...data.data];
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
    // check if expired 
    mealInfo.value = JSON.parse(localStorage.getItem("mealInfo"));
    const currentTime = new Date().getTime();
    const expiryTime = mealInfo.value.expiryTime;
    if (currentTime > expiryTime){
      localStorage.removeItem("mealInfo");
      useToast().warning("Session expired, redirecting to previous page");
      
      if (mealInfo.value.logType === "planning"){
        setTimeout(() => {
          navigateTo("/meal-planning");
        }, 1500);    
      } else {
        setTimeout(() => {
          navigateTo("/meal-logging");
        }, 1500);
      }
    } else {
    mealInfo.value = JSON.parse(localStorage.getItem("mealInfo"));
    }
  } else {
    navigateTo("/meal-logging");
  }

  if(localStorage.getItem("selectedMeals")){
    selectedMeals.value = JSON.parse(localStorage.getItem("selectedMeals"));
    localStorage.removeItem("selectedMeals");
  }

  fetchRecipes(savedFilters.value);
  document.addEventListener("click", handleClickOutside);
  setTimeout(() => {
    adjustSize();
  }, 100);
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener('load', adjustSize);
  window.removeEventListener('resize', adjustSize);
});

const toggleFilterOverlay = () => {
    isFilterOverlayVisible.value = !isFilterOverlayVisible.value;
}

const applyFilters =  async (filters) => {
  savedFilters.value = filters;
  if (filterOn()) {
    filter_on.value = true;
  } else {
    filter_on.value = false;
  }
  debouncedOnInput();
}

function filterOn() {
  if (savedFilters.value.cuisine.length > 0) return true;
  if (savedFilters.value.dietary.length > 0) return true;
  if (savedFilters.value.foodCategory.length > 0) return true;
  if (savedFilters.value.recommended_meal_time.Breakfast) return true;
  if (savedFilters.value.recommended_meal_time.Lunch) return true;
  if (savedFilters.value.recommended_meal_time.Dinner) return true;
  if (savedFilters.value.recommended_meal_time.Other) return true;
}

const clearFilters = () => {
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
  }
  filter_on.value = false;
  debouncedOnInput();
}

const handleClickOutside = (event) => {
    if (searchBar.value && !searchBar.value.contains(event.target)) {
        isFilterOverlayVisible.value = false;
    }
}

const back = () => {
  localStorage.removeItem("mealInfo");
  if (mealInfo.value.logType === "planning") {
    navigateTo("/meal-planning");
  } else{
    navigateTo("/meal-logging");
  }
}

function openStomachOverlay() {
  isStomachOverlayVisible.value = true;
  console.log(selectedMeals.value);
}

function updatePortion(id, portion) {
  const meal = selectedMeals.value.find((meal) => meal.id === id);
  meal.portion = portion;
}

function removeSelectedMeal(id) {
  console.log("trigger remove meal in page");
  selectedMeals.value = selectedMeals.value.filter((meal) => meal.id !== id);
}

function closeStomachOverlay() {
  isStomachOverlayVisible.value = false;
}

function closeCustomRecipeOverlay() {
  isCustomRecipeOverlayVisible.value = false;
}

function openCustomRecipeOverlay() {
  isCustomRecipeOverlayVisible.value = true;
}

async function proceedToSummary(){

  if(selectedMeals.value.length === 0){
    useToast().error("Please add meals to log");
    return;
  }

  // Increase the expire time by 5min in local storage
  mealInfo.value.expiryTime = new Date().getTime() + (5*60*1000);
  localStorage.setItem("mealInfo", JSON.stringify(mealInfo.value));


  //store the selected meal to local storage
  localStorage.setItem("selectedMeals", JSON.stringify(selectedMeals.value));

  localStorage.setItem("userNutrientsInfo", JSON.stringify([userDailyNutrients.value, userOriginalRemainingNutrients.value, userRemainingNutrients.value]));
  navigateTo("/summary");

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

    recipeInfo.value = recipe_info_response.data;
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
      
      userDailyNutrients.value = user_budget_response.data[mealInfo.value.logDate][0];
      
      if (userRemainingNutrients.value === null){
        userOriginalRemainingNutrients.value = user_budget_response.data[mealInfo.value.logDate][1];
        userRemainingNutrients.value = user_budget_response.data[mealInfo.value.logDate][1];
      }

      if (selectedMeals.value.length > 0){
        selectedMeals.value.forEach((meal) => {
          userRemainingNutrients.value = {
            calories: parseFloat((userRemainingNutrients.value.calories - meal.recipe.nutrition_info.calories * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
            carbs: parseFloat((userRemainingNutrients.value.carbs - meal.recipe.nutrition_info.totalCarbohydrate * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
            protein: parseFloat((userRemainingNutrients.value.protein - meal.recipe.nutrition_info.protein * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
            fat: parseFloat((userRemainingNutrients.value.fat - meal.recipe.fat * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
            sodium: parseFloat((userRemainingNutrients.value.sodium - meal.recipe.nutrition_info.sodium * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
            cholesterol: parseFloat((userRemainingNutrients.value.cholesterol - meal.recipe.nutrition_info.cholesterol * (meal.portion/meal.recipe.serving_size)).toFixed(2)),
          }
        });
      }
    }
  } catch (error) {
    console.error(error)
    console.error("Error fetching recipe info");
  }
  isAddMealOverlayVisible.value = true;
}

function closeAddMealOverlay() {
  isAddMealOverlayVisible.value = false;
}

function addMeal(id, portion, afterAddingMeal) {
  selectedMeals.value.push({
    recipe: recipeInfo.value.recipe,
    id: id,
    portion: portion,
  });
  userRemainingNutrients.value = afterAddingMeal;
  mealId.value = "";
  recipeInfo.value = {};
  useToast().success("Meal added to the stomach");
  closeAddMealOverlay();

}


function adjustSize() {
  const follower = document.getElementById('follower');
  const reference = document.getElementById('reference');
  
  follower.style.width = `${reference.offsetWidth}px`;
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');

*{
    font-family: 'Overpass', sans-serif;
}
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

.body {
  overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.left-base{
  position: absolute;
  top: 42%;
  left: 0;
}

.right-base{
  position: absolute;
  top: 35%;
  right: 0;
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

.stomach-button-container{
  position: absolute;
  right : 5%;
  top:30%
}

.counter {
  position: absolute;
  left: 125%;
  top:5%;
  background-color: red;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 50%; 
  width: 25px; 
  height: 25px; 
  text-align: center; 
  line-height: 28px; 
  transform: translate(-50%, -50%);
  z-index: 1; 
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.stomach-button {
  background-color: #FFA17A;
  display: grid;
  color: #993300;
  font-weight:600;
  grid-template-columns: max-content max-content;
  padding: 10% 15%;
  border-radius: 10%;
  column-gap: 5%;
}

.stomach-button:hover {
  background-color: #E5946B;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 2px 15px;
  position: relative; /* Add this to position the filter overlay */
}

.search-input {
  width: 100%;
  align-self: center;
  padding: 5px;
}

.search-input:focus {
  outline: none;
}

.search-result-item-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  padding: 15px;
}

.search-result-text-display {
  height: 5%;
  width: 60%;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  padding-bottom: 2.5%;
}

.search-result-container {
  width: 60%;
  height: 65%;
  overflow-y: auto;
}

.aligned-paragraph {
  text-align: left;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.filter-button {
  cursor: pointer;
  height: 70%;
}

.custom-recipe-card{
  background-color: #FFFEF1;
  border-radius: 15px;
  width: 1fr;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:  "Source Code Pro", monospace;
  font-weight: 700;
  font-size: 1.2rem;
  column-gap: 3%;
  cursor: pointer;
}
</style>