<template>
  <div class="relative w-full z-40 bg-custom-bg main-container">
    <Header />
    <div class="meal-planning px-4 lg:px-8">
      <!-- Header with Date Navigation -->
      <div class="flex items-center justify-center py-6 lg:py-10">
        <button 
          @click="previousPeriod" 
          class="text-custom-bg-green p-2 min-w-touch min-h-touch flex items-center justify-center"
          aria-label="Previous period"
        >
          <i class="bi bi-chevron-left text-lg lg:text-xl"></i>
        </button>
    
        <!-- Date Range Display -->
        <span class="text-lg lg:text-2xl font-semibold px-4 lg:px-8 text-center">{{ dateRange }}</span> 
    
        <button 
          @click="nextPeriod" 
          class="text-custom-bg-green p-2 min-w-touch min-h-touch flex items-center justify-center"
          aria-label="Next period"
        >
          <i class="bi bi-chevron-right text-lg lg:text-xl"></i>
        </button>
      </div>
      
      <!-- View Toggle -->
      <div class="flex justify-center mb-6 lg:mb-8">
        <button 
          @click="goToToday" 
          class="bg-custom-bg-green text-white px-6 py-3 rounded-lg hover:opacity-80 transition-opacity font-medium min-h-touch"
        >
          Go to Today
        </button>
      </div>
  
      <!-- Meal Days (Monday to Sunday) -->
      <div class="meal-days-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 flex-1">
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
          @mealConsumed="handleMealConsumed"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

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
  
  // Add visibility change listener to refresh data when page becomes visible
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Add focus listener to refresh data when window gains focus
  window.addEventListener('focus', handleWindowFocus);
});

onBeforeUnmount(() => {
  // Clean up event listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('focus', handleWindowFocus);
});

const handleVisibilityChange = async () => {
  if (!document.hidden) {
    // Page became visible, refresh meal data
    console.log('Meal planning page became visible, refreshing meal data...');
    daysOfWeek.value = await generateFocusedMeals(startDate.value);
  }
};

const handleWindowFocus = async () => {
  // Window gained focus, refresh meal data
  console.log('Meal planning window gained focus, refreshing meal data...');
  daysOfWeek.value = await generateFocusedMeals(startDate.value);
};

const handleMealConsumed = async (mealId) => {
  console.log('Meal consumed, refreshing meal planning data:', mealId);
  
  // Refresh the meal planning data
  daysOfWeek.value = await generateFocusedMeals(startDate.value);
  
  // Trigger a global nutrition refresh for other pages
  // Use localStorage to trigger storage event on other tabs/pages
  const nutritionRefreshEvent = {
    type: 'nutritionRefresh',
    timestamp: Date.now(),
    mealId: mealId
  };
  localStorage.setItem('nutritionRefresh', JSON.stringify(nutritionRefreshEvent));
  
  // Remove the item immediately to allow future triggers
  setTimeout(() => {
    localStorage.removeItem('nutritionRefresh');
  }, 100);
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
  * {
    font-family: 'Overpass', sans-serif;
  }

  .bg-custom-bg {
    background-color: #DAC2A8;
  }

  /* Desktop: Non-scrollable layout */
  .main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .meal-planning {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
  }

  /* Mobile: Scrollable layout */
  @media (max-width: 768px) {
    .main-container {
      height: auto;
      min-height: 100vh;
      overflow: visible;
      display: block;
    }

    .meal-planning {
      overflow: visible;
      height: auto;
      min-height: calc(100vh - 140px); /* Account for header and footer */
      padding-bottom: 20px; /* Extra space before footer */
    }
  }

  /* Desktop grid - fixed height, no page scroll */
  .meal-days-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 20px 30px 30px 30px;
    max-width: 1500px;
    margin: 0 auto;
    overflow: hidden;
    min-height: 0;
    width: 100%; /* Ensure full width usage */
    box-sizing: border-box; /* Include padding in width */
  }

  /* Desktop specific - ensure flex behavior */
  @media (min-width: 769px) {
    .meal-days-grid {
      flex: 1;
      height: 100%; /* Use full available height */
    }
    
    /* Ensure equal column widths */
    .meal-days-grid > * {
      min-width: 0; /* Allow grid items to shrink */
      max-width: 100%; /* Prevent grid items from expanding beyond their column */
    }
  }

  /* Completely hidden scrollbars for clean design */

  /* Mobile responsiveness */
  @media (max-width: 1024px) and (min-width: 769px) {
    .meal-days-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 20px 15px 25px 15px; /* Added bottom padding */
      flex: 1;
      overflow: hidden; /* Keep desktop behavior for tablets */
    }
  }

  @media (max-width: 640px) {
    .meal-days-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 20px 12px 20px 12px; /* Added bottom padding */
      height: auto; /* Allow natural height on mobile */
      overflow: visible; /* Allow content to flow naturally */
      flex: none; /* Remove flex constraint */
    }
  }

  @media (max-width: 480px) {
    .meal-days-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 15px 8px 15px 8px; /* Added bottom padding */
      height: auto; /* Allow natural height on mobile */
      overflow: visible; /* Allow content to flow naturally */
      flex: none; /* Remove flex constraint */
    }
  }

  .text-custom-bg-green {
    color: #015B59;
  }

  .bg-custom-bg-green {
    background-color: #015B59;
  }


</style>

