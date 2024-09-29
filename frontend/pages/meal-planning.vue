<template>
  <div class="relative w-screen z-40 bg-custom-bg">
    <Header />
    <div class="meal-planning">
      <!-- Header with Date Navigation -->
      <div class="flex items-center justify-center py-8">
        <button @click="previousWeek" class="text-custom-bg-green px-2">
          <i class="bi bi-chevron-left"></i> <!-- Larger arrow icon -->
        </button>
    
        <!-- Week Range Display -->
        <span class="text-xl font-semibold px-6">{{ weekRange }}</span> 
    
        <button @click="nextWeek" class="text-custom-bg-green px-2">
          <i class="bi bi-chevron-right"></i> <!-- Larger arrow icon -->
        </button>
      </div>
  
      <!-- Meal Days (Monday to Sunday) -->
      <div class="meal-days-grid">
        <MealDay 
          v-for="(day, index) in daysOfWeek" 
          :key="index" 
          :dayName="day.dayName" 
          :isoDate="day.isoDate"
          :formattedDate="day.formattedDate" 
          :breakfastList="day.breakfastList" 
          :lunchList="day.lunchList" 
          :dinnerList="day.dinnerList" 
          :otherList="day.otherList" 
          :isToday="day.isToday" 
          :isPast="day.isPast" 
          :isFuture="day.isFuture" 
          :mealOverbudget="day.mealOverbudget"
        />
      </div>
    </div>
    <div class="section flex flex-col justify-end fixed-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Initialize the currentDate as the current date
const currentDate = ref(new Date());
const daysOfWeek = ref([]);

// Watch for changes to currentDate and update meals and week range
watch(currentDate, async () => {
  daysOfWeek.value = await generateWeekMeals(currentDate.value);
});

// Function to compute the range of the week
const weekRange = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  const endOfWeek = new Date(currentDate.value);

  // Set the start of the week to Monday
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  // Set the end of the week to Sunday
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Return the formatted date range
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
});

// Function to go to the previous week
const previousWeek = () => {
  const prevDate = new Date(currentDate.value);
  prevDate.setDate(prevDate.getDate() - 7);
  currentDate.value = prevDate;
};

// Function to go to the next week
const nextWeek = () => {
  const nextDate = new Date(currentDate.value);
  nextDate.setDate(nextDate.getDate() + 7);
  currentDate.value = nextDate;
};

// Function to generate meals for the current week
async function generateWeekMeals(date) {
  const weekMeals = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = new Date(date);
    day.setDate(date.getDate() - date.getDay() + i + 1);

    // Fetch meal data (add error handling for API calls)
    try {
      let meals = await useApi(`/meal-logging/get?date=${day.toISOString()}`, "GET");
      let mealBudget = await useApi(`/user/budget?date=${day.toISOString()}`, "GET");
      let remainingNutrients = mealBudget?.value[1] || {};

      let mealOverbudget = false;
      if (
        remainingNutrients.calories < 0 || 
        remainingNutrients.carbs < 0 || 
        remainingNutrients.cholesterol < 0 || 
        remainingNutrients.fats < 0 || 
        remainingNutrients.protein < 0 || 
        remainingNutrients.sodium < 0
      ) {
        mealOverbudget = true;
      }

      weekMeals.push({
        dayName: dayNames[day.getDay()],
        isoDate: day.toISOString(),
        formattedDate: formatDate(day),
        breakfastList: meals?.value?.["Breakfast"] || [],
        lunchList: meals?.value?.["Lunch"] || [],
        dinnerList: meals?.value?.["Dinner"] || [],
        otherList: meals?.value?.["Other"] || [],
        isToday: isToday(day),
        isPast: day < today && !isToday(day),
        isFuture: day > today && !isToday(day),
        mealOverbudget: mealOverbudget,
      });
    } catch (error) {
      console.error("Error fetching meal data:", error);
      // You can add fallback data here if needed
      weekMeals.push({
        dayName: dayNames[day.getDay()],
        isoDate: day.toISOString(),
        formattedDate: formatDate(day),
        breakfastList: [],
        lunchList: [],
        dinnerList: [],
        otherList: [],
        isToday: isToday(day),
        isPast: day < today && !isToday(day),
        isFuture: day > today && !isToday(day),
        mealOverbudget: false,
      });
    }
  }

  return weekMeals;
}

// Function to format the date as 'dd Month'
function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long', // Full month name
  });
}

// Function to check if the given day is today
function isToday(day) {
  const today = new Date();
  return day.toDateString() === today.toDateString();
}

// Fetch meals for the current week on component mount
onMounted(async () => {
  daysOfWeek.value = await generateWeekMeals(currentDate.value);
  useToast().info("note: please mark meals as consumed after eating them!");
});
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
  * {
    font-family: 'Overpass', sans-serif;
  }

  .meal-planning {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 100px;
  }

  .bg-custom-bg {
    background-color: #DAC2A8;
  }

  .meal-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* For 7 days in a week */
    gap: 5px;
    padding: 10px 50px;
  }

  .text-custom-bg-green {
    color: #015B59;
  }

  .fixed-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    background-color: inherit;
  }
</style>
