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
          <h3 class="text-2xl font-semibold mb-4">Recently Added</h3>
          <div class="cards-grid">
            <!-- Customize Your Meal Card -->
            <div class="recipe-card customize-card bg-custom-overlay-light text-black flex items-center justify-center" @click="addCustomMeal">
              <span>+ Customize Your Meal</span>
            </div>

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
      <div class="right-0 bottom-0 flex items-end">
        <img src="/assets/img/curvyRight.svg" alt="Curvy Right" style="height: 50vh"/>
      </div>
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

const searchDataList = ['Tomato and Cheese Croissant', 'Banana Cake', 'Overnight Oats', 'Bok Choy', 'Creamy Alfredo Pizza'];

// Function to add a custom meal
const addCustomMeal = () => {
  const newMeal = {
    imageSrc: "assets/img/customMeal.svg", // Replace with the appropriate image or placeholder
    mealName: "Custom Meal",
    mealDescription: "Your custom created meal.",
    labels: [
      { name: "Custom", active: true },
    ],
  };
  meals.value.unshift(newMeal); // Add the custom meal to the beginning of the array
};

// Fetch meals from the backend when the component mounts
onMounted(() => {
  // Replace with your actual API call
  fetch('/api/meals')
    .then(response => response.json())
    .then(data => {
      meals.value = data;
    });
});
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns layout */
  gap: 20px; /* Space between cards */
  padding-left: 85px;
  padding-right: 85px;
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
}



/* Styling the curvy blobs */
.curvy-left {
  position: absolute;
  bottom: 0;
  left: -55px;
  top: 310px;
  width: 150px;
  height: 500px;
  z-index: 1;
}

.curvy-right {
  position: absolute;
  bottom: 0;
  right: 0;
  top: 310px;
  width: 130px;
  height: 500px;
  z-index: 1;
}

.curvy-left img,
.curvy-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
