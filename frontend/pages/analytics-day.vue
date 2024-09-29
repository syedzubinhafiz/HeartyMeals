<template>
  <div class="analytics-page min-h-screen flex flex-col">
    <!-- Header Section -->
    <Header />

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
      <!-- Left Column: Meal Cards -->
      <div class="col-span-2 grid grid-cols-2 gap-6">
        <!-- Breakfast Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
          <div class="flex justify-between items-start mb-2">
            <!-- Adjusted flex container -->
            <div class="relative">
              <div class="flex items-center">
                <h1 class="font-bold text-black text-xl leading-normal">Breakfast</h1>
                <img
                  src="../assets/img/InformationIcon.png"
                  alt="info"
                  class="ml-3 w-6 h-6 cursor-pointer"
                  @mouseover="showTooltip('Breakfast')"
                  @mouseleave="hideTooltip('Breakfast')"
                />
              </div>
              <h3 class="text-gray-800 mt-1">Scrambled Eggs and Hash Brown</h3>
              <!-- Tooltip (shown on hover) -->
              <div
                v-if="tooltipVisible.Breakfast"
                class="tooltip"
              >
                <!-- Mini Meal Cards in Tooltip -->
                <div
                  v-for="meal in mealsData.Breakfast"
                  :key="meal.name"
                  class="bg-card-beige rounded-lg p-2 shadow-card mb-2"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-bold text-black text-md leading-normal">{{ meal.name }}</h3>
                    </div>
                    <div class="bg-calories-yellow text-black px-2 py-1 rounded-lg text-xs shadow-sm">
                      Calories <span class="font-bold">{{ meal.calories }}</span>
                    </div>
                  </div>
                  <!-- Nutrition Info Grid -->
                  <div class="grid grid-cols-5 gap-0 text-xs">
                    <div
                      v-for="(value, key) in meal.nutrients"
                      :key="key"
                      :class="['nutrition-item', nutrientBgClass(key), 'p-1', 'text-center']"
                    >
                      <p class="text-gray-800">{{ key }}</p>
                      <p class="font-bold text-black">{{ value }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
              Calories <span class="font-bold">1000kcal</span>
            </div>
          </div>
        </div>

        <!-- Lunch Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
          <div class="flex justify-between items-start mb-2">
            <!-- Adjusted flex container -->
            <div class="relative">
              <div class="flex items-center">
                <h1 class="font-bold text-black text-xl leading-normal">Breakfast</h1>
                <img
                  src="../assets/img/InformationIcon.png"
                  alt="info"
                  class="ml-3 w-6 h-6 cursor-pointer"
                  @mouseover="showTooltip('Lunch')"
                  @mouseleave="hideTooltip('Lunch')"
                />
              </div>
              <h3 class="text-gray-800 mt-1">Scrambled Eggs and Hash Brown</h3>
              <!-- Tooltip (shown on hover) -->
              <div
                v-if="tooltipVisible.Lunch"
                class="tooltip"
              >
                <!-- Mini Meal Cards in Tooltip -->
                <div
                  v-for="meal in mealsData.Lunch"
                  :key="meal.name"
                  class="bg-card-beige rounded-lg p-2 shadow-card mb-2"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-bold text-black text-md leading-normal">{{ meal.name }}</h3>
                    </div>
                    <div class="bg-calories-yellow text-black px-2 py-1 rounded-lg text-xs shadow-sm">
                      Calories <span class="font-bold">{{ meal.calories }}</span>
                    </div>
                  </div>
                  <!-- Nutrition Info Grid -->
                  <div class="grid grid-cols-5 gap-0 text-xs">
                    <div
                      v-for="(value, key) in meal.nutrients"
                      :key="key"
                      :class="['nutrition-item', nutrientBgClass(key), 'p-1', 'text-center']"
                    >
                      <p class="text-gray-800">{{ key }}</p>
                      <p class="font-bold text-black">{{ value }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
              Calories <span class="font-bold">1000kcal</span>
            </div>
          </div>
        </div>

        <!-- Dinner Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <h1 class="font-bold text-black text-xl leading-normal">Dinner</h1>
          <div class="bg-red-warning mt-4 text-black py-2 rounded-lg text-center">
            Meal not logged
          </div>
        </div>

        <!-- Other Card -->
        <div class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <h1 class="font-bold text-black text-xl leading-normal">Other</h1>
          <div class="bg-yellow-warning mt-4 text-black py-2 rounded-lg text-center">
            Meal yet to be logged
          </div>
        </div>
      </div>

      <!-- Right Column: Nutrient Widget -->
      <div class="nutrient-widget-container self-start">
        <div class="widget-content flex flex-col justify-start items-start">
          <NutrientWidget />
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <Footer />
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'emptylayout',
});

// Tooltip visibility state
const tooltipVisible = ref({
  Breakfast: false,
  Lunch: false,
  Dinner: false,
  Other: false,
});

// Show and hide tooltip functions
function showTooltip(mealCategory) {
  tooltipVisible.value[mealCategory] = true;
}

function hideTooltip(mealCategory) {
  tooltipVisible.value[mealCategory] = false;
}

// Function to determine background class for nutrients
function nutrientBgClass(nutrient) {
  if (['Protein', 'Cholesterol', 'Sodium'].includes(nutrient)) {
    return 'bg-protein-bg';
  } else {
    return 'bg-highlight-yellow';
  }
}

// Meals data with detailed information
const mealsData = {
  Breakfast: [
    {
      name: 'Scrambled Eggs and Hash Brown',
      calories: '350kcal',
      nutrients: {
        Protein: '12g',
        Carbs: '28g',
        Cholesterol: '200mg',
        Fats: '15g',
        Sodium: '0.5g',
      },
    },
    {
      name: 'Mushroom Soup',
      calories: '150kcal',
      nutrients: {
        Protein: '5g',
        Carbs: '20g',
        Cholesterol: '30mg',
        Fats: '7g',
        Sodium: '0.3g',
      },
    },
    // Add more breakfast meals as needed
  ],
  Lunch: [
    {
      name: 'Pad Thai',
      calories: '600kcal',
      nutrients: {
        Protein: '25g',
        Carbs: '70g',
        Cholesterol: '150mg',
        Fats: '20g',
        Sodium: '1.2g',
      },
    },
    {
      name: 'Grilled Chicken',
      calories: '400kcal',
      nutrients: {
        Protein: '35g',
        Carbs: '5g',
        Cholesterol: '85mg',
        Fats: '10g',
        Sodium: '0.8g',
      },
    },
    // Add more lunch meals as needed
  ],
  // You can add more meal categories and their meals here
};

// View state and function
const view = ref('day');
const setView = (newView) => {
  view.value = newView;
  navigateTo(`/analytics-${newView}`);
};
</script>



<style>
/* Page background color */
.analytics-page {
  background-color: #dac2a8; /* Darker beige background for the entire page */
}

/* Meal card background color */
.bg-card-beige {
  background-color: #f3eada; /* Meal cards are darker beige */
}

/* Calorie section background color */
.bg-calories-yellow {
  background-color: #f2d6a4; /* Calorie badge background */
}

/* Highlight background color for Carbs, Fats, etc. */
.bg-highlight-yellow {
  background-color: #f2d6a4;
}

/* Protein, Cholesterol, and Sodium background color */
.bg-protein-bg {
  background-color: #f0debd; /* Specific background for Protein, Cholesterol, and Sodium */
}

/* Global text styling for meal cards */
.text-black {
  color: #000000;
}

.shadow-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-red-warning {
  background-color: #deacac;
}

.bg-yellow-warning {
  background-color: #ddcb9c;
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
  background-color: #87a98d;
  color: white;
}

.view-selector button:hover {
  background-color: #02b5b1;
  color: white;
}

/* Tooltip styling */
.tooltip {
  position: absolute;
  z-index: 10;
  background-color: #f3eada; /* Beige background */
  color: #000000; /* Black text */
  padding: 0.5rem;
  border-radius: 0.5rem; /* Rounded edges */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  top: 2.5rem; /* Adjust as needed */
  left: 0;   /* Adjust as needed */
  width: 280px; /* Set a width for consistency */
}

/* Mini meal card inside tooltip */
.tooltip .bg-card-beige {
  background-color: #f3eada; /* Ensure consistency */
}

.tooltip .shadow-card {
  box-shadow: none; /* Remove extra shadow inside tooltip */
}

.tooltip h3.meal-name {
  font-size: 1rem;
}

.tooltip .nutrition-item {
  padding: 0.25rem;
}

.tooltip .nutrition-item p {
  font-size: 0.75rem;
}

.tooltip .bg-calories-yellow {
  background-color: #f2d6a4;
}

/* Adjust font sizes for tooltip */
.tooltip .text-xs {
  font-size: 0.75rem;
}

.tooltip .text-sm {
  font-size: 0.875rem;
}

.tooltip .text-md {
  font-size: 1rem;
}

.meal-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.nutrient-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.nutrient-item {
  width: 50%;
  display: flex;
  justify-content: space-between;
}

.nutrient-name {
  color: #4a5568; /* Gray color for nutrient names */
}

.nutrient-value {
  font-weight: bold;
}

.calories-info {
  font-weight: bold;
  text-align: right;
}

.calories-value {
  color: #e53e3e; /* Red color for calories */
}

@media (min-width: 768px) {
  .nutrient-widget-container {
    margin-top: -7rem; /* Adjust this value to move the widget higher or lower */
  }
}


</style>
