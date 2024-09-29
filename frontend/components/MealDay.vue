<template>
    <div class="meal-day"
          :class="{
            'today-day': isToday,
            'past-day': isPast,
            'future-day': isFuture
          }">
      <!-- Day of the week and date display -->
      <div
        class="day-header"
        :class="{
          'today-header': isToday,
          'past-header': isPast,
          'future-header': isFuture
        }"
      >
        <div v-if="mealOverbudget" class="absolute w-6 h-6 bg-red-600 rounded-full text-white flex items-center justify-center -translate-x-3 -translate-y-3">!</div>
        <div class="date-wrapper" @mouseover="showPopup = true" @mouseleave="showPopup = false">
        <div class="day-name">{{ dayName }}</div>
        <div class="day-date">{{ formattedDate }}</div>
        
        <!-- Planningdailynutrients pop-up, visible when hovering -->
        <Planningdailynutrients 
          v-if="showPopup" 
          class="popup" 
          :visible="showPopup" 
          :nutritionInfo="nutritionInfo" 
          :showButtons="false" 
        />
      </div>
      </div>
  
      <!-- Meal card lists (Breakfast, Lunch, Dinner, and Other) -->
      <Mealplanlist 
          class="meal-list" 
          title="Breakfast" 
          :itemsCount="breakfastList.length"
          :isPast="isPast"  
          :isoDate="isoDate"
          route="/add-meal">
        <Planningfoodcard
          v-for="(card, index) in breakfastList"
          :key="index"
          :cardInfo="card"
          :isToday="isToday"
          class="meal-card"
          @removeMeal="removeMeal('breakfastList', index)"
          @editMeal="openEditMealPopup(card)"
        />
      </Mealplanlist>
  
      <Mealplanlist 
          class="meal-list" 
          title="Lunch" 
          :itemsCount="lunchList.length" 
          :isPast="isPast" 
          :isoDate="isoDate"
          route="/add-meal">
        <Planningfoodcard
          v-for="(card, index) in lunchList"
          :key="index"
          :cardInfo="card"
          :isToday="isToday"
          class="meal-card"
          @removeMeal="removeMeal('lunchList', index)"
          @editMeal="openEditMealPopup(card)"
        />
      </Mealplanlist>
  
      <Mealplanlist 
          class="meal-list" 
          title="Dinner" 
          :itemsCount="dinnerList.length" 
          :isPast="isPast" 
          :isoDate="isoDate"
          route="/add-meal">
        <Planningfoodcard
          v-for="(card, index) in dinnerList"
          :key="index"
          :cardInfo="card"
          :isToday="isToday"
          class="meal-card"
          @removeMeal="removeMeal('dinnerList', index)"
          @editMeal="openEditMealPopup(card)"
        />
      </Mealplanlist>
  
      <Mealplanlist 
          class="meal-list" 
          title="Other" 
          :itemsCount="otherList.length" 
          :isPast="isPast" 
          :isoDate="isoDate"
          route="/add-meal">
        <Planningfoodcard
          v-for="(card, index) in otherList"
          :key="index"
          :cardInfo="card"
          :isToday="isToday"
          class="meal-card"
          @removeMeal="removeMeal('otherList', index)"
          @editMeal="openEditMealPopup(card)"
        />
      </Mealplanlist>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Mealplanlist from './Mealplanlist.vue';
import Planningfoodcard from './Planningfoodcard.vue';
import Planningdailynutrients from './Planningdailynutrients.vue';
import NutrientData from '../../classes/nutrientData.js'

const props = defineProps({
  dayName: {
    type: String,
    required: true
  },
  isoDate: {
    type: String,
    required: true
  },
  formattedDate: {
    type: String,
    required: true
  },
  breakfastList: {
    type: Array,
    default: () => []
  },
  lunchList: {
    type: Array,
    default: () => []
  },
  dinnerList: {
    type: Array,
    default: () => []
  },
  otherList: {
    type: Array,
    default: () => []
  },
  isToday: Boolean,
  isPast: Boolean,
  isFuture: Boolean,
  mealOverbudget: {
    type: Boolean,
    default: false
  }
});

// Control visibility of the popup
const showPopup = ref(false);

// Create a ref for nutritionInfo that will be updated dynamically
const nutritionInfo = ref({
  totalCarbohydrate: 0,
  protein: 0,
  fat: 0,
  cholesterol: 0,
  dietaryFiber: 0
});

const nutrientData = ref(null);

const removeMeal = (mealType, index) => {
  console.log(`Removing meal from ${mealType} at index ${index}`);
};

const openEditMealPopup = (meal) => {
  console.log('Edit meal', meal);
};

const fetchDataForCurrentDate = async () => {
  const formattedDateStr = `${props.formattedDate} ${new Date().getFullYear()}`;
  let formattedCurrentDate = new Date(formattedDateStr);
  let formattedISODate = formattedCurrentDate.toISOString();

  let result = await useApi(`/user/budget?date=${formattedISODate}`, "GET");

  nutrientData.value = NutrientData.fromApi2(result.value[1]);

  // Update the nutritionInfo with the fetched data
  nutritionInfo.value = {
    totalCarbohydrate: nutrientData.value.carbohydrtates,
    protein: nutrientData.value.protein,
    fat: nutrientData.value.fats,
    cholesterol: nutrientData.value.cholesterol,
    dietaryFiber: nutrientData.value.sodium
  };

  console.log(nutritionInfo.value);
};

onMounted(async () => {
  await useApi("/dietary", "GET");
  let recipes = await useFillData().fillRecipes();
  let mealLoggingRecipes = await useFillData().fillMealLogging();
  await fetchDataForCurrentDate();
});
</script>

<style scoped>
.date-wrapper {
  position: relative;
  display: inline-block;
}

.date-wrapper:hover .popup {
  display: block;
}

.popup {
  position: absolute;
  top: 100%; /* Align the popup below the date */
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 150px;
}

/* General styling for each type of day */
.meal-day {
  padding: 5px;
  border-radius: 10px;
}

/* Adjust margin between the meal plan lists */
.meal-list {
  margin-bottom: 5px; /* Reduce margin between meal lists */
}

/* Specific styles for different types of days */
.today-day {
  background-color: rgba(1, 91, 89, 0.3); /* Greenish for today */
}

.past-day {
  background-color: None; /* Grayish for past days */
}

.future-day {
  background-color: None; /* Light red for future days */
}

/* Styling for each type of day header */
.day-header {
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(to bottom, #F3EADA 50%, #8A6B55 50%);
  border-radius: 10px;
  position: relative; /* Ensure the popup is positioned relative to the day header */
}

.today-header {
  background: linear-gradient(to bottom, #F3EADA 50%, #015B59 50%); /* Green for today */
}

.past-header {
  background: linear-gradient(to bottom, #B0ACA5 50%, #111111 50%); /* Light brown for past days */
}

.future-header {
  background: linear-gradient(to bottom, #F3EADA 50%, #8A6B55 50%); /* Orange for future days */
}

.day-name {
  padding-top: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

.day-date {
  font-size: 1.2rem;
  margin-top: 5px;
  padding-bottom: 5px;
  color: #fff;
}
</style>
