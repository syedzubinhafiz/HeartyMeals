<template>
    <div level="2" class="flex flex-row items-center p-2 space-x-4">
        <!-- <div class="w-16 h-16"/> -->
         <img :src="modelValue.mealImg" class="h-24 w-24 rounded-lg shadow-md"/>
         <div class="flex flex-col grow">
            <H3>{{ modelValue.name }}</H3>
            <P>Serving Size: {{ modelValue.servingSize }}</P>
            <p class="text-xs">Calories: {{ modelValue.nutrientData.calories }}mg Protein: {{ modelValue.nutrientData.protein }}mg</p>
            <p class="text-xs">Fat: {{ modelValue.nutrientData.fats }}mg Carbs: {{ modelValue.nutrientData.carbohydrtates }}mg Sodium: {{ modelValue.nutrientData.sodium }}mg</p>
            <p class="text-xs">Cholesterol: {{ modelValue.nutrientData.cholesterol }}mg</p>
         </div>
         <div class="flex flex-row ml-5 space-x-2">
            <P>servings:</P>
            <Dropdown :options="[0.25,0.5,0.75,1,2,3,4]" v-model="modelValue.servings"/>
         </div>
    </div>
</template>
<script setup>
import MealData from '../../classes/mealData.js'
import NutrientData from '../../classes/nutrientData.js'

defineOptions({
  name: 'StomachMeal',
});

const props = defineProps({
  modelValue: {
    type: MealData,
    default: new MealData("Cheese Croissant","assets/img/croissant.svg","1 crossiant (100g)",1,
      new NutrientData(500,100,200,200,10,400)
    )
  }
})

</script>