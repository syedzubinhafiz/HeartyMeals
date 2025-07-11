<template>
    <div class="nutrition-bar">
        <div class="label-grid">
          <div class="label-icon-container">
            <img :src="icon" class="icon"/>
            <!-- Use full label on desktop, shortened on mobile -->
            <label class="label-grid-left desktop-only">{{ label }}</label>
            <label class="label-grid-left mobile-only">{{ shortLabel }}</label>
          </div>
            <span :style="{ color: isOverBudget ? '#ef4444' : fontColor }" class="label-grid-right">{{ displayValue }}/{{ displayTotal }}{{ unit }}</span>
        </div>

        <div class="progress-bar-container" :style="progressBarContainerStyle">
            <div class="progress-bar max-nutrients" :style="{ width: maxPercentage + '%' , backgroundColor: maxColor}" :title="`Max: ${maxPercentage}%`"></div>
            <div class="progress-bar current-nutrients" :style="{ 
                width: currentPercentage + '%', 
                backgroundColor: isOverBudget ? '#ef4444' : currentColor
            }" :title="`Current: ${currentPercentage}%${isOverBudget ? ' (Over Budget!)' : ''}`"></div>
            <div class="progress-bar after-meal-nutrients" :style="{ 
                width: afterMealPercentage + '%', 
                backgroundColor: isOverBudget ? '#dc2626' : afterMealColor
            }" :title="`After: ${afterMealPercentage}%${isOverBudget ? ' (Over Budget!)' : ''}`"></div>
        </div>
    </div>
</template>
  
<script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    icon: String,
    label: String,
    totalValue: Number,
    currentValue: Number,
    afterMealValue: Number,
    unit: String,
    maxColor: String,
    currentColor: String,
    afterMealColor: String,
    fontColor: String,
    progressBarContainerStyle: {
      type: String,
      default: 'margin-top: 1%; margin-bottom: 1%;'
    }
  });
  
  const maxPercentage = computed(() => {
    if (!props.totalValue) return 0;
    const max = (props.totalValue / props.totalValue) * 100;
    console.log(`[NutritionBar] ${props.label} - maxPercentage: ${max}%, maxColor: ${props.maxColor}`);
    return max;
  });
  
  const currentPercentage = computed(() => {
    if (!props.totalValue) return 0;
    const raw = (props.currentValue / props.totalValue) * 100;
    // Cap at 100% to prevent overflow out of widget
    const current = Math.min(raw, 100);
    console.log(`[NutritionBar] ${props.label} - currentPercentage: ${current}% (capped from ${raw}%) (${props.currentValue}/${props.totalValue})`);
    return current;
  });
  
  const afterMealPercentage = computed(() => {
    if (!props.totalValue) return 0;
    const raw = (props.afterMealValue / props.totalValue) * 100;
    const value = raw < 0 ? 0 : raw;
    // Cap at 100% to prevent overflow out of widget
    const afterMeal = Math.min(value, 100);
    console.log(`[NutritionBar] ${props.label} - afterMealPercentage: ${afterMeal}% (capped from ${raw}%)`);
    return afterMeal;
  });
  
  // Determine if this nutrient is over budget for styling
  const isOverBudget = computed(() => {
    return props.currentValue > props.totalValue;
  });

  // Compute a shortened label for mobile screens
  const shortLabel = computed(() => {
    const labelMap = {
      'Carbohydrates': 'Carbs',
      'Protein': 'Protein',
      'Sodium': 'Sodium',
      'Cholesterol': 'Chol',
      'Calories': 'Cal'
    };
    
    return labelMap[props.label] || props.label;
  });

  // Compute values for display with proper formatting
  const displayValue = computed(() => {
    if (props.currentValue === null || props.currentValue === undefined) return '0';
    // For large values like sodium, round to nearest integer
    if (props.totalValue >= 100) {
      return Math.round(props.currentValue);
    }
    // For smaller values like macros, keep decimal places
    return parseFloat(props.currentValue.toFixed(1));
  });

  const displayTotal = computed(() => {
    if (props.totalValue === null || props.totalValue === undefined) return '0';
    // For large values like sodium, round to nearest integer
    if (props.totalValue >= 100) {
      return Math.round(props.totalValue);
    }
    // For smaller values like macros, keep decimal places
    return parseFloat(props.totalValue.toFixed(1));
  });
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
* {
    font-family: 'Overpass', sans-serif;
}
  .nutrition-bar {
    margin-top: 0; /* Remove top margin for tighter spacing */
    margin-bottom: 0; /* Remove bottom margin for tighter spacing */
    justify-content: center;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%; /* Ensure it doesn't exceed container width */
    overflow: hidden; /* Prevent any overflow */
    flex-shrink: 1; /* Allow bars to shrink to fit */
  }

  .label-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "label-grid-left label-grid-right";
    justify-content: space-between;
    align-items: center;
  }

  .label-icon-container {
    display: flex;  
    align-items: center;
  }

  .label-grid-left {
    grid-area: label-grid-left;
    text-align: left;
    font-size: 110%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label-grid-right {
    grid-area: label-grid-right;
    text-align: right;
    font-size: 90%;
    white-space: nowrap;
  }

  .progress-bar-container {
    position: relative;
    height: 12px; /* Fixed smaller height for compactness */
    width: 100%;
    border-radius: 50px;
    background-color: #e0e0e0;
    overflow: hidden; /* Prevent bars from overflowing container */
    box-sizing: border-box; /* Ensure padding is included in width calculations */
    margin-top: 2px; /* Small margin for spacing */
    margin-bottom: 2px;
  }

  .progress-bar {
    position: absolute;
    height: 100%;
    border-radius: 50vh;
    box-shadow: 0px 4px 16.2px -1px rgba(0,0,0,0.1);
    /* Ensure bars don't overflow even with large values */
    max-width: 100%;
  }
  
  .icon {
    width: 15px;
    height: 15px;
    margin-right: 5%;
    flex-shrink: 0;
  }

  /* Default hide mobile-only content */
  .mobile-only {
    display: none;
  }
  
  .desktop-only {
    display: block;
  }

  /* Mobile-specific adjustments */
  @media (max-width: 768px) {
    .nutrition-bar {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    
    /* Switch label display */
    .mobile-only {
      display: block;
    }
    
    .desktop-only {
      display: none;
    }
    
    .label-grid-left {
      font-size: 95%;
      max-width: 100%;
      font-weight: 500;
    }
    
    .label-grid-right {
      font-size: 85%;
    }
    
    .progress-bar-container {
      height: 8px; /* Fixed height on mobile */
      margin-top: 4px;
    }
    
    .icon {
      width: 12px;
      height: 12px;
      margin-right: 3px;
    }
  }
  
  /* Very small screens */
  @media (max-width: 360px) {
    .label-grid-left {
      font-size: 90%;
    }
    
    .label-grid-right {
      font-size: 80%;
    }
    
    .nutrition-bar {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
</style>
  