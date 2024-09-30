<template>
    <div>
        <div class="widget-container">
            <label class="nutrition-title">Total Nutrition</label>
            <NutritionBar
                v-for="(nutrient, index) in nutrients"
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
    </div>
    
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import NutritionBar from './NutritionBar.vue';
  
  const nutrients = ref([
    {
        icon: "/assets/img/caloriesIcon.png",
        label: 'Calories',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'cal',
        maxColor: '#e9e5cd',
        currentColor: '#d7d1b4',
        afterMealColor: '#b8b396',
        fontColor: '#b8b396',
    },
    {
        icon: "/assets/img/carbIcon.png",
        label: 'Carbohydrates',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'g',
        maxColor: '#e2f3f4',
        currentColor: '#a2d3d6',
        afterMealColor: '#83bbbe',
        fontColor: '#83bbbe',
    },
    {
        icon: "/assets/img/proteinIcon.png",
        label: 'Protein',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'g',
        maxColor: '#e8f0e9',
        currentColor: '#99d0a3',
        afterMealColor: '#87a98d',
        fontColor: '#87a98d',
    },
    {
        icon: "/assets/img/fatsIcon.png",
        label: 'Fats',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'g',
        maxColor: '#fbf1cd',
        currentColor: '#fcdea3',
        afterMealColor: '#ecc474',
        fontColor: '#ecc474',
    },
    {
        icon: "/assets/img/sodiumIcon.png",
        label: 'Sodium',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'mg',
        maxColor: '#f9e1da',
        currentColor: '#f6aa97',
        afterMealColor: '#ec7455',
        fontColor: '#ec7455',
    },
    {
        icon: "/assets/img/cholesterolsIcon.png",
        label: 'Cholesterol',
        totalValue: 2000,
        currentValue: 1800,
        afterMealValue: 1400,
        unit: 'mg',
        maxColor: '#ffe5d4',
        currentColor: '#f1c9af',
        afterMealColor: '#be9a83',
        fontColor: '#be9a83',
    }
  ]);
  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
    * {
        font-family: 'Overpass', sans-serif;
    }

  .widget-container{
    position: relative;
    background-color: #F3EADA;
    padding: 4vh;
    border-radius: 5vh;
    width: fit-content;
    box-shadow: 0px 4px 16.2px -1px rgba(0,0,0,0.1);
  }

  .nutrition-title {
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 5vh;
  }
  </style>
  