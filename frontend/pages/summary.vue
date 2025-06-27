<template>
  <div class="page-container">
    <header class="header">
      <Header></Header>
    </header>
    
    <div class="left-base">
        <img :src="leftBase" style="width: 85%;">
    </div>
    
    <div class="right-base">
        <img :src="rightBase">
    </div>

      <div class="back-button" @click="back">
        <img src="@/assets/icon/white-back-icon.svg" alt="">
        <span>Back</span>
      </div>

      <div class="title">
        <h1>Summary</h1>
      </div>

    <div class="body">

        <div class="done-button" @click="logMeal">
          <img src="@/assets/icon/done-icon.svg" alt="">
          Done
        </div>

        <div class="selected-meal-container">
          <div v-for="meal in selectedMeals" class="meal">
            <button class="remove-selected-meal" @click="removeSelectedMeal(meal.id)">+</button>
            <div class="image-container">
              <img :src="meal.recipe.storage_links.thumbnail">
            </div>
            
            <div class="meal-info">
              <span>{{ meal.recipe.name }}</span>

              <div class="nutrition-list-container">
                <div class="nutrient-label">
                  <label>Calories: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.calories * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> cal</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Carbs: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.totalCarbohydrate * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> cal</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Protein: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.protein * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> g</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Fats: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.fat * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> g</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Sodium: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.sodium * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> mg</label>
                  </div>
                </div>
                <div class="nutrient-label">
                  <label>Cholesterol: </label>
                  <div>
                    <span>{{parseFloat((meal.recipe.nutrition_info.cholesterol * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                    <label> mg</label>
                  </div>
                </div>
              </div>

            </div>
            
            <div class="portion-setting">
              <input 
                  class="serving-input"
                  type="number" 
                  v-model="meal.portion" 
                  @input="updateChanges(meal.id, meal.portion)" 
                  min="0.5" 
                  step="0.5"
                  placeholder="Serving"
              >
            </div>
          </div>

        </div>

        <div class="nutrition-widget">
          <span style="font-weight: 600; font-size: 150%; margin-left: -5%;">Total Nutrition</span>
          <div v-for="(nutrient, index) in nutrients" :key="index" class="tooltip-wrapper">
            <div 
              class="tooltip-container"
              @mouseenter="showTooltip(index)" 
              @mouseleave="hideTooltip"
            >
              <!-- Nutrition Bar Component -->
              <NutritionBar
                :icon="nutrient.icon"
                :label="nutrient.label"
                :totalValue="userDailyBudget[nutrient.key]"
                :currentValue="userRemainingNutrients[nutrient.key]"
                :afterMealValue="userAfterMealNutrients[nutrient.key]"
                :unit="nutrient.unit"
                :maxColor="nutrient.maxColor"
                :currentColor="nutrient.currentColor"
                :afterMealColor="nutrient.afterMealColor"
                :fontColor="nutrient.fontColor"
                :progressBarContainerStyle="'margin-top: 2.5%; margin-bottom: 2.5%;'"
              />
              
              <!-- Custom Tooltip -->
              <div v-if="activeTooltip === index" class="custom-tooltip">
                <div v-for="line in tooltips[index]" :key="line">
                  {{ line }}
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>

    </div>
    
    <footer class="footer">
      <Footer></Footer>
    </footer>

  <div v-if="isLoading" class="loading-greyed-bg">
    <div class="loader"></div>
  </div>
</template>



<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp, navigateTo } from "#app";
import { useToast } from "vue-toast-notification";
import leftBase from "@/assets/img/meal_logging/summary_left_base.svg";
import rightBase from "@/assets/img/meal_logging/summary_right_base.svg";
import NutritionBar from "~/components/Nutrient/NutritionBar.vue";

const {$axios} = useNuxtApp();

const isLoading = ref(false);
const selectedMeals = ref([]);
const mealInfo = ref({});
const userDailyBudget = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});
const userRemainingNutrients = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});
const userAfterMealNutrients = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  cholesterol: 0
});
const nutrients =  [
        {
          key: 'calories',
          icon: "/assets/img/caloriesIcon.png",
          label: 'Calories',
          unit: 'cal',
          maxColor: '#e9e5cd',
          currentColor: '#d7d1b4',
          afterMealColor: '#b8b396',
          fontColor: '#b8b396',
        },
        {
          key: 'carbs',
          icon: "/assets/img/carbIcon.png",
          label: 'Carbohydrates',
          unit: 'g',
          maxColor: '#e2f3f4',
          currentColor: '#a2d3d6',
          afterMealColor: '#83bbbe',
          fontColor: '#83bbbe',
        },
        {
          key: 'protein',
          icon: "/assets/img/proteinIcon.png",
          label: 'Protein',
          unit: 'g',
          maxColor: '#e8f0e9',
          currentColor: '#99d0a3',
          afterMealColor: '#87a98d',
          fontColor: '#87a98d',
        },
        {
          key: 'fat',
          icon: "/assets/img/fatsIcon.png",
          label: 'Fats',
          unit: 'g',
          maxColor: '#fbf1cd',
          currentColor: '#fcdea3',
          afterMealColor: '#ecc474',
          fontColor: '#ecc474',
        },
        {
          key: 'sodium',
          icon: "/assets/img/sodiumIcon.png",
          label: 'Sodium',
          unit: 'mg',
          maxColor: '#f9e1da',
          currentColor: '#f6aa97',
          afterMealColor: '#ec7455',
          fontColor: '#ec7455',
        },
        {
          key: 'cholesterol',
          icon: "/assets/img/cholesterolsIcon.png",
          label: 'Cholesterol',
          unit: 'mg',
          maxColor: '#ffe5d4',
          currentColor: '#f1c9af',
          afterMealColor: '#be9a83',
          fontColor: '#be9a83',
        }
      ];

  const tooltips = ref([]);
  const activeTooltip = ref(null);

definePageMeta({
	layout: "emptylayout",
  middleware: ["auth"],
  components: {
    NutritionBar
  }
});



onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);

  if (localStorage.getItem('selectedMeals')){
    selectedMeals.value = JSON.parse(localStorage.getItem('selectedMeals'))
    const nutrientList =  JSON.parse(localStorage.getItem('userNutrientsInfo')) 
    mealInfo.value = JSON.parse(localStorage.getItem('mealInfo'))
    userDailyBudget.value = nutrientList[0];
    userRemainingNutrients.value = nutrientList[1];
    userAfterMealNutrients.value = nutrientList[2];

    localStorage.removeItem('userNutrientsInfo')
    localStorage.removeItem('selectedMeals')
  } else {
    useToast().error('No meals selected, redirecting to meal logging page')
          setTimeout(async () => {
        await navigateTo('/meal-logging')
      }, 2000)
  }

  // set the text
  tooltips.value = [];
  tooltips.value.push([`Current calories: ${userRemainingNutrients.value.calories} cal`,`After adding meal: ${userAfterMealNutrients.value.calories} cal`]);
  tooltips.value.push([`Current protein: ${userRemainingNutrients.value.protein} g`,`After adding meal: ${userAfterMealNutrients.value.protein} g`]);
  tooltips.value.push([`Current carbs: ${userRemainingNutrients.value.carbs} g`,`After adding meal: ${userAfterMealNutrients.value.carbs} g`]);
  tooltips.value.push([`Current fat: ${userRemainingNutrients.value.fat} g`,`After adding meal: ${userAfterMealNutrients.value.fat} g`]);
  tooltips.value.push([`Current sodium: ${userRemainingNutrients.value.sodium} mg`,`After adding meal: ${userAfterMealNutrients.value.sodium} mg`]);
  tooltips.value.push([`Current cholesterol: ${userRemainingNutrients.value.cholesterol} mg`,`After adding meal: ${userAfterMealNutrients.value.cholesterol} mg`]);
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    userDailyBudget.value = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    };

    userRemainingNutrients.value = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    };

    userAfterMealNutrients.value = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    };


});

const showTooltip = (index) => {
  activeTooltip.value = index;
}

const hideTooltip = () => {
  activeTooltip.value = null;
}

function handleBeforeUnload(e) {
  const confirmationMessage = 'Your selected meal won\'t be logged or saved if you leave this page.';
  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome <34
}

const back = async () => {
  console.log('=== Summary Back button clicked ===');
  console.log('selectedMeals:', selectedMeals.value);
  console.log('mealInfo:', mealInfo.value);
  
  localStorage.setItem('selectedMeals', JSON.stringify(selectedMeals.value))
  // Restore mealInfo to localStorage for add-meals page
  localStorage.setItem('mealInfo', JSON.stringify(mealInfo.value))
  
  // Prevent "Leave site?" prompt
  window.removeEventListener('beforeunload', handleBeforeUnload);
  
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
}


function updateChanges(id=null, portion=null) {

  if (portion === "") {
    return ;
  }else if (portion != null){ 
    const meal = selectedMeals.value.find((meal) => meal.id === id);
    meal.portion = portion;
  }
    
  userAfterMealNutrients.value = JSON.parse(JSON.stringify(userRemainingNutrients.value));

  selectedMeals.value.forEach(existing_meal => {  
    userAfterMealNutrients.value.calories -= existing_meal.recipe.nutrition_info.calories * (existing_meal.portion/existing_meal.recipe.serving_size);
    userAfterMealNutrients.value.carbs -= existing_meal.recipe.nutrition_info.totalCarbohydrate * (existing_meal.portion/existing_meal.recipe.serving_size);
    userAfterMealNutrients.value.protein -= existing_meal.recipe.nutrition_info.protein * (existing_meal.portion/existing_meal.recipe.serving_size);
    userAfterMealNutrients.value.fat -= existing_meal.recipe.nutrition_info.fat * (existing_meal.portion/existing_meal.recipe.serving_size);
    userAfterMealNutrients.value.sodium -= existing_meal.recipe.nutrition_info.sodium * (existing_meal.portion/existing_meal.recipe.serving_size);
    userAfterMealNutrients.value.cholesterol -= existing_meal.recipe.nutrition_info.cholesterol * (existing_meal.portion/existing_meal.recipe.serving_size);
  });

  // fix all value to 2 decimal places
  for (const key in userAfterMealNutrients.value) {
    userAfterMealNutrients.value[key] = parseFloat(userAfterMealNutrients.value[key].toFixed(2));
  }
  
  // set the text
  tooltips.value = [];
  tooltips.value.push([`Current calories: ${userRemainingNutrients.value.calories} cal`,`After adding meal: ${userAfterMealNutrients.value.calories} cal`]);
  tooltips.value.push([`Current protein: ${userRemainingNutrients.value.protein} g`,`After adding meal: ${userAfterMealNutrients.value.protein} g`]);
  tooltips.value.push([`Current carbs: ${userRemainingNutrients.value.carbs} g`,`After adding meal: ${userAfterMealNutrients.value.carbs} g`]);
  tooltips.value.push([`Current fat: ${userRemainingNutrients.value.fat} g`,`After adding meal: ${userAfterMealNutrients.value.fat} g`]);
  tooltips.value.push([`Current sodium: ${userRemainingNutrients.value.sodium} mg`,`After adding meal: ${userAfterMealNutrients.value.sodium} mg`]);
  tooltips.value.push([`Current cholesterol: ${userRemainingNutrients.value.cholesterol} mg`,`After adding meal: ${userAfterMealNutrients.value.cholesterol} mg`]);
}



function removeSelectedMeal(id) {
  console.log("trigger remove meal in page");
  selectedMeals.value = selectedMeals.value.filter((meal) => meal.id !== id);
  updateChanges();
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

async function logMeal(){
  console.log('Done button clicked - logMeal function called');
  console.log('mealInfo:', mealInfo.value);
  console.log('selectedMeals:', selectedMeals.value);
  
  isLoading.value = true;
    // store data to db 
  const token = localStorage.getItem("accessToken");  
  console.log('Token exists:', !!token);
  const meal_info = [];

  selectedMeals.value.forEach((meal) => {
    meal_info.push({
      recipeId: meal.id,
      portion: meal.portion,
    });
  });
  ;                   

  try{
    const response = await $axios.post('/meal-log-summary/add', {
        mealDate: mealInfo.value.logDate,
        userLocalDateTime:today_date_time(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recipeIdPortions: meal_info,
        mealType: mealInfo.value.mealType,
        isMealPlanning: mealInfo.value.logType === "planning"
      },{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
    })

    console.log(response);
    const successStatuses = [200, 201, 204];
    if (successStatuses.includes(response.status)){
      useToast().success("All meals have been logged!")
      // Prevent "Leave site?" prompt
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // navigate
      if (mealInfo.value.logType === "planning"){
        window.location.href = '/meal-planning';
      } else {
        window.location.href = '/meal-logging';
      }
    }
  } catch(e){
    console.error("Error logging meal", e);
    // Handle error response
    if (e.response && e.response.data && e.response.data.message) {
      useToast().error(e.response.data.message)
    } else {
      useToast().error("Failed to log meals. Please try again.")
    }
  } finally {
    isLoading.value = false;
  }
}



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

.title {
  position: absolute;
  top: 12%;
  left: 46%;
  font-size: 2rem;
  font-weight: bold;
}

.back-button {
  position: absolute;
  width: fit-content;
  top: 12%;
  left: 5%;
  padding-right: 1%;
  background-color: #87A98D;
  color: #FFFEF1;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-items: center;
  justify-self: baseline;
  border-radius: 15px;
  flex-grow: 1;
}

.back-button button{
  background-color: #87A98D;
  width: 100%;
  color: #FFFEF1;
  padding: 5% 10%;
  display: flex;
  flex-direction: row;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  align-items: center;
  justify-self: baseline;
  border-radius: 15px
}

.back-button button span{
  width: 100%;
  height:100%;
  padding-top: 5%;
}

.done-button{
  display: flex;
  column-gap: 10%;
  justify-content: center;
  line-height: 1.5;
  position: absolute;
  bottom: 13%;
  background-color: #87A98D;
  color: #FFFEF1;
  padding: .5% 2%;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
}

.back-button:hover,
.done-button:hover{
  background-color: #749279;
}

.selected-meal-container{
  position: absolute;
  top: 20%;
  left: 5%;
  width: 45%;
  height: 60%;
  overflow-y: auto;  

}

.remove-selected-meal{
  position: absolute;
  top: 4%;
  right: 2.5%;
  font-size: 1.7rem;
  font-weight: bold;
  color: red;
  rotate: 45deg;

}

.meal{
  position: relative;
  width: 95%;
  height: 23%;
  background-color:#FFFEF1;
  margin-top: 0.5%;
  margin-bottom: 5%;
  margin-left: 2.5%;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.image-container img{
  width: 115px;
  height: 115px;
  object-fit: cover;
  border-radius: 15px;
  padding: 5%;
}


.meal-info{
  width: 70%;
  height: 80%;
  display : flex;
  flex-direction: column;

}

.meal-info span {
  font-size: 1.2rem;
  padding-left: 1.5%;
  font-weight: bolder;
  width: 100%;
}

.nutrient-label{
  display: grid;
  grid-template-columns: 40% 60%;
}

.nutrient-label label{
  font-size: 0.8rem;
  font-weight: bold;
}

.nutrient-label span{
  padding-left: 5%;
  padding-right: 1%;
  font-size: 0.8rem;
}

.nutrition-list-container{
  display: grid;
  grid-template-columns: 50% 50%;
  padding-left: 1.5%;
  padding-top: 0.5%;
}

.portion-setting{
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.serving-input{
  width: 70%;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  text-align: center;
  margin-top: 5%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
}

.nutrition-widget{
  position:absolute;
  top: 25%;
  right: 11%;
  width: 22.5%;
  height: 50%;
  background-color: #FFFEF1;
  padding: 1% 2.5%;
  padding-bottom: 1%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5vh;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
}

.tooltip-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 0%;
}

.tooltip-container {
  position: relative;
  cursor: initial;
}

.custom-tooltip {
  position: absolute;
  top: -100%; /* Adjust based on your layout */
  left: 75%;
  transform: translateX(-50%);
  background-color: rgb(227, 212, 190);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 2vh;
  z-index: 10;
  width: 25vh;
  cursor: initial;



  font-size: 90%;
  font-weight: 600;
  padding: 2vh;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: 1; /* Tooltip is visible */
}


.loading-greyed-bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 100px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 15px solid #FFFEF1;
  border-right-color: #87A98D;
  animation: l2 1s infinite linear;
}
@keyframes l2 {to{transform: rotate(1turn)}}

</style>