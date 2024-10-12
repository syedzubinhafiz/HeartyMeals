<template>
  <div class="absolute w-screen z-40">
    <Header />
  </div>

  <div class="relative min-h-screen text-white">
    <!-- Background image section -->
    <div class="bg-header-image flex flex-col items-center justify-center relative-parent">
      <h2 class="text-white text-4xl font-bold text-center">Add Meals</h2>
    </div>

    <!-- Search Bar and Recipe Cards Container -->
    <div class="flex">
      <div class="left-0 bottom-0 flex items-end">
        <img src="/assets/img/curvyLeft.svg" alt="Curvy Left" style="height: 60vh"/>
      </div>
      <div class="content-container">
        <div class="flex justify-center mb-10 text-black">
          <MealSearchBar v-model="searchValue" :dataList="searchDataList" />
        </div>

        <!-- Scrollable Recipe Cards -->
        <div class="scroll-content">
          <!-- Container for heading and cards -->
          <div class="cards-container">
            <!-- Heading and Button Row -->
            <div class="heading-button-row flex justify-between items-center mb-4">
              <h3 class="text-2xl font-semibold text-black">Recently Added</h3>
              <div class="stomach-button-container">
                <button class="button-orange" @click="toggleSidebar">
                  <img src="/assets/img/SVGRepo_iconCarrier.svg" alt="Stomach Icon" class="stomach-icon"/>
                  <span>Stomach</span>
                  <div class="notification-bubble"></div>
                </button>
              </div>
            </div>
            <div class="cards-grid">
              <!-- Customize Your Meal Card with Popup -->
              <button class="recipe-card customize-card bg-custom-overlay-light text-black flex items-center justify-center" @click="togglePopup">
                <span>+ Customize Your Meal</span>
              </button>

              <!-- Other Meal Cards -->
              <RecipeCard
                v-for="(meal, index) in paginatedMealList"
                :key="index"
                :imageSrc="'../assets/img/croissant.svg'"
                :mealId="meal.id"
                :mealName="meal.name"
                :mealDescription="meal.description"
                :labels="meal.recommended_meal_time ?? {}"
                @click.native="openOverlay(meal)"
              />
            </div>
          </div>
          <!-- Pagination Component -->
          <Pagination
              v-model:totalItems="totalItems"
              :itemsPerPage="itemsPerPage"
              v-model:currentPage="currentPage"
            />
        </div>
      </div>
      <div class="right-0 bottom-0 flex items-end">
        <img src="/assets/img/curvyRight.svg" alt="Curvy Right" style="height: 50vh"/>
      </div>
    </div>

    <div class="text-black">

      <!-- Sidebar Component -->
      <StomachSidebar 
      v-model="mealDataList2" 
      v-model:isSidebarOpen="isSidebarOpen" 
      :mealType="mealType" 
      :selectedDate="selectedDate"
      :ismealplanning="ismealplanning"
    />
      <!-- Popup Overlay -->
      <CustomDishPopup v-model:isPopupOpen="isPopupOpen" class="text-black"/>
    </div>
  </div>
  <AddMealsOverlay
    :visible="isOverlayVisible"
    :meal="selectedMeal"
    @closeOverlay="isOverlayVisible = false"
  />
  <Footer/>
</template>


<script setup>
definePageMeta({
  layout: "emptylayout"
});


import MealData from '../../classes/mealData.js'
import NutrientData from '../../classes/nutrientData.js'

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';


const searchValue = ref("");
const meals = ref([]);
const isSidebarOpen = ref(false);
const isPopupOpen = ref(false);
const searchDataList = ref([]);

const route = useRoute()
const mealType = ref(route.query.mealType || "");
const selectedDate = ref(route.query.selectedDate || "");
const ismealplanning = ref(route.query.ismealplanning === 'true');

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const togglePopup = () => {
  isPopupOpen.value = !isPopupOpen.value;
};


let mealData1 = new MealData("Regular Croissant","assets/img/croissant.svg","1 crossiant (80g)",1,
  new NutrientData(400,150,100,100,5,300)
)

let mealData2 = new MealData("Cheese Croissant","assets/img/croissant.svg","1 crossiant (100g)",1,
  new NutrientData(500,100,200,200,10,400)
)

let mealData3 = new MealData("Not a Croissant","assets/img/croissant.svg","1 crossiant (50g)",1,
  new NutrientData(100,60,140,70,20,200)
)

const mealDataList2 = ref([mealData1,mealData2,mealData3])
const recipeList = ref([])
// Fetch meals from the backend when the component mounts

watch(searchValue, async ()=> {
  let endpoint = "/recipe/get"
  if(searchValue.value!="") {
    endpoint = `/recipe/get?search=${searchValue.value}`
  }
  recipeList.value = await useApi(endpoint,"GET")
  searchDataList.value = recipeList.value.value.map((val)=>{return val.name})
  totalItems.value = recipeList.value.value.length
})

onMounted(async () => {
  await useApi("/dietary","GET")
  // console.log(await useApi("/dietary","GET"))
  recipeList.value = await useFillData().fillRecipes()
  searchDataList.value = recipeList.value.value.map((val)=>{return val.name})
  totalItems.value = recipeList.value.value.length

})
const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(6)
const paginatedMealList = computed({
  get() {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return recipeList.value?.value?.slice(start, end);
    },
})



const isOverlayVisible = ref(false)
const selectedMeal = ref(null)

const openOverlay = async (meal) => {
  const detailedMealInfo = await useApi(`/recipe/get?recipeId=${meal.id}`,"GET")
  console.log(detailedMealInfo.value)
  selectedMeal.value = detailedMealInfo.value
  isOverlayVisible.value = true
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
  font-family: 'Overpass', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  background-color: #f7f7f7; /* Ensure a default background color */
}

.bg-header-image {
  background-image: url('@/assets/img/smallerBlob.svg');
  background-size: 110% auto;
  background-repeat: no-repeat;
  background-position: center;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  position: relative;
}

/* Container for Search Bar and Recipe Cards */
.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: transparent; /* Ensure transparency */
}

/* Scrollable Content */
.scroll-content {
  height: calc(100vh - 50vh); /* Remaining height after the header */
  overflow-y: auto;
  padding-top: 20px;
  padding-right: 0; /* Removed right padding to bring scrollbar closer */
  scrollbar-width: thin;
  scrollbar-color: #888 #e0e0e0;
  z-index: 3;
  background-color: transparent; /* Ensure transparency */
}

.scroll-content::-webkit-scrollbar {
  width: 8px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.scroll-content::-webkit-scrollbar-track {
  background-color: #e0e0e0;
}

/* Container for the heading and cards */
.cards-container {
  padding-left: 85px; /* Same as cards-grid padding */
  padding-right: 85px; /* Same as cards-grid padding */
}

/* Heading and Button Row */
.heading-button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Stomach Button Container */
.stomach-button-container {
  position: relative;
}

.button-orange {
  display: flex;
  align-items: center;
  background-color: #f89c74;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  border: none;
  cursor: pointer;
  position: relative;
}

.stomach-icon {
  margin-right: 10px;
}

.notification-bubble {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff4c4c;
  color: white;
  font-size: 0.75rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns layout */
  gap: 20px; /* Space between cards */
  z-index: 3;
}

.customize-card {
  border: 2px dashed #000;
  border-radius: 8px;
  height: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  grid-column: span 1; /* Make the Customize Your Meal card span only one column */
  position: relative;
}
</style>

