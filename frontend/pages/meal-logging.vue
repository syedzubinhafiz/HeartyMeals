<template>
  <div class="page-container">
    <header class="header">
      <Header></Header>
    </header>
    
    <div class="left-base">
        <img :src="leftBase">
    </div>    
    <div class="right-base">
        <img :src="rightBase">
    </div>

    <div class="body">
      <div class="date-nav-container">
        <label class="date-nav-label" @click="goToPreviousDay">
          <
        </label>
        <label class="current-date-label">
          {{
            currentDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          }}
        </label>
        <label class="date-nav-label" @click="goToNextDay">
          >
        </label>
      </div>

      <div class="meal-type-list-container">
        <div class="meal-type-container">
          <div class="meal-type-header" @click="toggleDropdown('breakfast')">
            <label>Breakfast</label>
            <span> {{loggedBreakfast.length }} items</span>
            <img :class="{ rotated: breakfastDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="breakfastDropdown" class="meal-logged-items">
            <div class="meal-card-container">
              <div v-for="dish in loggedBreakfast" :key="dish.id" class="meal-card">
                <div v-if="!dish.is_consumed" class="not-consumed-container">Not Consumed</div>
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image">
                <span>{{ dish.recipe.name }}</span>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click="toggleOverlayVisibility(dish.id)">
                <MealLoggingMoreOverlay
                  style="position:absolute; right:0; top:65%"
                  :dishInfo="dish"
                  :mealLogTime="currentDate"                  
                  @consume="consumeMeal"
                  @edit="openEditMealOverlay"
                  :visible="overlayVisibility[dish.id] || false"
                />
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Breakfast')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>
          </div>
        </div>

        <div class="meal-type-container">
          <div class="meal-type-header" @click="toggleDropdown('lunch')">
            <label>Lunch</label>
            <span> {{loggedLunch.length }} items</span>
            <img :class="{ rotated: lunchDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="lunchDropdown" class="meal-logged-items">
            <div class="meal-card-container">
              <div v-for="dish in loggedLunch" :key="dish.id" class="meal-card">
                <div v-if="!dish.is_consumed" class="not-consumed-container">Not Consumed</div>
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image">
                <span>{{ dish.recipe.name }}</span>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click="toggleOverlayVisibility(dish.id)">
                <MealLoggingMoreOverlay
                  style="position:absolute; right:0; top:65%"
                  :dishInfo="dish"
                  :mealLogTime="currentDate"                  
                  @consume="consumeMeal"
                  @edit="openEditMealOverlay"
                  @remove="openRemoveMealOverlay"
                  :visible="overlayVisibility[dish.id] || false"
                />
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Lunch')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>
          </div>
        </div>

        <div class="meal-type-container">
          <div class="meal-type-header" @click="toggleDropdown('dinner')">
            <label>Dinner</label>
            <span> {{loggedDinner.length }} items</span>
            <img :class="{ rotated: dinnerDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="dinnerDropdown" class="meal-logged-items">
            <div class="meal-card-container">
              <div v-for="dish in loggedDinner" :key="dish.id" class="meal-card">
                <div v-if="!dish.is_consumed" class="not-consumed-container">Not Consumed</div>
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image">
                <span>{{ dish.recipe.name }}</span>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click="toggleOverlayVisibility(dish.id)">
                <MealLoggingMoreOverlay
                  style="position:absolute; right:0; top:65%"
                  :dishInfo="dish"
                  :mealLogTime="currentDate"                  
                  @consume="consumeMeal"
                  @edit="openEditMealOverlay"
                  @remove="openRemoveMealOverlay"
                  :visible="overlayVisibility[dish.id] || false"
                />
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]" @click="addDish('Dinner')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button> 
          </div>
        </div>

        <div class="meal-type-container">
          <div class="meal-type-header" @click="toggleDropdown('other')">
            <label>Other</label>
            <span> {{loggedOther  .length }} items</span>
            <img :class="{ rotated: otherDropdown }" src="@/assets/icon/black-arrow-icon.svg">
          </div>
          <div v-if="otherDropdown" class="meal-logged-items">
            <div class="meal-card-container">
              <div v-for="dish in loggedOther" :key="dish.id" class="meal-card">
                <div v-if="!dish.is_consumed" class="not-consumed-container">Not Consumed</div>
                <img :src="dish.recipe.storage_links.thumbnail" :alt="dish.recipe.name" class="recipe-image">
                <span>{{ dish.recipe.name }}</span>
                <img src="@/assets/icon/more-icon.svg" alt="more" class="more-image" @click="toggleOverlayVisibility(dish.id)">
                <MealLoggingMoreOverlay
                  style="position:absolute; right:0; top:65%"
                  :dishInfo="dish"
                  :mealLogTime="currentDate"                  
                  @consume="consumeMeal"
                  @edit="openEditMealOverlay"
                  @remove="openRemoveMealOverlay"
                  :visible="overlayVisibility[dish.id] || false"
                />
              </div>
            </div>
            <Button :class="['add-button', {'disabled': !isToday()}]"  @click="addDish('Other')">
                <img src="@/assets/icon/add-icon.svg" alt="">
                Add Dish
            </Button>      
          </div>
        </div>
      </div>

      <div class="nutrition-budget">
        <NutritionWidgetCurve :nutrients="nutrients"/>
      </div>

    </div>
   
    <RemoveMealOverlay
      :visible="removeMealOverlayVisible"
      :mealInfo="removeMealInfo"
      @close="removeMealOverlayVisible = $event"
      @removeLogMeal="removeLogMeal"
    />

    <EditMealOverlay
      :visible="editMealOverlayVisible"
      :mealInfo="editMealInfo"
      @update:visible="editMealOverlayVisible = $event"
      @editLogMeal="editLogMeal"
    />

    <footer class="footer">
      <Footer></Footer>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRuntimeConfig } from '#app';
import leftBase from '@/assets/img/meal_logging/summary_left_base.svg';
import rightBase from '@/assets/img/meal_logging/summary_right_base.svg';
import { isSameDay } from 'date-fns';
import RemoveMealOverlay from '~/components/Overlay/RemoveMealOverlay.vue';
import EditMealOverlay from '~/components/Overlay/EditMealOverlay.vue';
import NutritionWidgetCurve from '~/components/Nutrient/NutritionWidgetCurve.vue';

definePageMeta({
  layout: 'emptylayout',
  middleware: ["auth"],
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

const overlayVisibility = ref({});

const removeMealOverlayVisible = ref(false);
const removeMealInfo= ref(null);


const editMealOverlayVisible = ref(false);
const editMealInfo = ref(null);

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

function toggleOverlayVisibility(dishId) {
 
  Object.keys(overlayVisibility.value).forEach((key) => {
    overlayVisibility.value[key] = false;
  });

  if (overlayVisibility.value[dishId] !== undefined) {
    overlayVisibility.value[dishId] = !overlayVisibility.value[dishId];
  } else {
    overlayVisibility.value = { ...overlayVisibility.value, [dishId]: true };
  }
}

function updateVisibility(visible, dishId) {
  if (overlayVisibility.value[dishId] !== visible) {
    overlayVisibility.value[dishId] = visible;
  }
}

function toggleDropdown(mealType) {
  Object.keys(overlayVisibility.value).forEach((key) => {
    overlayVisibility.value[key] = false;
  });
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
  }
}

function isToday() {
  const today = new Date();
  return isSameDay(currentDate.value, today);
}

function addDish(mealType) {
  localStorage.setItem("mealInfo", JSON.stringify({
    logType: "logging",
    logDate: formatDate(currentDate.value),
    mealType: mealType,
    expiryTime: new Date().getTime().toLocaleString() + (5*60*1000),
  }));
  navigateTo('/add-meals');
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
    
    const meals = response.data[formatDate(currentDate.value)].meals;
    loggedBreakfast.value =  meals.Breakfast;
    loggedLunch.value =  meals.Lunch;
    loggedDinner.value =  meals.Dinner;
    loggedOther.value =  meals.Other;

    // set all the overlay visibility to false
    const overlayVisibilityObj = {};
    meals.Breakfast.forEach((meal) => {
      overlayVisibilityObj[String(meal.id)] = false;
    });
    meals.Lunch.forEach((meal) => {
      overlayVisibilityObj[String(meal.id)] = false;
    });
    meals.Dinner.forEach((meal) => {
      overlayVisibilityObj[String(meal.id)] = false;
    });
    meals.Other.forEach((meal) => {
      overlayVisibilityObj[String(meal.id)] = false;
    });
    overlayVisibility.value = overlayVisibilityObj;
    console.log(overlayVisibility.value);
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
    await getMeals();
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

const getUserBudget = async () => {
    try {
        const today_date = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        };
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const token = localStorage.getItem('accessToken');
        const response = await $axios.get(`/user/budget?startDate=${today_date()}&timeZone=${timeZone}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            // maxVolume.value = response.data.logging_history[0].remaining_fluid;
            // remainingVolume.value = parseFloat((response.data.logging_history[response.data.logging_history.length - 1].remaining_fluid).toFixed(2));
            const userNutrition = response.data[today_date()];
            for (let i = 0; i < 2; i++) {
                if (i === 0) {
                    nutrients.value[0].calories = userNutrition[i].calories;
                    nutrients.value[0].carbs = userNutrition[i].carbs;
                    nutrients.value[0].protein = userNutrition[i].protein;
                    nutrients.value[0].fat = userNutrition[i].fat;
                    nutrients.value[0].sodium = userNutrition[i].sodium;
                    nutrients.value[0].cholesterol = userNutrition[i].cholesterol;
                }
                else {
                    nutrients.value[2].calories = userNutrition[i].calories;
                    nutrients.value[2].carbs = userNutrition[i].carbs;
                    nutrients.value[2].protein = userNutrition[i].protein;
                    nutrients.value[2].fat = userNutrition[i].fat;
                    nutrients.value[2].sodium = userNutrition[i].sodium;
                    nutrients.value[2].cholesterol = userNutrition[i].cholesterol;
                }
            }
        }
        else {
            console.log(response);
        }
    }
    catch (e) {
        useToast().error("Failed to load fluid intake data")
    }
  }

onMounted(async () => {
  await getMeals();
  await getUserBudget();
});
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');

*{
    font-family: 'Overpass', sans-serif;
}
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 40;
}


.body {
  overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.left-base{
  position: absolute;
  top: 20%;
  left: 0;
}

.right-base{
  position: absolute;
  top: 9%;
  right: 0;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
}

.date-nav-container{
  position: absolute;
  top: 12%;
  left: 44%;
  width: 20%;

}

.current-date-label{
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  text-align: center;
  margin: 0;
  padding: 0 2.5%;
  width: 100%;
}

.date-nav-label{
  font-size: 1.5rem;
  font-weight: bolder;
  color: #015B59;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  cursor: pointer;
}

.nutrition-budget {
  position: absolute;
  top: 12.5%;
  right: 0%;
  width: 45%;
  height: 60%;
  transform: scale(0.85);
}

.meal-type-list-container{
  position: absolute;
  top: 20%;
  left: 5%;
  width: 45%;
  height: 60%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  row-gap: 5%;
}

.meal-type-container {
  min-height: 10%;
  max-height: 60%;
  background-color: #F3EADA;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.meal-type-header {
  padding-top: 2%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.meal-type-header label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  padding-left: 2.5%;
  width: 30%;
}

.meal-type-header span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #000;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  padding-left: 2.5%;
}

.meal-type-header img {
  height: 50%;
  margin-right: 2.5%;
  transition: transform 0.3s ease; /* Smooth transition for rotation */
}

.rotated {
  transform: rotate(90deg); /* Rotate 90 degrees */
}

.meal-logged-items {
  padding-bottom: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 85%;
}


.add-button{

  display: flex;
  grid-template-columns: repeat(2, max-content);
  column-gap: 2.5%;
  width: 80%;
  justify-content: center;
  align-items: center;

}

.add-button.disabled{
  background-color: #d3d3d3;
  cursor: not-allowed;
  pointer-events: none;

} 


.meal-card {
  position: relative;
  background-color: rgba(218, 194, 168, 0.5);
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 5%;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.recipe-image{
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  margin:2.5%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.more-image{
  width: 20px;
  height: 20px;
  object-fit: cover;
  margin:2.5%;
  cursor: pointer;
}

.meal-card span {
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  padding-left: 2.5%;
}

.meal-card-container{
  margin-bottom: 2%;
  margin-top: 2%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 90%;
  height: 30%;
  overflow-y: auto;
  
  }


.not-consumed-container{
  position: absolute;
  top: 0;
  background-color: red;
  padding: 2%;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
}
</style>