<template>
    <div>
      <div v-for="(item, index) in nutritionItems" :key="index" class="nutrition-group">
        <label :for="`${item.name}`" class="form-label-format">{{ item.name }}</label>
        <div></div>
        <input
          type="number"
          :id="`${item.name}`"
          class="form-normal-text-input"
          :placeholder="`Enter ${item.name}`"
        />
        <p class="nutrition-unit-format">{{ item.unit }}</p>
      </div>
    </div>
  </template>
  
  <script>
  defineOptions({
    name: "NutritionInput",
    });

  export default {
    props: {
      nutritionItems: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  