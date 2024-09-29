<template>
  <div class="analytics-page min-h-screen flex flex-col">
    <!-- Header Section -->
    <Header />

    <!-- Page Title, Time Frame Switcher, and Date Selector -->
    <div class="container mx-auto px-4 py-6">
      <!-- Title and Time Frame Switcher -->
      <div class="flex justify-between items-center">
        <h1 class="text-4xl font-semibold">Diet Analytics</h1>
        <!-- Time Frame Switcher -->
        <div class="flex space-x-4">
          <button class="px-4 py-2 bg-green-200 text-green-900 font-medium rounded-full">Day</button>
          <button class="px-4 py-2 bg-gray-200 text-gray-600 font-medium rounded-full">Week</button>
          <button class="px-4 py-2 bg-gray-200 text-gray-600 font-medium rounded-full">Month</button>
        </div>
      </div>

      <!-- Date Selector (Below Title) -->
      <div class="flex space-x-4 mt-4">
        <button class="text-gray-700">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="text-2xl text-black">24 April 2024</span>
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
            <div>
              <H1 class="font-bold text-black">Breakfast</H1>
              <h3 class="text-black mt-2">Scrambled Eggs and Hash Browns</h3>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
              Calories <span class="font-bold">500kcal</span>
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

        <!-- Lunch Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
          <div class="flex justify-between items-center mb-2">
            <div>
              <H1 class="font-bold text-black">Lunch</H1>
              <h3 class="text-gray-800 mt-2">Pad Thai</h3>
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
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

.nutrient-widget {
  margin: 0 !important;
  padding: 0 !important;
  position: relative;
  align-self: flex-start;
  height: auto;
}


</style>
