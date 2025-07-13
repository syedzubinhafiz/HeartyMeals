<template>
  <Header />
  <div class="analytics-page">
    <!-- Header Section -->

    <!-- Page Title, Time Frame Switcher, and Date Selector -->
    <div class="container mx-auto px-4 py-6 relative">
      <!-- Title and Time Frame Switcher -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <!-- Left-aligned Diet Analytics Header -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-center md:text-left">Diet Analytics</h1>

        <!-- Centered Time Frame Switcher -->
        <div class="mt-4 md:mt-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex justify-center">
          <div class="view-selector">
            <button :class="{ active: view === 'day' }" @click="setView('day')">Day</button>
            <button :class="{ active: view === 'week' }" @click="setView('week')">Week</button>
            <button :class="{ active: view === 'month' }" @click="setView('month')">Month</button>
          </div>
        </div>
      </div>

      <!-- Date Selector (Below Title) -->
      <div class="flex items-center justify-center mt-4">
        <div class="flex items-center space-x-6 sm:space-x-8">
          <button @click="prevDay" class="text-gray-700 text-xl sm:text-2xl p-2 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center w-10 h-10">
            &lt;
          </button>
          <span class="text-lg sm:text-2xl text-black text-center min-w-fit px-4">{{ formatDate(currentDay) }}</span>
          <button @click="nextDay" class="text-gray-700 text-xl sm:text-2xl p-2 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center w-10 h-10">
            &gt;
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-main">
      <!-- Left Column: Meal Cards -->
      <div class="meal-cards-grid">
        <AnalyticsDayCard :mode="breakfastList.length > 0 ? 0 : 2" mealType="Breakfast" :totalNutrition="breakfastTotal" :mealList="breakfastList"/>
        <AnalyticsDayCard :mode="lunchList.length > 0 ? 0 : 2" mealType="Lunch" :totalNutrition="lunchTotal" :mealList="lunchList"/>
        <AnalyticsDayCard :mode="dinnerList.length > 0 ? 0 : 2" mealType="Dinner" :totalNutrition="dinnerTotal" :mealList="dinnerList"/>
        <AnalyticsDayCard :mode="otherList.length > 0 ? 0 : 2" mealType="Other" :totalNutrition="otherTotal" :mealList="otherList"/>
      </div>
      <!-- Right Column: Nutrient Widget -->
      <div class="nutrition-widget-container">
        <NutritionWidgetCurve :key="formatDate(currentDay)" :nutrients="nutrients"/>
      </div>
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
  try {
    // Clear existing data first to prevent stale data
    breakfastTotal.value = {};
    breakfastList.value = [];
    lunchTotal.value = {};
    lunchList.value = [];
    dinnerTotal.value = {};
    dinnerList.value = [];
    otherTotal.value = {};
    otherList.value = [];
    
    // Reset nutrition data
    nutrients.value = [
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 },
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 },
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 }
    ];

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let currentDate = currentDay.value;

    console.log(`Fetching analytics for date: ${formatDate(currentDate)}`);
    
    const token = localStorage.getItem('accessToken');
    analyticsData.value = await $axios.get(`/analytics/daily?date=${formatDate(currentDate)}&timeZone=${timeZone}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
    // Check if we have valid response data
    if (!analyticsData.value?.data) {
      console.error('No analytics data received');
      return;
    }

    const data = analyticsData.value.data;
    console.log('Analytics response data:', data);
    
    // Map meal data with correct case (backend returns capital case for meal types)
    breakfastTotal.value = data.Breakfast_total || {};
    breakfastList.value = data.Breakfast || [];
    lunchTotal.value = data.Lunch_total || {};
    lunchList.value = data.Lunch || [];
    dinnerTotal.value = data.Dinner_total || {};
    dinnerList.value = data.Dinner || [];
    otherTotal.value = data.Other_total || {};
    otherList.value = data.Other || [];
    
    console.log('Meal data loaded - Breakfast:', breakfastList.value.length, 'Lunch:', lunchList.value.length, 'Dinner:', dinnerList.value.length, 'Other:', otherList.value.length);

    // Set daily budget (index 0) with fallbacks
    if (data.daily_budget) {
      nutrients.value[0].calories = data.daily_budget.calories || 0;
      nutrients.value[0].carbs = data.daily_budget.carbohydrates || 0;
      nutrients.value[0].protein = data.daily_budget.protein || 0;
      nutrients.value[0].fat = data.daily_budget.fat || 0;
      nutrients.value[0].sodium = data.daily_budget.sodium || 0;
      nutrients.value[0].cholesterol = data.daily_budget.cholesterol || 0;
    }

    // Handle remaining nutrients (check both possible field names)
    const remainingData = data.remaining_budget || data.remaining_nutrients || {};
    
    // Calculate consumed nutrients (index 1) = daily_budget - remaining
    if (data.daily_budget && remainingData) {
      nutrients.value[1].calories = (data.daily_budget.calories || 0) - (remainingData.calories || 0);
      nutrients.value[1].carbs = (data.daily_budget.carbohydrates || 0) - (remainingData.carbohydrates || 0);
      nutrients.value[1].protein = (data.daily_budget.protein || 0) - (remainingData.protein || 0);
      nutrients.value[1].fat = (data.daily_budget.fat || 0) - (remainingData.fat || 0);
      nutrients.value[1].sodium = (data.daily_budget.sodium || 0) - (remainingData.sodium || 0);
      nutrients.value[1].cholesterol = (data.daily_budget.cholesterol || 0) - (remainingData.cholesterol || 0);
    }

    // Set remaining budget (index 2)
    nutrients.value[2].calories = remainingData.calories || 0;
    nutrients.value[2].carbs = remainingData.carbohydrates || 0;
    nutrients.value[2].protein = remainingData.protein || 0;
    nutrients.value[2].fat = remainingData.fat || 0;
    nutrients.value[2].sodium = remainingData.sodium || 0;
    nutrients.value[2].cholesterol = remainingData.cholesterol || 0;
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Set default values on error and ensure all data is cleared
    nutrients.value = [
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 },
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 },
      { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, cholesterol: 0 }
    ];
    
    // Ensure meal data is also cleared on error
    breakfastTotal.value = {};
    breakfastList.value = [];
    lunchTotal.value = {};
    lunchList.value = [];
    dinnerTotal.value = {};
    dinnerList.value = [];
    otherTotal.value = {};
    otherList.value = [];
  }
}
</script>

<style>
/* Page background color */
.analytics-page {
  background-color: #dac2a8; /* Darker beige background for the entire page */
  min-height: 100vh;
}

/* Mobile: Add bottom padding to prevent footer overlap */
@media (max-width: 768px) {
  .analytics-page {
    padding-bottom: 6rem; /* Space for footer */
  }
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
}

/* Mobile: Make footer non-fixed to prevent content overlap */
@media (max-width: 768px) {
  footer {
    position: relative;
    margin-top: 2rem;
  }
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
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin: 0 auto;
  margin-top: 1%;
  width: 90%;
  max-width: 1400px;
  align-items: start;
}

/* Mobile-first: Single column layout */
@media (max-width: 768px) {
  .container-main {
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 95%;
    margin-top: 2%;
  }
}

.meal-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Mobile: Single column for small screens */
@media (max-width: 480px) {
  .meal-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Large phones: Keep 2 columns */
@media (min-width: 481px) and (max-width: 768px) {
  .meal-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

.nutrition-widget-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: calc(100% + 5rem); /* Increase height to compensate for negative margin */
  padding: 0rem 1rem 2rem; /* Reduced top padding to move widget up */
  overflow: visible; /* Change to visible to show the full widget */
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  margin-top: -5rem; /* Add negative margin to move widget higher */
}

/* Mobile: Fix positioning and scaling */
@media (max-width: 768px) {
  .nutrition-widget-container {
    margin-top: 1rem;
    height: auto;
    padding: 1rem;
    margin-bottom: 2rem; /* Add space above footer */
  }
  
  .nutrition-widget-container > * {
    transform: scale(0.9);
    transform-origin: center;
  }
}

.nutrition-widget-container > * {
  transform: scale(1.0);
  transform-origin: top center;
  max-width: 100%;
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
  width: 100%;
  max-width: 300px;
}

/* Mobile view selector */
@media (max-width: 768px) {
  .view-selector {
    justify-content: center;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
  
  .view-selector button {
    flex: 1;
    text-align: center;
    min-height: 44px;
    font-size: 0.9rem;
  }
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

/* Mobile tooltip responsive fix */
@media (max-width: 480px) {
  .tooltip {
    width: calc(100vw - 3rem);
    left: -1rem;
    max-width: 350px;
    right: 1rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .tooltip {
    width: 320px;
    max-width: calc(100vw - 2rem);
  }
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

/* Planned meal styling */
.opacity-60 {
  opacity: 0.6;
}

.opacity-60 .bg-calories-yellow {
  background-color: #e8d49a; /* Slightly muted yellow for planned meals */
}

@media (min-width: 768px) {
  .nutrient-widget-container {
    margin-top: -7rem; /* Adjust this value to move the widget higher or lower */
  }
}
</style>

