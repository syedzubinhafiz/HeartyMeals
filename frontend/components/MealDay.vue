<template>
    <div class="meal-day meal-items-container"
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
          @removeMeal="() => removeMeal('breakfastList', index)"
          @editMeal="() => openEditMealPopup(card)"
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
          @removeMeal="() => removeMeal('lunchList', index)"
          @editMeal="() => openEditMealPopup(card)"
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
          @removeMeal="() => removeMeal('dinnerList', index)"
          @editMeal="() => openEditMealPopup(card)"
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
          @removeMeal="() => removeMeal('otherList', index)"
          @editMeal="() => openEditMealPopup(card)"
        />
      </Mealplanlist>
  
      <!-- Edit Meal Overlay -->
      <EditMealOverlay
        v-if="editMealOverlayVisible"
        :visible="editMealOverlayVisible"
        :mealInfo="editMealInfo"
        @update:visible="editMealOverlayVisible = $event"
        @editLogMeal="handleEditMeal"
      />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toast-notification';
import Mealplanlist from './Mealplanlist.vue';
import Planningfoodcard from './Planningfoodcard.vue';
import Planningdailynutrients from './Planningdailynutrients.vue';
import EditMealOverlay from './Overlay/EditMealOverlay.vue';

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

const nutritionInfo = ref({
  totalCarbohydrate: 0,
  protein: 0,
  fat: 0,
  cholesterol: 0,
  dietaryFiber: 0,
});

// Edit meal overlay controls
const editMealOverlayVisible = ref(false);
const editMealInfo = ref(null);

const removeMeal = (mealType, index) => {
  const list = props[mealType];
  if (Array.isArray(list) && list[index] !== undefined) {
    list.splice(index, 1);
    computeNutritionInfo();
  }
};

const openEditMealPopup = (meal) => {
  editMealInfo.value = meal;
  editMealOverlayVisible.value = true;
};

// Handle edited meal details coming back from overlay
const handleEditMeal = async (newValue) => {
  // Fall back to original values if unchanged
  const newPortion = newValue.portion ?? newValue.mealInfo.portion;
  const newMealType = newValue.mealType ?? newValue.mealInfo.type;

  // Short-circuit if nothing changed
  if (newPortion === newValue.mealInfo.portion && newMealType === newValue.mealInfo.type) {
    useToast().info('No changes made');
    editMealOverlayVisible.value = false;
    return;
  }

  // Submit update to backend
  const resp = await useApi('/meal-logging/update', 'POST', {
    mealLoggingId: newValue.mealInfo.id,
    mealType: newMealType,
    portion: newPortion,
    timeZone: 'Asia/Kuala_Lumpur',
    userLocalDate: useDate().getFormattedDateShort(),
    mealDate: useDate().getFormattedDateShort(new Date(newValue.mealInfo.created_at)),
  });
  
  console.log('Edit meal API response:', resp);

  if (!resp.isError && resp.status === 200) {
    useToast().success('Meal updated');

    // Update local arrays so UI refreshes immediately
    const sourceListName = newValue.mealInfo.type.toLowerCase() + 'List';
    const targetListName = newMealType.toLowerCase() + 'List';

    const sourceList = props[sourceListName];
    const targetList = props[targetListName];

    // Remove from old list
    const idx = sourceList.findIndex((m) => m.id === newValue.mealInfo.id);
    if (idx !== -1) {
      const [item] = sourceList.splice(idx, 1);
      // Update item values
      item.portion = newPortion;
      item.type = newMealType;
      // Push to target list
      targetList.push(item);
    }

    computeNutritionInfo();
  } else {
    useToast().error('Failed to update meal');
  }

  editMealOverlayVisible.value = false;
};

// Helper to safely get nutrient value
const getNutrientVal = (obj, keys, defaultVal = 0) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) {
      return Number(obj[k]);
    }
  }
  return defaultVal;
};

// Calculate nutrition totals from all meal lists
const computeNutritionInfo = () => {
  const allMeals = [
    ...props.breakfastList,
    ...props.lunchList,
    ...props.dinnerList,
    ...props.otherList,
  ];

  const totals = {
    totalCarbohydrate: 0,
    protein: 0,
    fat: 0,
    cholesterol: 0,
    dietaryFiber: 0,
  };

  allMeals.forEach((meal) => {
    const info = meal?.recipe?.nutrition_info || {};
    totals.totalCarbohydrate += getNutrientVal(info, ['totalCarbohydrate', 'carbs']);
    totals.protein += getNutrientVal(info, ['protein']);
    totals.fat += getNutrientVal(info, ['fat', 'fats']);
    totals.cholesterol += getNutrientVal(info, ['cholesterol']);
    totals.dietaryFiber += getNutrientVal(info, ['dietaryFiber', 'sodium']);
  });

  nutritionInfo.value = totals;
};

// Recompute when component mounts
onMounted(() => {
  computeNutritionInfo();
});

// Watch for changes in meal lists to update totals reactively
watch(
  () => [props.breakfastList, props.lunchList, props.dinnerList, props.otherList],
  () => {
    computeNutritionInfo();
  },
  { deep: true }
);
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
  top: 100%; 
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

.meal-day {
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-clip: padding-box;
}

.meal-list {
  margin-bottom: 16px;
}

.today-day {
  background-color: rgba(1, 91, 89, 0.15);
  border-color: rgba(1, 91, 89, 0.4);
  box-shadow: 0 4px 12px rgba(1, 91, 89, 0.2);
}

.past-day {
  background-color: rgba(176, 172, 165, 0.1);
  border-color: rgba(176, 172, 165, 0.3);
}

.future-day {
  background-color: rgba(243, 234, 218, 0.3);
  border-color: rgba(139, 107, 85, 0.2);
}

.day-header {
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(to bottom, #F3EADA 50%, #8A6B55 50%);
  border-radius: 12px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(139, 107, 85, 0.2);
}

.today-header {
  background: linear-gradient(to bottom, #F3EADA 50%, #015B59 50%); 
}

.past-header {
  background: linear-gradient(to bottom, #B0ACA5 50%, #111111 50%); 
}

.future-header {
  background: linear-gradient(to bottom, #F3EADA 50%, #8A6B55 50%); 
}

.day-name {
  padding-top: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2d3748;
}

.day-date {
  font-size: 1rem;
  margin-top: 4px;
  padding-bottom: 12px;
  color: #fff;
  font-weight: 500;
}

/* MAIN ADDITION FOR SCROLLABLE LIST */
/* Scrollable Meal Items Container */
.meal-items-container {
  max-height: 50vh; /* Set maximum height for the dropdown */
  overflow-y: auto;  /* Enable vertical scrolling */
}

/* OPTIONAL: Custom scrollbar styling */
.meal-items-container::-webkit-scrollbar {
  width: 8px;
}

.meal-items-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.meal-items-container::-webkit-scrollbar-track {
  background-color: #e0e0e0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .meal-day {
    padding: 8px;
    border-radius: 12px;
  }

  .day-header {
    margin-bottom: 0.7rem;
    border-radius: 10px;
  }

  .day-name {
    font-size: 1rem;
    padding-top: 10px;
  }

  .day-date {
    font-size: 1rem;
    padding-bottom: 6px;
  }

  .meal-list {
    margin-bottom: 8px;
  }

  .meal-items-container {
    max-height: 35vh;
  }
}

</style>
