<template>
  <div class="analytics-page min-h-screen flex flex-col">
    <!-- Header Section -->
    <Header />

    <!-- Page Title, Time Frame Switcher, and Date Selector -->
    <div class="container mx-auto px-4 py-6 relative">
      <!-- Title and Time Frame Switcher -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <!-- Left-aligned Diet Analytics Header -->
        <h1 class="text-4xl font-semibold">Diet Analytics</h1>

        <!-- Centered Time Frame Switcher -->
        <div class="mt-4 md:mt-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <div class="view-selector">
            <button :class="{ active: view === 'day' }" @click="setView('day')">Day</button>
            <button :class="{ active: view === 'week' }" @click="setView('week')">Week</button>
            <button :class="{ active: view === 'month' }" @click="setView('month')">Month</button>
          </div>
        </div>
      </div>

      <!-- Date Selector (Below Title) -->
      <div class="flex items-start justify-start space-x-4 mt-4">
        <button @click="previousDate" class="text-gray-700 text-2xl">
          &lt;
        </button>
        <span class="text-2xl text-black">{{ formattedDate }}</span>
        <button @click="nextDate" class="text-gray-700 text-2xl">
          &gt;
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto grid grid-cols-3 gap-6 px-4 pb-6 items-start">
      <!-- Left Column: Meal Cards -->
      <div class="col-span-2 grid grid-cols-2 gap-6">
        <AnalyticsDayCard :mode="breakfastList.length>0 ? 0 : 2" mealType="Breakfast" :totalNutrition="breakfastTotal" :mealList="breakfastList"/>
        <AnalyticsDayCard :mode="lunchList.length>0 ? 0 : 2" mealType="Lunch" :totalNutrition="lunchTotal" :mealList="lunchList"/>
        <AnalyticsDayCard :mode="dinnerList.length>0 ? 0 : 2" mealType="Dinner" :totalNutrition="dinnerTotal" :mealList="dinnerList"/>
        <AnalyticsDayCard :mode="otherList.length>0 ? 0 : 2" mealType="Other" :totalNutrition="otherTotal" :mealList="otherList"/>
      </div>
      <!-- Right Column: Nutrient Widget -->
      <div class="nutrient-widget-container self-start">
        <div class="widget-content flex flex-col justify-start items-start">
          <NutrientWidget v-model:maxNutrientData="maxNutrientData" v-model:nutrientData="nutrientData"/>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <Footer />
</template>


<script setup>
import { ref, computed } from 'vue';
import NutrientData from '../../classes/nutrientData.js'

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

// Function to format nutrient values with units
function formatNutrientValue(value, nutrient) {
  let unit = 'g'; // default unit
  if (nutrient === 'Cholesterol') {
    unit = 'mg';
  }
  return `${value}${unit}`;
}

// Define the order of nutrients
const nutrientOrder = ['Protein', 'Carbs', 'Cholesterol', 'Fats', 'Sodium'];

// Meals data with detailed information (calories and nutrients as numbers)
const mealsData = {
  Breakfast: [
    {
      name: 'Scrambled Eggs and Hash Brown',
      calories: 350, // Number in kcal
      nutrients: {
        Protein: 12, // in grams
        Carbs: 28,
        Cholesterol: 200, // in mg
        Fats: 15,
        Sodium: 0.5,
      },
    },
    {
      name: 'Mushroom Soup',
      calories: 150,
      nutrients: {
        Protein: 5,
        Carbs: 20,
        Cholesterol: 30,
        Fats: 7,
        Sodium: 0.3,
      },
    },
    // Add more breakfast meals as needed
  ],
  Lunch: [
    {
      name: 'Pad Thai',
      calories: 600,
      nutrients: {
        Protein: 25,
        Carbs: 70,
        Cholesterol: 150,
        Fats: 20,
        Sodium: 1.2,
      },
    },
    {
      name: 'Grilled Chicken',
      calories: 400,
      nutrients: {
        Protein: 35,
        Carbs: 5,
        Cholesterol: 85,
        Fats: 10,
        Sodium: 0.8,
      },
    },
    // Add more lunch meals as needed
  ],
  // You can add more meal categories and their meals here
};

// Computed property to calculate total calories and nutrients for each meal category
const totalMealData = computed(() => {
  const result = {};
  for (const [mealCategory, meals] of Object.entries(mealsData)) {
    let totalCalories = 0;
    const totalNutrients = {};

    for (const meal of meals) {
      // Sum calories
      totalCalories += meal.calories;

      // Sum nutrients
      for (const [nutrient, value] of Object.entries(meal.nutrients)) {
        if (!totalNutrients[nutrient]) {
          totalNutrients[nutrient] = 0;
        }
        totalNutrients[nutrient] += value;
      }
    }

    result[mealCategory] = {
      totalCalories,
      totalNutrients,
    };
  }
  return result;
});

// Date state and functions for date switcher
const currentDate = ref(new Date());

const formattedDate = computed(() => {
  const date = currentDate.value;
  return formatDate(date);
});

function formatDate(date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const options = { month: 'long', year: 'numeric' };
  const monthYear = date.toLocaleDateString('en-US', options);
  return `${day}${suffix} ${monthYear}`;
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function previousDate() {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - 1);
  currentDate.value = date;
}

function nextDate() {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() + 1);
  currentDate.value = date;
}

// View state and function
const view = ref('day');
const setView = (newView) => {
  view.value = newView;
  navigateTo(`/analytics-${newView}`);
};

const analyticsData = ref(null)
const breakfastTotal = ref({})
const breakfastList = ref([])
const lunchTotal = ref({})
const lunchList = ref([])
const dinnerTotal = ref({})
const dinnerList = ref([])
const otherTotal = ref({})
const otherList = ref([])


const maxNutrientData = ref(null)
const nutrientData = ref(null)
onMounted(async() => {
  await useApi("/dietary","GET")

  let currentDate = new Date();
  currentDate.setUTCHours(-8, 0, 0, 0);
  currentDate = currentDate.toISOString().split('T')[0]
  analyticsData.value = await useApi(`/analytics/daily?date=${currentDate}&timeZone=Asia/Kuala_Lumpur`,"GET")
  console.log(analyticsData.value)
  breakfastTotal.value = analyticsData.value.value.Breakfast_total
  breakfastList.value = analyticsData.value.value.Breakfast
  lunchTotal.value = analyticsData.value.value.Lunch_total
  lunchList.value = analyticsData.value.value.Lunch
  dinnerTotal.value = analyticsData.value.value.Dinner_total
  dinnerList.value = analyticsData.value.value.Dinner
  otherTotal.value = analyticsData.value.value.Other_total
  otherList.value = analyticsData.value.value.Other


  let result = await useApi(`/user/budget?startDate=${currentDate}&timeZone=Asia/Kuala_Lumpur`, "GET");
  console.log(result);

  maxNutrientData.value = NutrientData.fromApi2(result.value[currentDate][0]);
  nutrientData.value = NutrientData.fromApi2(result.value[currentDate][1]);
})


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
  width: 380px; /* Increased width for more space */
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

