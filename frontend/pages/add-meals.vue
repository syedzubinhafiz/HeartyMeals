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
                  <img src="path-to-your-stomach-icon.svg" alt="Stomach Icon" class="stomach-icon"/>
                  <span>Stomach</span>
                  <div class="notification-bubble">3</div>
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
                v-for="(meal, index) in meals"
                :key="index"
                :imageSrc="meal.imageSrc"
                :mealName="meal.mealName"
                :mealDescription="meal.mealDescription"
                :labels="meal.labels"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="right-0 bottom-0 flex items-end">
        <img src="/assets/img/curvyRight.svg" alt="Curvy Right" style="height: 50vh"/>
      </div>
    </div>

    <!-- Sidebar Component -->
    <StomachSidebar v-model="mealDataList" v-model:isSidebarOpen="isSidebarOpen"/>
    <!-- Popup Overlay -->
    <div class="text-black">
      <CustomDishPopup v-model:isPopupOpen="isPopupOpen" class="text-black"/>
    </div>
  </div>

  <Footer/>
</template>




<script setup>
definePageMeta({
  layout: "emptylayout"
});

import { ref, onMounted } from 'vue';

const searchValue = ref("");
const meals = ref([]);
const isSidebarOpen = ref(false);
const isPopupOpen = ref(false);
const searchDataList = ['Tomato and Cheese Croissant', 'Banana Cake', 'Overnight Oats', 'Bok Choy', 'Creamy Alfredo Pizza'];
const mealDataList = ref([
  {
    name: "Regular Croissant",
    imageSrc: "assets/img/croissant.svg",
    portionSize: "1 croissant (80g)",
    servings: 1,
    nutrients: {
      calories: 400,
      protein: 150,
      carbs: 100,
      fat: 100,
      fiber: 5,
      sugar: 300,
    },
  },
  {
    name: "Cheese Croissant",
    imageSrc: "assets/img/croissant.svg",
    portionSize: "1 croissant (100g)",
    servings: 1,
    nutrients: {
      calories: 500,
      protein: 100,
      carbs: 200,
      fat: 200,
      fiber: 10,
      sugar: 400,
    },
  },
  {
    name: "Not a Croissant",
    imageSrc: "assets/img/croissant.svg",
    portionSize: "1 croissant (50g)",
    servings: 1,
    nutrients: {
      calories: 100,
      protein: 60,
      carbs: 140,
      fat: 70,
      fiber: 20,
      sugar: 200,
    },
  },
]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const togglePopup = () => {
  isPopupOpen.value = !isPopupOpen.value;
  console.log(isPopupOpen.value)
};

// Fetch meals from the backend when the component mounts
// onMounted(() => {
//   // Replace with your actual API call
//   fetch('/api/meals')
//     .then(response => response.json())
//     .then(data => {
//       meals.value = data;
//     });
// });
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

