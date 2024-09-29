<template>
  <div class="analytics-page min-h-screen flex flex-col">
    <!-- Header Section -->
    <Header />

    <!-- Page Title, Time Frame Switcher, and Date Selector -->
<!-- Page Title, Time Frame Switcher, and Date Selector -->
    <div class="container mx-auto px-4 py-6">
      <!-- Title and Time Frame Switcher -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 class="text-4xl font-semibold mb-4 md:mb-0">Diet Analytics</h1>
        <!-- Time Frame Switcher -->
        <div class="content-wrapper md:ml-8">
          <div class="view-selector">
            <button :class="{ active: view === 'day' }" @click="setView('day')">Day</button>
            <button :class="{ active: view === 'week' }" @click="setView('week')">Week</button>
            <button :class="{ active: view === 'month' }" @click="setView('month')">Month</button>
          </div>
        </div>
      </div>

      <!-- Date Selector (Below Title) -->
      <div class="flex space-x-4 mt-4">
        <button class="text-gray-700">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="text-2xl text-black">30 October 2024</span>
        <button class="text-gray-700">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto grid grid-cols-3 gap-6 px-4 pb-6 items-start">
      <!-- Left Column: Meal Cards (col-span-2 means it takes up two-thirds of the width) -->
      <div class="col-span-2 grid grid-cols-2 gap-6">
        <!-- Breakfast Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-start">
              <div>
                <h1 class="font-bold text-black text-xl leading-normal">Breakfast</h1>
                <h3 class="text-gray-800 mt-1">Scrambled Eggs and Hash Brown</h3>
              </div>
              <img
                src="../assets/img/InformationIcon.png"
                alt="info"
                class="ml-3 w-6 h-6 cursor-pointer icon-align-breakfast"
                @mouseover="showTooltip('Breakfast')"
                @mouseleave="hideTooltip"
              />
              <!-- Tooltip (shown on hover) -->
              <div v-if="tooltipVisible" class="absolute bg-gray-700 text-white p-2 rounded-md shadow-lg tooltip">
                <p>All Breakfast Meals:</p>
                <ul>
                  <li>Scrambled Eggs</li>
                  <li>Hash Brown</li>
                  <li>Smoothie</li>
                </ul>
              </div>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
              Calories <span class="font-bold">1000kcal</span>
            </div>
          </div>

          <!-- Nutrition Info Grid -->
          <div class="grid grid-cols-5 gap-0 text-md">
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Protein</p>
              <p class="font-bold text-black">20g</p>
            </div>
            <div class="nutrition-item bg-highlight-yellow p-1 text-center">
              <p class="text-gray-800">Carbs</p>
              <p class="font-bold text-black">30g</p>
            </div>
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Cholesterol</p>
              <p class="font-bold text-black">10g</p>
            </div>
            <div class="nutrition-item bg-highlight-yellow p-1 text-center">
              <p class="text-gray-800">Fats</p>
              <p class="font-bold text-black">5g</p>
            </div>
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Sodium</p>
              <p class="font-bold text-black">0.1g</p>
            </div>
          </div>
        </div>

        <!-- Lunch Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-start">
              <div>
                <h1 class="font-bold text-black text-xl leading-normal">Lunch</h1>
                <h3 class="text-gray-800 mt-1">Pad Thai</h3>
              </div>
              <img
                src="../assets/img/InformationIcon.png"
                alt="info"
                class="ml-3 w-6 h-6 cursor-pointer icon-align-lunch"
                @mouseover="showTooltip('Lunch')"
                @mouseleave="hideTooltip"
              />
              <!-- Tooltip (shown on hover) -->
              <div v-if="tooltipVisible" class="absolute bg-gray-700 text-white p-2 rounded-md shadow-lg tooltip">
                <p>All Lunch Meals:</p>
                <ul>
                  <li>Pad Thai</li>
                  <li>Grilled Chicken</li>
                  <li>Salad</li>
                </ul>
              </div>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
              Calories <span class="font-bold">1000kcal</span>
            </div>
          </div>

          <!-- Nutrition Info Grid -->
          <div class="grid grid-cols-5 gap-0 text-md">
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Protein</p>
              <p class="font-bold text-black">10g</p>
            </div>
            <div class="nutrition-item bg-highlight-yellow p-1 text-center">
              <p class="text-gray-800">Carbs</p>
              <p class="font-bold text-black">40g</p>
            </div>
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Cholesterol</p>
              <p class="font-bold text-black">15g</p>
            </div>
            <div class="nutrition-item bg-highlight-yellow p-1 text-center">
              <p class="text-gray-800">Fats</p>
              <p class="font-bold text-black">0g</p>
            </div>
            <div class="nutrition-item bg-protein-bg p-1 text-center">
              <p class="text-gray-800">Sodium</p>
              <p class="font-bold text-black">0.3g</p>
            </div>
          </div>
        </div>

        <!-- Dinner and Other Cards (Matching dimensions with Breakfast) -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <H1 class="font-bold text-black">Dinner</H1>
          <div class="bg-red-warning mt-4 text-black py-2 rounded-lg text-center">
            Meal not logged
          </div>
        </div>

        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <H1 class="font-bold text-black">Other</H1>
          <div class="bg-yellow-warning mt-4 text-black py-2 rounded-lg text-center">
            Meal yet to be logged
          </div>
        </div>
      </div>

      <!-- Right Column: Nutrient Widget (Ensuring it's aligned to the top of the container) -->
      <div class="nutrient-widget-container self-start">
        <div class="widget-content flex flex-col justify-start items-start"> <!-- Ensuring alignment at the top -->
          <NutrientWidget />
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <Footer />
</template>

<script setup>
// Define the page meta with custom layout
definePageMeta({
  layout: 'emptylayout'
});

import { ref } from 'vue';

const tooltipVisible = ref(false);

function showTooltip(mealCategory) {
  // Logic to get meals from backend based on mealCategory
  tooltipVisible.value = true;
}

function hideTooltip() {
  tooltipVisible.value = false;
}

const view = ref('day')
const setView = (newView) => {
  view.value = newView
  navigateTo(`/analytics-${newView}`)
}
</script>

<style>
/* Page background color */
.analytics-page {
  background-color: #DAC2A8; /* Darker beige background for the entire page */
}

/* Meal card background color */
.bg-card-beige {
  background-color: #F3EADA; /* Meal cards are darker beige */
}

/* Calorie section background color */
.bg-calories-yellow {
  background-color: #F2D6A4; /* Calorie badge background */
}

/* Highlight background color for Carbs, Fats, etc. */
.bg-highlight-yellow {
  background-color: #F2D6A4;
}

/* Protein, Cholesterol, and Sodium background color */
.bg-protein-bg {
  background-color: #F0DEBD; /* Specific background for Protein, Cholesterol, and Sodium */
}

/* Global text styling for meal cards */
.text-black {
  color: #000000;
}

.shadow-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-red-warning {
  background-color: #DEACAC;
}

.bg-yellow-warning {
  background-color: #DDCB9C;
}

.nutrient-widget-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  margin-left: 12rem;
}

.widget-content {
  position: sticky;
  top: 1rem;
  width: 100%;
}

.content-wrapper {
  border-radius: 10px;
  padding: 1rem;

}

.view-selector {
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;

}

.view-selector button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  color: #718096;
}

.view-selector button.active {
  background-color: #87A98D;
  color: white;
}

.view-selector button:hover {
  background-color: #02B5B1;
  color: white;
}



@media (min-width: 768px) {
  .nutrient-widget-container {
    margin-top: -7rem; /* Adjust this value to move the widget higher or lower */
  }
}

</style>
