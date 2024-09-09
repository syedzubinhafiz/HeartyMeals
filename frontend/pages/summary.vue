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
                v-for="(item, index) in tempMealData" 
                :key="index" 
                :item="item"
                :itemNumber="index + 1"
                />
            </div>
            <div class="nutrition-summary">
                <NutrientWidgetDelta :nutrientData="myNutrientData" :mealNutrientData="myMealNutrientData"/>
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
import MealData from '../../classes/mealData.js'


defineOptions({
	name: "HomePage",
});


definePageMeta({
	layout: "emptylayout"
});

const tempMealData = ref([])
const myNutrientData = ref(new NutrientData(0, 0, 0, 0, 0, 0))
const myMealNutrientData = ref(new NutrientData(0, 0, 0, 0, 0, 0))
const summaryData = ref([])

onMounted(async () => {
  await useApi("/dietary","GET")
  let mealLoggingData = await useFillData().fillMealLogging()
  // console.log(mealLoggingData.value)
  mealLoggingData = mealLoggingData.value["Breakfast"]
    .concat(mealLoggingData.value["Lunch"])
    .concat(mealLoggingData.value["Dinner"])
    .concat(mealLoggingData.value["Other"])
  summaryData.value = mealLoggingData
  console.log(summaryData.value[0].recipe.id)
  console.log(summaryData.value)
  tempMealData.value = mealLoggingData.map((value) => {return MealData.fromApi(value.recipe)})
  console.log(tempMealData.value)



  let currentDate = new Date();
  currentDate.setHours(-8,0,0,0);
  currentDate = currentDate.toISOString();

  let data = await useApi(`/user/budget?date=${currentDate}`, "GET");
  console.log(data);
  myMealNutrientData.value = new NutrientData(data.value[1].calories, data.value[1].carbs, data.value[1].protein, data.value[1].fats, data.value[1].sodium, data.value[1].cholesterol);  
  myNutrientData.value = new NutrientData(data.value[0].calories, data.value[0].carbs, data.value[0].protein, data.value[0].fats, data.value[0].sodium, data.value[0].cholesterol);

});


const userBudget = ref("")


function contactForm() {
  $fetch('/api/contact', {
    method: 'POST',
    body: { hello: 'world '}
  })
}


const getNutrition = async (mealDate, recipeId, portion ,mealType) => {
    let body = {
        "mealDate": `${mealDate}`,
        "recipeIdPortions": [
            { 
                "recipeId": `${recipeId}`, 
                "portion": portion
            }
        ],
        "mealType": `${mealType}`
    };

    let result = await useApi("/meal-log-summary/calculate", "POST", body);
    console.log(result)

    return result.value;
}

// Handle button click
const handleDoneClick = async () => {
  let currentDate = new Date();
  currentDate.setHours(-8,0,0,0);
  currentDate = currentDate.toISOString();

  for (let i = 0; i < summaryData.value.length; i++) {
    const nutritionAfter = await getNutrition(currentDate, summaryData.value[i].recipe.id, summaryData.value[i].portion, summaryData.value[i].type);
    let body = {
      "mealDate": `${currentDate}`,
      "recipeIdPortions": [
        {
          "recipeId": `${summaryData.value[i].recipe.id}`,
          "portion": summaryData.value[i].portion
        }
      ],
      "nutritionAfter": nutritionAfter[2],
      "mealType": `${summaryData.value[i].type}`
    };

    let result = await useApi("/meal-log-summary/add", "POST", body);
    console.log(result);
  }

};




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



export default {
  data() {
    return {
      myNutrientData: new NutrientData(0, 0, 0, 0, 0, 0),
      myMealNutrientData: new NutrientData(0, 0, 0, 0, 0, 0),
    };
  }}

</script>