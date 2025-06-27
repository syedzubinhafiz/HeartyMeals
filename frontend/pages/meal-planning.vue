<template>
  <div class="relative w-screen z-40 bg-custom-bg">
    <Header />
    <div class="meal-planning">
      <!-- Header with Date Navigation -->
      <div class="flex items-center justify-center py-10">
        <button @click="previousPeriod" class="text-custom-bg-green px-2">
          <i class="bi bi-chevron-left"></i> <!-- Larger arrow icon -->
        </button>
    
        <!-- Date Range Display -->
        <span class="text-2xl font-semibold px-8">{{ dateRange }}</span> 
    
        <button @click="nextPeriod" class="text-custom-bg-green px-2">
          <i class="bi bi-chevron-right"></i> <!-- Larger arrow icon -->
        </button>
      </div>
      
      <!-- View Toggle -->
      <div class="flex justify-center mb-8">
        <button @click="goToToday" class="bg-custom-bg-green text-white px-6 py-3 rounded-lg hover:opacity-80 transition-opacity font-medium">
          Go to Today
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

// Initialize the starting date for the focused view (defaults to today)
const startDate = ref(new Date());
const daysOfWeek = ref([]);

// Watch for changes to startDate and update meals
watch(startDate, async () => {
  daysOfWeek.value = await generateFocusedMeals(startDate.value);
});

// Function to compute the date range for the focused view
const dateRange = computed(() => {
  const endDate = new Date(startDate.value);
  endDate.setDate(endDate.getDate() + 3);

  // Return the formatted date range
  return `${formatDate(startDate.value)} - ${formatDate(endDate)}`;
});

// Function to go to the previous 4 days
const previousPeriod = () => {
  const prevDate = new Date(startDate.value);
  prevDate.setDate(prevDate.getDate() - 4);
  startDate.value = prevDate;
};

// Function to go to the next 4 days
const nextPeriod = () => {
  const nextDate = new Date(startDate.value);
  nextDate.setDate(nextDate.getDate() + 4);
  startDate.value = nextDate;
};

// Function to go back to today's view
const goToToday = () => {
  startDate.value = new Date();
};

// Function to generate meals for the focused 4-day view (today + next 3 days)
async function generateFocusedMeals(startDate) {
  const focusedMeals = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  for (let i = 0; i < 4; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const currentDate = useDate().getFormattedDateShort(day)
    // Fetch meal data (add error handling for API calls)
    try {
      let meals = await useApi(`/meal-logging/get?startDate=${currentDate}&timeZone=Asia/Kuala_Lumpur`, "GET");
      let mealBudget = await useApi(`/user/budget?startDate=${currentDate}&timeZone=Asia/Kuala_Lumpur`, "GET");
      const mealsData = meals?.value ?? meals;
      const budgetData = mealBudget?.value ?? mealBudget;
      let remainingNutrients = budgetData?.[currentDate]?.[1] || {};
      console.log(mealsData);

      let mealOverbudget = false;
      if (
        remainingNutrients.calories < 0 || 
        remainingNutrients.carbs < 0 || 
        remainingNutrients.cholesterol < 0 || 
        remainingNutrients.fat < 0 || 
        remainingNutrients.protein < 0 || 
        remainingNutrients.sodium < 0
      ) {
        mealOverbudget = true;
      }

      focusedMeals.push({
        dayName: dayNames[day.getDay()],
        isoDate: day.toISOString(),
        formattedDate: formatDate(day),
        breakfastList: mealsData?.[currentDate]?.meals["Breakfast"] || [],
        lunchList: mealsData?.[currentDate]?.meals["Lunch"] || [],
        dinnerList: mealsData?.[currentDate]?.meals["Dinner"] || [],
        otherList: mealsData?.[currentDate]?.meals["Other"] || [],
        isToday: isToday(day),
        isPast: day < today && !isToday(day),
        isFuture: day > today && !isToday(day),
        mealOverbudget: mealOverbudget,
      });
    } catch (error) {
      console.error("Error fetching meal data:", error);
      // You can add fallback data here if needed
      focusedMeals.push({
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

  return focusedMeals;
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

// Fetch meals for the focused view on component mount
onMounted(async () => {
  daysOfWeek.value = await generateFocusedMeals(startDate.value);
  useToast().info("note: please mark meals as consumed after eating them!");
});
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
  * {
    font-family: 'Overpass', sans-serif;
  }

  .meal-planning {
    padding: 0 30px 150px;
    min-height: calc(100vh - 200px);
  }

  @media (max-width: 768px) {
    .meal-planning {
      padding: 0 10px 120px;
    }
  }

  .bg-custom-bg {
    background-color: #DAC2A8;
  }

  .meal-days-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 20px 30px;
    max-width: 1500px;
    margin: 0 auto;
  }

  /* Mobile responsiveness */
  @media (max-width: 1024px) {
    .meal-days-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 20px 15px;
    }
  }

  @media (max-width: 640px) {
    .meal-days-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 20px 12px;
    }
  }

  @media (max-width: 480px) {
    .meal-days-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 15px 8px;
    }
  }

  .text-custom-bg-green {
    color: #015B59;
  }

  .bg-custom-bg-green {
    background-color: #015B59;
  }

  .fixed-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    background-color: inherit;
  }
</style>
