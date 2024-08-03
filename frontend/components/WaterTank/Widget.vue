<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="relative text-center w-64">
        <div class="relative z-10 flex flex-col space-y-5">
          <P>{{ label }}</P>
          <P>{{ value }}/{{ maxValue }}ml</P>
        </div>
        <img src="../../assets/img/waterBase.png" alt="Water Base" class="absolute inset-0 w-full h-auto m-auto" />
      </div>
    </div>
  </template>
  
  <script setup>
  defineOptions({
    name: "NutrientBar",
  });
  
  const props = defineProps({
    label: {
      type: String,
      default: "Remaining Water Intake",
    },
    value: {
      type: Number,
      default: 500,
    },
    maxValue: {
      type: Number,
      default: 2000,
    },
  });
  </script>
  
  <style scoped>
  /* Add any additional custom styles here if necessary */
  </style>
  