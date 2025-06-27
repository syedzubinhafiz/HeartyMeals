<template>
  <Header />
  <div class="analytics-page">
    <!-- Header Section -->

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
        <button @click="prevDay" class="text-gray-700 text-2xl">
          &lt;
        </button>
        <span class="text-2xl text-black">{{ formatDate(currentDay) }}</span>
        <button @click="nextDay" class="text-gray-700 text-2xl">
          &gt;
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-main">
      <!-- Left Column: Meal Cards -->
      <div class="col-span-2 grid grid-cols-2 gap-6">
        <AnalyticsDayCard :mode="breakfastList.length>0 ? 0 : 2" mealType="Breakfast" :totalNutrition="breakfastTotal" :mealList="breakfastList"/>
        <AnalyticsDayCard :mode="lunchList.length>0 ? 0 : 2" mealType="Lunch" :totalNutrition="lunchTotal" :mealList="lunchList"/>
        <AnalyticsDayCard :mode="dinnerList.length>0 ? 0 : 2" mealType="Dinner" :totalNutrition="dinnerTotal" :mealList="dinnerList"/>
        <AnalyticsDayCard :mode="otherList.length>0 ? 0 : 2" mealType="Other" :totalNutrition="otherTotal" :mealList="otherList"/>
      </div>
      <!-- Right Column: Nutrient Widget -->
    </div>
      <div style="position: absolute; top: 7.5%; right: 2.5%; transform: scale(0.7);">
          <NutritionWidgetCurve :nutrients="nutrients"/>
      </div>
  </div>
  <!-- Footer -->
   <footer>
    <Footer />
   </footer>
</template>


<script setup>
import { ref, computed } from 'vue';
import NutrientData from '../../classes/nutrientData.js'
import NutritionWidgetCurve from '~/components/Nutrient/NutritionWidgetCurve.vue';

definePageMeta({
  layout: 'emptylayout',
});

const { $axios } = useNuxtApp();

// Tooltip visibility state
const tooltipVisible = ref({
  Breakfast: false,
  Lunch: false,
  Dinner: false,
  Other: false,
});

// day switching
const currentDay = ref(new Date())

const prevDay = async () => {
  currentDay.value.setDate(currentDay.value.getDate()-1)
  getData()
}
const nextDay = async () => {
  currentDay.value.setDate(currentDay.value.getDate()+1)
  getData()
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

// View state and function
const view = ref('day');
const setView = async (newView) => {
  view.value = newView;
  await navigateTo(`/analytics-${newView}`);
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

const nutrients = ref([
  {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0
  },
  {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0
  },
  {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0
  }
]);

onMounted(async() => {
  await useApi("/dietary","GET")
  await getData()
})

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const getData = async () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let currentDate = currentDay.value;

  const token = localStorage.getItem('accessToken');
  analyticsData.value = await $axios.get(`/analytics/daily?date=${formatDate(currentDate)}&timeZone=${timeZone}`,{
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
      });
      
  breakfastTotal.value = analyticsData.value.data.Breakfast_total
  breakfastList.value = analyticsData.value.data.Breakfast
  lunchTotal.value = analyticsData.value.data.Lunch_total
  lunchList.value = analyticsData.value.data.Lunch
  dinnerTotal.value = analyticsData.value.data.Dinner_total
  dinnerList.value = analyticsData.value.data.Dinner
  otherTotal.value = analyticsData.value.data.Other_total
  otherList.value = analyticsData.value.data.Other

  nutrients.value[0].calories = analyticsData.value.data.daily_budget.calories;
  nutrients.value[0].carbs = analyticsData.value.data.daily_budget.carbohydrates;
  nutrients.value[0].protein = analyticsData.value.data.daily_budget.protein;
  nutrients.value[0].fat = analyticsData.value.data.daily_budget.fat;
  nutrients.value[0].sodium = analyticsData.value.data.daily_budget.sodium;
  nutrients.value[0].cholesterol = analyticsData.value.data.daily_budget.cholesterol;

  nutrients.value[2].calories = analyticsData.value.data.remaining_budget.calories;
  nutrients.value[2].carbs = analyticsData.value.data.remaining_budget.carbohydrates;
  nutrients.value[2].protein = analyticsData.value.data.remaining_budget.protein;
  nutrients.value[2].fat = analyticsData.value.data.remaining_budget.fat;
  nutrients.value[2].sodium = analyticsData.value.data.remaining_budget.sodium;
  nutrients.value[2].cholesterol = analyticsData.value.data.remaining_budget.cholesterol;
}
</script>

<style>
/* Page background color */
.analytics-page {
  background-color: #dac2a8; /* Darker beige background for the entire page */
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
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

.container-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  margin-top: 1%;
  width: 90%;
  grid-template-rows: 70%;
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

@media (min-width: 768px) {
  .nutrient-widget-container {
    margin-top: -7rem; /* Adjust this value to move the widget higher or lower */
  }
}
</style>

