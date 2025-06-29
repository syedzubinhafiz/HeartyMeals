<template>
  <div class="page-container">
    <header class="header">
      <Header></Header>
    </header>
    
    <!-- Background images - hidden on mobile -->
    <div class="left-base hidden lg:block">
        <img :src="leftBase" class="w-full h-auto">
    </div>    
    <div class="right-base hidden lg:block">
        <img :src="rightBase" class="w-full h-auto">
    </div>

    <div class="body px-4 lg:px-8 pt-6 lg:pt-0">
      <div class="date-nav-container flex items-center justify-center py-6 lg:py-8">
        <button 
          class="date-nav-label bg-custom-bg-green text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center min-w-touch min-h-touch" 
          @click="goToPreviousDay"
          aria-label="Previous day"
        >
          &lt;
        </button>
        <div class="current-date-label text-lg lg:text-xl font-semibold px-6 lg:px-8 text-center">
          {{
            currentDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          }}
        </div>
        <button 
          class="date-nav-label bg-custom-bg-green text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center min-w-touch min-h-touch" 
          @click="goToNextDay"
          aria-label="Next day"
        >
          &gt;
        </button>
      </div>

      <!-- Main content area with responsive layout -->
      <div class="main-content grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <!-- Meals section -->
        <div class="meal-type-list-container space-y-4 lg:space-y-6">
          <div class="meal-type-container bg-custom-overlay-brown rounded-lg shadow-md overflow-hidden">
          <div class="meal-type-header" @click="toggleDropdown('breakfast')">
            <label>Breakfast</label>
            <span> {{loggedBreakfast.length }} items</span>
            <img :class="{ rotated: breakfastDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="breakfastDropdown" class="meal-logged-items">
            <div class="meal-card-container grid grid-cols-1 lg:grid-cols-2 gap-3 w-full p-3 overflow-y-auto">
              <div v-for="dish in loggedBreakfast" :key="dish.id" class="meal-card" :class="{ 'consumed': dish.is_consumed, 'planned': !dish.is_consumed }">                
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image" :class="{ 'consumed-image': dish.is_consumed }">
                <div class="meal-info">
                  <span class="meal-name" :class="dish.is_consumed ? 'text-gray-600' : 'text-gray-800'">{{ dish.recipe.name }}</span>
                  <p class="meal-status" :class="dish.is_consumed ? 'text-green-600' : 'text-orange-600'">
                    {{ dish.is_consumed ? 'Consumed' : 'Planned' }}
                  </p>
                </div>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click.stop="openPopover(dish)">
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Breakfast')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>
          </div>
        </div>

        <div class="meal-type-container bg-custom-overlay-brown rounded-lg shadow-md overflow-hidden">
          <div class="meal-type-header" @click="toggleDropdown('lunch')">
            <label>Lunch</label>
            <span> {{loggedLunch.length }} items</span>
            <img :class="{ rotated: lunchDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="lunchDropdown" class="meal-logged-items">
            <div class="meal-card-container grid grid-cols-1 lg:grid-cols-2 gap-3 w-full p-3 overflow-y-auto">
              <div v-for="dish in loggedLunch" :key="dish.id" class="meal-card" :class="{ 'consumed': dish.is_consumed, 'planned': !dish.is_consumed }">                
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image" :class="{ 'consumed-image': dish.is_consumed }">
                <div class="meal-info">
                  <span class="meal-name" :class="dish.is_consumed ? 'text-gray-600' : 'text-gray-800'">{{ dish.recipe.name }}</span>
                  <p class="meal-status" :class="dish.is_consumed ? 'text-green-600' : 'text-orange-600'">
                    {{ dish.is_consumed ? 'Consumed' : 'Planned' }}
                  </p>
                </div>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click.stop="openPopover(dish)">
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Lunch')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>
          </div>
        </div>

        <div class="meal-type-container bg-custom-overlay-brown rounded-lg shadow-md overflow-hidden">
          <div class="meal-type-header" @click="toggleDropdown('dinner')">
            <label>Dinner</label>
            <span> {{loggedDinner.length }} items</span>
            <img :class="{ rotated: dinnerDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="dinnerDropdown" class="meal-logged-items">
            <div class="meal-card-container grid grid-cols-1 lg:grid-cols-2 gap-3 w-full p-3 overflow-y-auto">
              <div v-for="dish in loggedDinner" :key="dish.id" class="meal-card" :class="{ 'consumed': dish.is_consumed, 'planned': !dish.is_consumed }">                
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image" :class="{ 'consumed-image': dish.is_consumed }">
                <div class="meal-info">
                  <span class="meal-name" :class="dish.is_consumed ? 'text-gray-600' : 'text-gray-800'">{{ dish.recipe.name }}</span>
                  <p class="meal-status" :class="dish.is_consumed ? 'text-green-600' : 'text-orange-600'">
                    {{ dish.is_consumed ? 'Consumed' : 'Planned' }}
                  </p>
                </div>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click.stop="openPopover(dish)">
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Dinner')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button> 
          </div>
        </div>

        <div class="meal-type-container bg-custom-overlay-brown rounded-lg shadow-md overflow-hidden">
          <div class="meal-type-header" @click="toggleDropdown('other')">
            <label>Other</label>
            <span> {{loggedOther  .length }} items</span>
            <img :class="{ rotated: otherDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="otherDropdown" class="meal-logged-items">
            <div class="meal-card-container grid grid-cols-1 lg:grid-cols-2 gap-3 w-full p-3 overflow-y-auto">
              <div v-for="dish in loggedOther" :key="dish.id" class="meal-card" :class="{ 'consumed': dish.is_consumed, 'planned': !dish.is_consumed }">                
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image" :class="{ 'consumed-image': dish.is_consumed }">
                <div class="meal-info">
                  <span class="meal-name" :class="dish.is_consumed ? 'text-gray-600' : 'text-gray-800'">{{ dish.recipe.name }}</span>
                  <p class="meal-status" :class="dish.is_consumed ? 'text-green-600' : 'text-orange-600'">
                    {{ dish.is_consumed ? 'Consumed' : 'Planned' }}
                  </p>
                </div>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click.stop="openPopover(dish)">
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]"  @click="addDish('Other')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>      
          </div>
        </div>
        </div>

        <!-- Nutrition budget section -->
        <div class="nutrition-budget-container">
          <NutritionWidgetCurve :nutrients="nutrients"/>
        </div>
      </div>

    </div>
   
    <RemoveMealOverlay
      :visible="removeMealOverlayVisible"
      :mealInfo="removeMealInfo || {}"
      @close="removeMealOverlayVisible = $event"
      @removeLogMeal="removeLogMeal"
    />

    <EditMealOverlay
      :visible="editMealOverlayVisible"
      :mealInfo="editMealInfo || {}"
      @update:visible="editMealOverlayVisible = $event"
      @editLogMeal="editLogMeal"
    />

    <MealPopover
      :visible="popoverVisible"
      :mealInfo="selectedMeal || {}"
      :mealLogTime="currentDate"
      @update:visible="popoverVisible = $event"
      @consume="consumeMeal"
      @edit="openEditMealOverlay"
      @remove="openRemoveMealOverlay"
    />

    <footer class="footer">
      <Footer></Footer>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNuxtApp, useRuntimeConfig } from '#app';
import leftBase from '@/assets/img/meal_logging/summary_left_base.svg';
import rightBase from '@/assets/img/meal_logging/summary_right_base.svg';
import { isSameDay } from 'date-fns';
import RemoveMealOverlay from '~/components/Overlay/RemoveMealOverlay.vue';
import EditMealOverlay from '~/components/Overlay/EditMealOverlay.vue';
import NutritionWidgetCurve from '~/components/Nutrient/NutritionWidgetCurve.vue';
import MealPopover from '~/components/MealPopover.vue';
import { useUserBudget } from '~/composables/userBudget.js';

definePageMeta({
  layout: "emptylayout",
  middleware: "auth", // Re-enabled after fixing wheel event handler
  components: {
    RemoveMealOverlay
  },
});

const { $axios } = useNuxtApp();
const currentDate = ref(new Date());

const loggedBreakfast = ref([]);
const breakfastDropdown = ref(false);

const loggedLunch = ref([]);
const lunchDropdown = ref(false);

const loggedDinner = ref([]);
const dinnerDropdown = ref(false);

const loggedOther = ref([]);
const otherDropdown = ref(false);



const removeMealOverlayVisible = ref(false);
const removeMealInfo= ref(null);


const editMealOverlayVisible = ref(false);
const editMealInfo = ref(null);
const popoverVisible = ref(false);
const selectedMeal = ref(null);

const { nutrients, refresh: getUserBudget } = useUserBudget();

function toggleDropdown(mealType) {
  // Close the popover if it's open
  popoverVisible.value = false;
  selectedMeal.value = null;
  
  if (mealType === 'breakfast') {
    breakfastDropdown.value = !breakfastDropdown.value;
  } else if (mealType === 'lunch') {
    lunchDropdown.value = !lunchDropdown.value;
  } else if (mealType === 'dinner') {
    dinnerDropdown.value = !dinnerDropdown.value;
  } else if (mealType === 'other') {
    otherDropdown.value = !otherDropdown.value;
  }
}

async function goToPreviousDay() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() - 1);
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (
    currentDate.value.getDate() === oneWeekAgo.getDate() &&
    currentDate.value.getMonth() === oneWeekAgo.getMonth() &&
    currentDate.value.getFullYear() === oneWeekAgo.getFullYear()
  ) {
    useToast().error('Cannot log meal for dates older than 7 days');
  } else {
    currentDate.value = newDate;
    await getMeals();
    await getUserBudget(currentDate.value);
  }
}

async function goToNextDay() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + 1);
  const today = new Date();

  if (
    currentDate.value.getDate() === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
  ) {
    useToast().error('Cannot log meal for future dates');
  } else {
    currentDate.value = newDate;
    await getMeals();
    await getUserBudget(currentDate.value);
  }
}

function isToday() {
  const today = new Date();
  return isSameDay(currentDate.value, today);
}

async function addDish(mealType) {
  console.log('=== Add Dish button clicked ===');
  localStorage.setItem("mealInfo", JSON.stringify({
    logType: "logging",
    logDate: formatDate(currentDate.value),
    mealType: mealType,
    expiryTime: new Date().getTime().toLocaleString() + (5*60*1000),
  }));
  
  try {
    // TEMP FIX: Since navigateTo is not completing route transitions,
    // use window.location.href as immediate workaround
    console.log('Using window.location.href (temp fix for navigation bug)');
    window.location.href = '/add-meals';
  } catch (error) {
    console.error('Navigation completely failed:', error);
    // Additional fallback for any rare edge cases
    await navigateTo('/add-meals').catch(() => {
      console.error('Even navigateTo fallback failed');
    });
  }
};

async function getMeals() {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.get('/meal-logging/get', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        startDate: formatDate(currentDate.value),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    //TODO: set budget here
    
    console.log('API Response:', response.data);
    console.log('Looking for date:', formatDate(currentDate.value));
    
    const dateData = response.data[formatDate(currentDate.value)];
    if (!dateData) {
      console.log('No data found for date:', formatDate(currentDate.value));
      console.log('Available dates:', Object.keys(response.data));
      // Initialize empty meals if no data for this date
      loggedBreakfast.value = [];
      loggedLunch.value = [];
      loggedDinner.value = [];
      loggedOther.value = [];
      overlayVisibility.value = {};
      return;
    }
    
    const meals = dateData.meals;
    if (!meals) {
      console.log('No meals found in date data');
      loggedBreakfast.value = [];
      loggedLunch.value = [];
      loggedDinner.value = [];
      loggedOther.value = [];
      overlayVisibility.value = {};
      return;
    }

    loggedBreakfast.value =  meals.Breakfast || [];
    loggedLunch.value =  meals.Lunch || [];
    loggedDinner.value =  meals.Dinner || [];
    loggedOther.value =  meals.Other || [];

    // Reset the popover
    popoverVisible.value = false;
    selectedMeal.value = null;
  } catch (error) {
    console.log(error);
  }
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

async function consumeMeal(id){
  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/meal-logging/mark_consume', {
      mealLoggingId: id,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateTime: currentDate.value,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Refresh both meal data and budget data to reflect consumed status
    await getMeals();
    await getUserBudget(currentDate.value);
  } catch (error) {
    console.log(error);
  }
}


function openRemoveMealOverlay(mealInfo){
  console.log("hi");
  removeMealInfo.value = mealInfo;
  removeMealOverlayVisible.value = true;
}

const today_date_time = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            return formattedDate;
};

async function removeLogMeal(mealInfo){
  const token =  localStorage.getItem('accessToken');
  try{
    const response = await $axios.delete('/meal-logging/delete',{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
      mealDate: formatDate(currentDate.value),
      userLocalDate: formatDate(currentDate.value),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mealLoggingId: mealInfo.id,
      mealType: mealInfo.type
    }
    });

    if (response.data.status === 200){
      useToast().success('Meal removed successfully');
      await getMeals();
      await getUserBudget(currentDate.value);
    } else {
      useToast().error(response.data.message);
    }

  } catch(e) {
    console.log(e);
    useToast().error('Failed to remove meal');

  }

  removeMealOverlayVisible.value = false;
}

function openEditMealOverlay(mealInfo){
  editMealInfo.value = mealInfo;
  console.log(mealInfo);
  editMealOverlayVisible.value = true;
}


async function editLogMeal(newValue){

  let change_flag =  false;

  if(newValue.mealType !== newValue.mealInfo.type){
    change_flag = true;
  }

  if(newValue.portion !== newValue.mealInfo.portion){
    change_flag = true;
  }


  if (change_flag){

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response =  await $axios.post('meal-logging/update', {
        mealLoggingId: newValue.mealInfo.id,
        mealType: newValue.mealType,
        portion: newValue.portion,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userLocalDate : formatDate(currentDate.value),
        mealDate: newValue.mealInfo.consumed_date_time.split('T')[0],
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if(response.data.status === 200){
        useToast().success('Meal updated successfully');
        await getMeals();
        await getUserBudget(currentDate.value);

      } else {
        useToast().error(response.data.message);
      }
      editMealOverlayVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  } else {
    useToast().success('No changes made');
    editMealOverlayVisible.value = false;
  }
}

function openPopover(dish) {
  selectedMeal.value = dish;
  popoverVisible.value = true;
}

onMounted(async () => {
  await getMeals();
  await getUserBudget(currentDate.value);
  
  // Add visibility change listener to refresh data when page becomes visible
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Add focus listener to refresh data when window gains focus
  window.addEventListener('focus', handleWindowFocus);
  
  // Listen for nutrition refresh events from other pages
  window.addEventListener('storage', handleStorageChange);
});

onBeforeUnmount(() => {
  // Clean up event listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('focus', handleWindowFocus);
  window.removeEventListener('storage', handleStorageChange);
});

const handleVisibilityChange = async () => {
  if (!document.hidden) {
    // Page became visible, refresh meal data
    console.log('Page became visible, refreshing meal data...');
    await getMeals();
    await getUserBudget(currentDate.value);
  }
};

const handleWindowFocus = async () => {
  // Window gained focus, refresh meal data
  console.log('Window gained focus, refreshing meal data...');
  await getMeals();
  await getUserBudget(currentDate.value);
};

// Storage event listener for cross-page nutrition refresh
const handleStorageChange = async (event) => {
  if (event.key === 'nutritionRefresh' && event.newValue) {
    try {
      const refreshEvent = JSON.parse(event.newValue);
      if (refreshEvent.type === 'nutritionRefresh') {
        console.log('Nutrition refresh triggered from another page:', refreshEvent.mealId);
        await getMeals();
        await getUserBudget(currentDate.value);
      }
    } catch (error) {
      console.error('Error parsing nutrition refresh event:', error);
    }
  }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');

*{
    font-family: 'Overpass', sans-serif;
}
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
}

.header {
  position: sticky; /* Use sticky instead of fixed for better mobile compatibility */
  top: 0;
  width: 100%;
  z-index: 40;
}

.footer {
  width: 100%;
}

/* Mobile-first responsive layout */
.body {
  width: 100%;
  max-width: 100%;
  position: relative; /* Ensure body is a stacking context */
  z-index: 2; /* Place above background blobs */
  flex-grow: 1; /* Allow body to grow and push footer down */
  padding-bottom: 2rem; /* Add space above the footer */
}

.left-base, .right-base {
  display: block; /* Restore background images */
  position: absolute;
  z-index: 1;
}

.left-base {
  top: 20%;
  left: 0;
}

.right-base {
  top: 9%;
  right: 0;
}

/* Meal type containers */
.meal-type-container {
  background-color: #F3EADA;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.meal-type-header {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem; /* Ensure adequate height on mobile */
}

.meal-type-header label {
  font-size: 1.25rem;
  font-weight: bold;
  color: #000;
  flex: 1;
  margin: 0;
}

.meal-type-header span {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin: 0 0.75rem 0 0.5rem;
  flex-shrink: 0;
}

.meal-type-header img {
  height: 1.5rem;
  width: 1.5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.rotated {
  transform: rotate(90deg);
}

.meal-logged-items {
  padding: 0 1rem 1rem 1rem;
}

.meal-card {
  background-color: rgba(218, 194, 168, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  min-height: 5rem;
}

/* Enhanced styling for consumed meals */
.meal-card.consumed {
  background-color: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
}

/* Enhanced styling for planned meals */
.meal-card.planned {
  background-color: rgba(251, 146, 60, 0.1);
  border: 2px solid rgba(251, 146, 60, 0.3);
}

.recipe-image {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.consumed-image {
  opacity: 0.7;
  filter: grayscale(20%);
}

.more-image {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  flex-shrink: 0;
}

.meal-info {
  flex: 1;
  padding: 0 0.75rem;
  min-width: 0; /* Allows text truncation */
}

.meal-name {
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  margin: 0;
  text-align: left;
  white-space: normal; /* Allow text to wrap */
  word-break: break-word; /* Break long words to prevent overflow */
}

.meal-status {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0.25rem 0 0 0;
  letter-spacing: 0.2px;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 12rem;
  margin: 0.75rem auto 0 auto;
  padding: 0.75rem 1rem;
  min-height: 2.75rem;
}

.add-button.disabled {
  background-color: #d3d3d3;
  cursor: not-allowed;
  pointer-events: none;
}

/* Hide background images on mobile */
@media (max-width: 1024px) {
  .left-base, .right-base {
    display: none !important;
  }
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .meal-type-header {
    padding: 1.25rem 1rem;
    min-height: 4.5rem;
  }
  
  .meal-type-header label {
    font-size: 1.375rem;
    font-weight: 700;
  }
  
  .meal-type-header span {
    font-size: 1rem;
    font-weight: 600;
  }
  
  /* Fix overflow when meals are expanded */
  .meal-card-container {
    max-height: 15rem; /* Limit height to prevent overflow */
  }
  
  /* Ensure main content doesn't overflow */
  .main-content {
    overflow-x: hidden;
  }
  
  .body {
    padding-bottom: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }
}

/* Nutrition widget container */
.nutrition-budget-container {
  width: 100%;
  overflow: hidden;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}

/* Mobile-specific nutrition widget styles */
@media (max-width: 768px) {
  .body {
    padding-bottom: 0;
  }

  .nutrition-budget-container {
    width: 100%;
    margin: 0 auto; /* Centered with auto margin */
    padding: 0 1rem; /* Add horizontal padding */
    max-width: 500px; /* Max-width for larger mobile */
  }
  
  /* Give the nutrition widget more breathing room on mobile */
  .main-content {
    margin-bottom: 2rem; /* Add some space above the footer */
    row-gap: 1.5rem;
  }
}

/* Scale down widget on large desktops for better balance */
@media (min-width: 1024px) {
  .nutrition-budget-container {
    transform: scale(0.9);
    transform-origin: top center;
  }
}

/* Smaller phones */
@media (max-width: 425px) {
  .nutrition-budget-container {
    padding: 0 0.5rem; /* Reduce padding for very small phones */
  }
}

/* Very small phones */
@media (max-width: 375px) {
  .nutrition-budget-container {
    padding: 0; /* No padding on the smallest screens */
  }
}
</style>

<style>
  html, body {
    background-color: #DAC2A8;
  }
</style>