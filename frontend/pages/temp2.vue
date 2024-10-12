<template>
    <div ref="container" class="container relative">
      <div class="section w-screen h-screen bg-red-200 flex items-center justify-center">
        <NutrientWidgetDelta/>
      </div>
      <div class="section w-screen h-screen bg-green-200 flex items-center justify-center">
        <StomachSidebar v-model="mealDataList" v-model:isSidebarOpen="isSidebarOpen"/>
        <ButtonGreen @click="toggleSidebar">
          <p>open sidebar</p>
        </ButtonGreen>
      </div>
      <div class="section w-screen h-screen bg-yellow-200 flex items-center justify-center">
        <CustomDishPopup v-model:isPopupOpen="isPopupOpen"/>
        <ButtonGreen @click="togglePopup">
          <p>open popup</p>
        </ButtonGreen>
      </div>
      <div class="section w-screen h-screen bg-blue-200 flex items-center justify-center">
        <NutrientWidget v-model:maxNutrientData="maxNutrientData" v-model:nutrientData="nutrientData"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  
  const container = ref(null);
  
  onMounted(() => {
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
  
    const scrollToSection = (index) => {
      if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
        currentSection = index;
      }
    };
  
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        scrollToSection(currentSection + 1);
      } else {
        scrollToSection(currentSection - 1);
      }
    };
  
    container.value.addEventListener('wheel', handleWheel);
  });
// ---------------------------------

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

import MealData from '../../classes/mealData.js'
import NutrientData from '../../classes/nutrientData.js'


let mealData1 = new MealData("Regular Croissant","assets/img/croissant.svg","1 crossiant (80g)",1,
  new NutrientData(400,150,100,100,5,300)
)

let mealData2 = new MealData("Cheese Croissant","assets/img/croissant.svg","1 crossiant (100g)",1,
  new NutrientData(500,100,200,200,10,400)
)

let mealData3 = new MealData("Not a Croissant","assets/img/croissant.svg","1 crossiant (50g)",1,
  new NutrientData(100,60,140,70,20,200)
)

const mealDataList = ref([mealData1,mealData2,mealData3])

// ---------------------------------

const isPopupOpen = ref(false);

const togglePopup = () => {
  isPopupOpen.value = !isPopupOpen.value;
};
const maxNutrientData = ref(null)
const nutrientData = ref(null)

// nutrient widget stuff
onMounted(async () => {
  await useApi("/dietary","GET")
  let recipes = await useFillData().fillRecipes();
  let currentDate = new Date()
    // currentDate.setUTCHours(-8, 0, 0, 0)
    currentDate = currentDate.toISOString()
  let result = await useApi(`/user/budget?date=${currentDate}`,"GET")
  console.log(result)
  maxNutrientData.value = NutrientData.fromApi2(result.value[0])
  nutrientData.value = NutrientData.fromApi2(result.value[1])

  // result = await useApi("/meal-log-summary/calculate","POST",{
  //   "mealDate": "2024-09-06T11:11:11.111+0800",
  //   "recipeIdPortions": [
  //       {
  //           "recipeId": recipes.value.filter((value) => value.name.toUpperCase()=="BAKED POTATO WITH FISH")[0].id,
  //           "portion": 1
  //       }
  //   ],
  //   "mealType": "Breakfast"

  // })
  // console.log(result)

  // let nutritionAfter = result.value[2]

  // result = await useApi("/meal-log-summary/add","POST",{
  //     "mealDate": "2024-09-06T11:11:11.111+0800",
  //     "recipeIdPortions": [
  //         {
  //             "recipeId": recipes.value.filter((value) => value.name.toUpperCase()=="BAKED POTATO WITH FISH")[0].id,
  //             "portion": 1
  //         }
  //     ],
  //     "nutritionAfter": nutritionAfter,
  //     "mealType": "Breakfast"
  //   }
  // )
  // console.log(result)

  // console.log(useFillData().fillMealSummary())

})

</script>
  
<style scoped>
html {
  scroll-behavior: smooth;
}

.container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.section {
  scroll-snap-align: start;
  height: 100vh;
  width: 100%;
}
</style>
