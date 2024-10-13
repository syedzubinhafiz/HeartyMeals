<template>
    <div class="nutrition-bar">
        <div class="label-grid">
          <div class="label-icon-container">
            <img :src="icon" class="icon"/>
            <label class="label-grid-left">{{ label }}</label>
          </div>
            <span :style="{ color: fontColor }" class="label-grid-right">{{ parseFloat(afterMealValue.toFixed(2)) }}/{{ totalValue }}{{ unit }}</span>
        </div>

        <div class="progress-bar-container" :style="progressBarContainerStyle">
            <div class="progress-bar max-nutrients" :style="{ width: maxPercentage + '%' , backgroundColor: maxColor}"></div>
            <div class="progress-bar current-nutrients" :style="{ width: currentPercentage + '%' , backgroundColor: currentColor}"></div>
            <div class="progress-bar after-meal-nutrients" :style="{ width: afterMealPercentage + '%' , backgroundColor: afterMealColor}"></div>
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
  
  const maxPercentage = computed(() => (props.totalValue / props.totalValue) * 100);
  const currentPercentage = computed(() => (props.currentValue / props.totalValue) * 100);
  const afterMealPercentage = computed(() => {
    const value = (props.afterMealValue / props.totalValue) * 100;
    return value < 0 ? 0 : value;
  });
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
* {
    font-family: 'Overpass', sans-serif;
}
  .nutrition-bar {
    margin-top: clamp(0.5%, 3.5%, 35%);
    justify-content: center;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .label-grid {
    display: grid;
    grid-template-columns: 1fr 1fr ;
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
  }

  .label-grid-right {
    grid-area: label-grid-right;
    text-align: right;
    font-size: 90%;
  }

  .progress-bar-container {
    position: relative;
    height: clamp(.8vh, 1vh, 1.5vh);
    width: 100%;
    border-radius: 50px;
    background-color: #e0e0e0;
  }

  .progress-bar {
    position: absolute;
    height: 100%;
    border-radius: 50vh;
    box-shadow: 0px 4px 16.2px -1px rgba(0,0,0,0.1);
  }
  
  .icon{
    width: 15px;
    margin-right: 5%;
  }

</style>
  