<template>
  <div class="relative w-[33rem] h-[20rem] lg:w-[38rem] lg:h-[23rem] flex items-center justify-center overflow-hidden">
    <img src="@/assets/img/dailyMealBG.png" alt="Hearty Meal" class="absolute w-full h-full z-0">
    <div class="absolute z-10 flex flex-col items-center text-white p-4">
      <h2 class="text-xl font-bold">Recipe of the Day</h2>
      <div class="flex space-x-6 mt-2 w-full px-16 items-center justify-center">
        <div class="w-1/2 flex flex-col h-full">
          <p class="text-justify text-sm">
            {{ recipe_description }}
          </p>
          <div class="items-center justify-center flex flex-col get-recipe" @click.prevent="getRecipe(`${recipe_id}`)">
            <img src="@/assets/img/IconGetRecipe.png" alt="Hearty Meal" class="w-fit h-fit z-0">
            <p class="-translate-y-3">Get Recipe</p>
          </div>
        </div>
        <div class="w-1/2 flex flex-col items-center justify-center">
          <img src="@/assets/img/nasiAyam.png" alt="Hearty Meal" class="w-fit h-fit z-0">
          <h2 class="text-justify -translate-y-6">{{ recipe_name }}</h2>
        </div>
      </div>
      <div 
        class="relative flex justify-end items-center pr-12 w-full text-xs cursor-pointer"
        @mouseover="showNutrition = true" 
        @mouseleave="showNutrition = false"
      >
        <p>View nutritional information</p>
        <img src="@/assets/img/Info_alt_light.png" alt="Hearty Meal" class="w-6 h-6 z-0">
        <div 
          v-if="showNutrition" 
          class="absolute bottom-10 right-0 bg-white text-black p-4 rounded-lg shadow-lg nutrition-info-container"
        >
          <div v-for="nutrient in nutrient_info" class="nutrient-group">
            <img :src="nutrient.icon"/>
            <label class="nutrient-label">{{nutrient.title}}</label>
            <label class="nutrient-value">{{nutrient.value}}</label>
            <label class="nutrient-label">{{nutrient.unit}}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';
import fatIcon from '@/assets/icon/fat-icon.svg';
import sodiumIcon from '@/assets/icon/sodium-icon.svg';
import proteinIcon from '@/assets/icon/protein-icon.svg';
import carbsIcon from '@/assets/icon/carbs-icon.svg';
import caloriesIcon from '@/assets/icon/calories-icon.svg';
import cholesterolIcon from '@/assets/icon/cholesterol-icon.svg'

const { $axios } = useNuxtApp();

const recipe_name =  ref('');
const recipe_description = ref('')
const recipe_id =  ref('');


const nutrient_info = [
  {
    icon: caloriesIcon,
    title: "Calories :",
    value: 0,
    unit: "cal",
  },
  {
    icon: fatIcon,
    title: "Fat :",
    value: 0,
    unit: "g",
  },
  {
    icon: sodiumIcon,
    title: "Sodium :",
    value: 0,
    unit: "mg",
  },
  {
    icon: proteinIcon,
    title: "Protein :",
    value: 0,
    unit: "g",
  },
  {
    icon: carbsIcon,
    title: "Carbs :",
    value: 0,
    unit: "g",
  },
  {
    icon: cholesterolIcon,
    title: "Cholesterol :",
    value: 0,
    unit: "mg",
  }
]

try{
  const token =  localStorage.getItem('accessToken');
  const response = await $axios.get('/recipe/recipe-of-the-day', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  recipe_id.value = response.data.id;
  recipe_name.value =  response.data.name;
  recipe_description.value = response.data.description;
  nutrient_info[0].value = response.data.nutrition_info.calories;
  nutrient_info[1].value = response.data.nutrition_info.fat;
  nutrient_info[2].value = response.data.nutrition_info.sodium;
  nutrient_info[3].value = response.data.nutrition_info.protein;
  nutrient_info[4].value = response.data.nutrition_info.carbs;
  nutrient_info[5].value = response.data.nutrition_info.cholesterol;

} catch(e){
  console.log("error getting recipe of the day", e);
  // useToast().error('Failed to fetch recipe of the day');
}

const showNutrition = ref(false);

const getRecipe = (id) => {
  alert("Redirecting to recipe page... ");
};



</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

/* Tailwind CSS handles most styling; no additional CSS is required */
.get-recipe {
  cursor: pointer;
}

.nutrient-label{
  font-family: 'Overpass', sans-serif;
  font-weight: 800;
  font-size: small;
  align-self:center;
}
.nutrition-info-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width:80%

}



.nutrient-group{
  padding-left: 5%;
  display: grid;
  grid-template-columns: 12% 58% 15% 15%;
}
</style>
