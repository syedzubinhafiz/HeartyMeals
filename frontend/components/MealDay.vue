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
      <div class="day-name">{{ dayName }}</div>
      <div class="day-date">{{ formattedDate }}</div>
    </div>

    <!-- Meal card lists (Breakfast, Lunch, Dinner, and Other) -->
    <Mealplanlist 
        class="meal-list" 
        title="Breakfast" 
        :itemsCount="breakfastList.length"
        :isPast="isPast"  
        route="/add-meal">
      <FoodCard
        v-for="(card, index) in breakfastList"
        :key="index"
        :cardInfo="card"
        :isToday="isToday"
        @removeMeal="removeMeal('breakfastList', index)"
        @editMeal="openEditMealPopup(card)"
      />
    </Mealplanlist>

    <Mealplanlist 
        class="meal-list" 
        title="Lunch" 
        :itemsCount="lunchList.length" 
        :isPast="isPast" 
        route="/add-meal">
      <FoodCard
        v-for="(card, index) in lunchList"
        :key="index"
        :cardInfo="card"
        :isToday="isToday"
        @removeMeal="removeMeal('lunchList', index)"
        @editMeal="openEditMealPopup(card)"
      />
    </Mealplanlist>

    <Mealplanlist 
        class="meal-list" 
        title="Dinner" 
        :itemsCount="dinnerList.length" 
        :isPast="isPast" 
        route="/add-meal">
      <FoodCard
        v-for="(card, index) in dinnerList"
        :key="index"
        :cardInfo="card"
        :isToday="isToday"
        @removeMeal="removeMeal('dinnerList', index)"
        @editMeal="openEditMealPopup(card)"
      />
    </Mealplanlist>

    <Mealplanlist 
        class="meal-list" 
        title="Other" 
        :itemsCount="otherList.length" 
        :isPast="isPast" 
        route="/add-meal">
      <FoodCard
        v-for="(card, index) in otherList"
        :key="index"
        :cardInfo="card"
        :isToday="isToday"
        @removeMeal="removeMeal('otherList', index)"
        @editMeal="openEditMealPopup(card)"
      />
    </Mealplanlist>
  </div>
</template>
  
  
<script setup>
  import { ref, computed } from 'vue';
  import Mealplanlist from './Mealplanlist.vue';
  import FoodCard from './FoodCard.vue';
  
  const props = defineProps({
    dayName: {
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

  console.log(props.isPast)
  
  const removeMeal = (mealType, index) => {
    console.log(`Removing meal from ${mealType} at index ${index}`);
  };
  
  const openEditMealPopup = (meal) => {
    console.log('Edit meal', meal);
  };
</script>

<style scoped>
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
  
  