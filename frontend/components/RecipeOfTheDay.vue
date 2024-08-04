<template>
    <div class="relative m-20 w-[70vw] h-[60vh] flex items-center justify-center overflow-hidden">
      <img src="@/assets/img/dailyMealBG.png" alt="Hearty Meal" class="absolute w-full h-full z-0">
      <div class="absolute z-10 flex flex-col items-center text-white p-4">
        <h2 class="text-2xl font-bold">Recipe of the Day</h2>
        <div class="flex space-x-16 mt-2 w-full px-16">
          <div class="w-1/2">
            <p class="text-justify">
              {{ recipeText }}
            </p>
            <div>
                <img src="@/assets/img/IconGetRecipe.png" alt="Hearty Meal" class=" w-fit h-fit z-0">
                <p>Get Recipe</p>
            </div>
          </div>
          <div class="w-1/2 flex flex-col items-center justify-center">
            <img src="@/assets/img/nasiAyam.png" alt="Hearty Meal" class=" w-fit h-fit z-0">
            <H2 class="text-justify">{{ recipeName }}</H2>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    recipeName: {
        type: String,
        default: "Nasi Ayam"
    },
    recipeText: {
        type: String,
        default: "Lorem ipsum dolor sit amet, amogus sus baguette hon hon eiffel tower. This is not a test, this is a simulation theory to test what is and what is not, for what is stands against what is not."
    }
  })
  </script>
  
  <style scoped>
  /* Tailwind CSS handles most styling; no additional CSS is required */
  </style>
  