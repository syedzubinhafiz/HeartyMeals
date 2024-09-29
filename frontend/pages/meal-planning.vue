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
      <!-- Parent Component -->
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
    <div class="section flex flex-col justify-end fixed-footer ">
        <Footer />
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';

const currentDate = ref(new Date());
const daysOfWeek = ref([]);

const previousWeek = async () => {
  currentDate.value.setDate(currentDate.value.getDate() - 7);
  daysOfWeek.value = await generateWeekMeals(currentDate.value);
};

const nextWeek = async () => {
  currentDate.value.setDate(currentDate.value.getDate() + 7);
  daysOfWeek.value = await generateWeekMeals(currentDate.value);
};

const weekRange = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  const endOfWeek = new Date(currentDate.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7);
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
});
  
async function generateWeekMeals(date) {
  const weekMeals = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = new Date(date);
    // day.setUTCHours(-8, 0, 0, 0)
    day.setDate(date.getDate() - date.getDay() + i + 1);
    let meals = await useApi(`/meal-logging/get?date=${day.toISOString()}`,"GET")
    let mealBudget = await useApi(`/user/budget?date=${day.toISOString()}`, "GET");
    let remainingNutrients = mealBudget.value[1]
    let mealOverbudget = false
    if(remainingNutrients.calories<0 || remainingNutrients.carbs<0 || remainingNutrients.cholesterol<0 || remainingNutrients.fats<0 || remainingNutrients.protein<0 || remainingNutrients.sodium<0) {
      mealOverbudget = true
    }
    console.log(mealOverbudget)
    console.log(meals)
    weekMeals.push({
      dayName: dayNames[day.getDay()],
      isoDate: day.toISOString(),
      formattedDate: formatDate(day),
      breakfastList: meals.value["Breakfast"], // Insert real or dummy data here
      lunchList: meals.value["Lunch"], // Insert real or dummy data here
      dinnerList: meals.value["Dinner"], // Insert real or dummy data here
      otherList: meals.value["Other"], // Insert real or dummy data here
      isToday: isToday(day),
      isPast: day < today && !isToday(day),
      isFuture: day > today && !isToday(day),
      mealOverbudget: mealOverbudget
    });
  }
  return weekMeals;
}

  
function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long', // Use 'long' to get full month name
  });
}

function isToday(day) {
  const today = new Date();
  return day.toDateString() === today.toDateString();
}

onMounted(async () => {
  await useApi("/dietary","GET")

  daysOfWeek.value = await generateWeekMeals(currentDate.value)
})
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

  .bg-custom-bg{
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
  