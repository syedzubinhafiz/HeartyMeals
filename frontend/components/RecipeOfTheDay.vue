<template>
  <div class="relative m-20 w-[70vw] h-[60vh] flex items-center justify-center overflow-hidden">
    <img src="@/assets/img/dailyMealBG.png" alt="Hearty Meal" class="absolute w-full h-full z-0">
    <div class="absolute z-10 flex flex-col items-center text-white p-4">
      <h2 class="text-2xl font-bold">Recipe of the Day</h2>
      <div class="flex space-x-16 mt-2 w-full px-16 items-center justify-center">
        <div class="w-1/2 flex flex-col">
          <p class="text-justify">
            {{ recipeText }}
          </p>
          <div class="items-center justify-center flex flex-col">
            <img src="@/assets/img/IconGetRecipe.png" alt="Hearty Meal" class="w-fit h-fit z-0">
            <p class="-translate-y-3">Get Recipe</p>
          </div>
        </div>
        <div class="w-1/2 flex flex-col items-center justify-center">
          <img src="@/assets/img/nasiAyam.png" alt="Hearty Meal" class="w-fit h-fit z-0">
          <h2 class="text-justify -translate-y-10">{{ recipeName }}</h2>
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
          class="absolute bottom-10 right-0 bg-white text-black p-4 rounded-lg shadow-lg text-left grid grid-cols-2 gap-2"
        >
          <p>Calories: 79kcal</p>
          <p>Fat: 5g</p>
          <p>Sodium: 70mg</p>
          <p>Protein: 6g</p>
          <p>Carbohydrates: 0g</p>
          <p>Cholesterol: 200mg</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recipeName: {
    type: String,
    default: "Nasi Ayam"
  },
  recipeText: {
    type: String,
    default: "Packed with flavours and low on salt, this newly created nasi lemak recipe is a must have to expand your library of recipes."
  }
});

const showNutrition = ref(false);
</script>

<style scoped>
/* Tailwind CSS handles most styling; no additional CSS is required */
</style>
