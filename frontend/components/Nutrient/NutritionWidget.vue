<template>
    <div class="widget-container">
        <NutritionBar
            v-for="(nutrient, index) in nutrientsList"
            :key="index"
            :icon="nutrient.icon"
            :label="nutrient.label"
            :totalValue="nutrient.totalValue"
            :currentValue="nutrient.currentValue"
            :afterMealValue="nutrient.afterMealValue"
            :unit="nutrient.unit"
            :maxColor="nutrient.maxColor"
            :currentColor="nutrient.currentColor"
            :afterMealColor="nutrient.afterMealColor"
            :fontColor="nutrient.fontColor"
        />
    </div>
</template>
  
  <script setup>
    import { ref } from 'vue';
    import NutritionBar from './NutritionBar.vue';

    // fixed nutrients format
    const nutrientsList = [
            {
            icon: "/assets/img/caloriesIcon.png",
            label: 'Calories',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'cal',
            maxColor: '#e9e5cd',
            currentColor: '#d7d1b4',
            afterMealColor: '#b8b396',
            fontColor: '#b8b396',
        },
        {
            icon: "/assets/img/carbIcon.png",
            label: 'Carbohydrates',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#e2f3f4',
            currentColor: '#a2d3d6',
            afterMealColor: '#83bbbe',
            fontColor: '#83bbbe',
        },
        {
            icon: "/assets/img/proteinIcon.png",
            label: 'Protein',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#e8f0e9',
            currentColor: '#99d0a3',
            afterMealColor: '#87a98d',
            fontColor: '#87a98d',
        },
        {
            icon: "/assets/img/fatsIcon.png",
            label: 'Fats',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#fbf1cd',
            currentColor: '#fcdea3',
            afterMealColor: '#ecc474',
            fontColor: '#ecc474',
        },
        {
            icon: "/assets/img/sodiumIcon.png",
            label: 'Sodium',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'mg',
            maxColor: '#f9e1da',
            currentColor: '#f6aa97',
            afterMealColor: '#ec7455',
            fontColor: '#ec7455',
        },
        {
            icon: "/assets/img/cholesterolsIcon.png",
            label: 'Cholesterol',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'mg',
            maxColor: '#ffe5d4',
            currentColor: '#f1c9af',
            afterMealColor: '#be9a83',
            fontColor: '#be9a83',
        }
    ]

    /**
     * pass in the format 
     * [daily_budget, current_value, after_meal_value]
     * 
     * for each
     * {
     *  calories: 2000,
     *  carbs: 2000,
     *  protein: 2000,
     *  fats: 2000,
     *  sodium: 2000,
     *  cholesterol: 2000
     * }
     */
    
    const props = defineProps({
        nutrients: {
            type: Array,
            required: true,
        },
    });

    const nutrientsType = ['calories', 'carbs', 'protein', 'fats', 'sodium', 'cholesterol'];

    for (let i = 0; i < nutrientsList.length; i++) {
        const daily_budget = props.nutrients[0][nutrientsType[i]];
        const current_value = props.nutrients[1][nutrientsType[i]];
        const after_meal_value = props.nutrients[2][nutrientsType[i]];

        nutrientsList[i].totalValue = daily_budget;
        nutrientsList[i].currentValue = current_value;
        nutrientsList[i].afterMealValue = after_meal_value;
    }

  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
    * {
        font-family: 'Overpass', sans-serif;
    }

  .widget-container{
    position: relative;
    border-radius: 50px;
    max-width: 100%;
    max-height: 100%;
  }
  </style>
  