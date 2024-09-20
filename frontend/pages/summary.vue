<template>
    <div class="summary-page">
    <div class="absolute w-screen z-40">
        <Header/>
    </div>
    <div class="content">
        <button @click="navigateTo('/add-meals')" class="back-button">← Back</button>
        <h2 class="page-title">Summary</h2>
        <div class="main-content">
            <div class="summary-container">
                <SummaryCard 
                v-for="(item, index) in summaryData" 
                :key="index" 
                :item="item"
                :itemNumber="index + 1"
                @update-servings="updatePortions"
                />
            </div>
            <div class="nutrition-summary">
                <NutrientWidgetDelta :nutrientData="myNutrientData" :netNutrientData="myMealNutrientData" :maxNutrientData="myMaxNutritientData"/>
            </div>
        </div>
  <div class="button-container"> 
    <button class="done-button" @click="handleDoneClick">
        <img src="/assets/img/done-icon.svg" alt="done" class="done-icon"/>
        Done
    </button>
    </div> 
</div>
<div class="section flex flex-col justify-end">
            <Footer/>
        </div>
</div>
</template>
<script setup>
import { warn } from 'vue';
import MealData from '../../classes/mealData.js'
import { useRoute } from 'vue-router';

const route = useRoute();




defineOptions({
	name: "HomePage",
});


definePageMeta({
	layout: "emptylayout"
});

const tempMealData = ref([])
const myNutrientData = ref(new NutrientData(0, 0, 0, 0, 0, 0))
const myMealNutrientData = ref(new NutrientData(0, 0, 0, 0, 0, 0))
const myMaxNutritientData = ref(new NutrientData(0, 0, 0, 0, 0, 0))
const summaryData = ref([])
const recipePortion = []
// const mealType = "Breakfast"
const mealType = ref(route.query.mealType || "");

onMounted(async () => {
  await useApi("/dietary","GET")
  summaryData.value = useMealLogging().unsavedMealList.value
  console.log(summaryData.value)
  // console.log(mealLoggingData.value)
  // mealLoggingData = mealLoggingData.value["Breakfast"]
  //   .concat(mealLoggingData.value["Lunch"])
  //   .concat(mealLoggingData.value["Dinner"])
  //   .concat(mealLoggingData.value["Other"])
  // summaryData.value = mealLoggingData
  // console.log(summaryData.value[0].recipe.id)
  // tempMealData.value = mealLoggingData.map((value) => {return MealData.fromApi(value.recipe)})
  // console.log(tempMealData.value)
  // console.log(summaryData.value)




  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  currentDate = currentDate.toISOString();

  recipePortion.value = summaryData.value.map(item => ({
    recipeId: item.id,
    portion: item.servings
  }));

  await calculateNutrition();
});

const updatePortions = () => {
  recipePortion.value = summaryData.value.map(item => ({
    recipeId: item.id,
    portion: item.servings
  }));
  calculateNutrition();
};

const userBudget = ref({calories: 0, carbs: 0, protein: 0, fats: 0, sodium: 0, cholesterol: 0});
const alreadyLog = ref({calories: 0, carbs: 0, protein: 0, fats: 0, sodium: 0, cholesterol: 0});
const aboutToLog = ref({calories: 0, carbs: 0, protein: 0, fats: 0, sodium: 0, cholesterol: 0});

const calculateNutrition = async () => {
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  currentDate = currentDate.toISOString();

  console.log(mealType.value);

  let body = {
    "mealDate": `${currentDate}`,
    "recipeIdPortions": recipePortion.value,
    "mealType": `${mealType.value}`
  };

  let result = await useApi("/meal-log-summary/calculate", "POST", body);
  console.log(recipePortion.value)
  console.log(result);

  userBudget.calories = (result.value[0].calories);
  userBudget.carbs = result.value[0].carbs;
  userBudget.protein = result.value[0].protein;
  userBudget.fats = result.value[0].fats;
  userBudget.sodium = result.value[0].sodium;
  userBudget.cholesterol = result.value[0].cholesterol;

  alreadyLog.calories = result.value[0].calories - result.value[1].calories;
  alreadyLog.carbs = result.value[0].carbs - result.value[1].carbs;
  alreadyLog.protein = result.value[0].protein - result.value[1].protein;
  alreadyLog.fats = result.value[0].fats - result.value[1].fats;
  alreadyLog.sodium = result.value[0].sodium - result.value[1].sodium;
  alreadyLog.cholesterol = result.value[0].cholesterol - result.value[1].cholesterol;

  console.log(alreadyLog);

  aboutToLog.calories = result.value[0].calories - result.value[2].calories;
  aboutToLog.carbs = result.value[0].carbs - result.value[2].carbs;
  aboutToLog.protein = result.value[0].protein - result.value[2].protein;
  aboutToLog.fats = result.value[0].fats - result.value[2].fats;
  aboutToLog.sodium = result.value[0].sodium - result.value[2].sodium;
  aboutToLog.cholesterol = result.value[0].cholesterol - result.value[2].cholesterol;

  console.log(aboutToLog);

  myMaxNutritientData.value = new NutrientData(userBudget.calories, userBudget.carbs, userBudget.protein, userBudget.fats, userBudget.sodium, userBudget.cholesterol);
  myNutrientData.value = new NutrientData(aboutToLog.calories, aboutToLog.carbs, aboutToLog.protein, aboutToLog.fats, aboutToLog.sodium, aboutToLog.cholesterol);
  myMealNutrientData.value = new NutrientData(alreadyLog.calories, alreadyLog.carbs, alreadyLog.protein, alreadyLog.fats, alreadyLog.sodium, alreadyLog.cholesterol);
  return result.value; 
};

// Handle button click
const handleDoneClick = async () => {
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  currentDate = currentDate.toISOString();

  for (let i = 0; i < summaryData.value.length; i++) {
    let currentDate = new Date()
    currentDate.setUTCHours(-8, 0, 0, 0)
    currentDate = currentDate.toISOString()
    let result = await useFillData().createMeal(currentDate,summaryData.value[i].id,mealType.value,summaryData.value[i].servings)
    if(result.isError) {
      useToast().error("Meal logging failed!")
      console.log(result)
      return 
    }
   
  }
  useMealLogging().unsavedMealList.value = []
  navigateTo('/meal-logging');
};

console.log("-------------")
console.log(useMealLogging().unsavedMealList)


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro&display=swap');
*{
    font-family: 'Overpass', sans-serif;
}
.summary-page {
    position: relative;
  min-height: 100vh;
  background-image: url('/assets/img/Design.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-position: center;
  overflow-x: hidden;
}

.content {
    position: relative;
  z-index: 1;
  margin-top: 100px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
}
@media (max-width: 600px) {
  .summary-page {
    background-size: cover;
  }
}

.main-content {
    display: flex;
  flex-grow: 1;
  gap: 20px;
  margin-bottom: 20px;
}
.summary-container {
    width: 50%;
    overflow-y: auto;
    height: calc(3 * 120px); /* Assumes each SummaryCard is about 120px high */
    padding-right: 20px;
}

.back-button {
    background-color: #87A98D;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 10px;
    margin-bottom: 5px;
    height: 40px;
    width: 120px;
    font-size: 20px;
    align-self: flex-start;

}

.page-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 30px;
}

.done-button {
    background-color: #87A98D;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    height: 45px;
    width: 140px;
    font-size: 20px;
    display: flex;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nutrition-summary {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 20px;
    width: 100%;
}

.done-icon {
  width: 24px;
  height: 24px;
  margin-left: 8px;
}
</style>

<script>
import NutrientData from '~/classes/nutrientData';
import { useMealLogging } from '~/composables/mealLogging.js';



export default {
  data() {
    return {
      myNutrientData: new NutrientData(0, 0, 0, 0, 0, 0),
      myMealNutrientData: new NutrientData(0, 0, 0, 0, 0, 0),
    };
  }}

</script>