<template>
    <div v-if="visible" class="edit-meal-popup bg-white p-6 rounded-lg shadow-lg absolute z-50">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Edit Meal</h3>
        <button @click="closePopup" class="text-gray-500 hover:text-black">
          <i class="fas fa-times"></i>
        </button>
      </div>
  
      <!-- Portion Size -->
      <div class="mb-4">
        <label for="portionSize" class="block text-gray-700">Portion Size</label>
        <input 
          type="text" 
          id="portionSize" 
          v-model="portionSize" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>
  
      <!-- Meal Type -->
      <div class="mb-4">
        <label for="mealType" class="block text-gray-700">Meal Type</label>
        <select 
          id="mealType" 
          v-model="mealType" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Other">Other</option>
        </select>
      </div>
  
      <!-- Save Button -->
      <div class="flex justify-end">
        <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mealData: {
    type: Object,
    required: true
  }
});

console.log("meal data popup: ",props.mealData)
const emit = defineEmits(['close', 'save']);

const portionSize = ref(props.mealData?.portion || 1);
const mealType = ref(props.mealData?.type || 'breakfast');

watch(() => props.mealData, (newMealData) => {
  if (!newMealData || !newMealData.id) {
    console.warn("Invalid meal data received:", newMealData);
  } else {
    portionSize.value = newMealData.portion || 1;
    mealType.value = newMealData.type || 'breakfast';
    console.log('Portion Size updated to:', portionSize.value);
    console.log('Meal Type updated to:', mealType.value);
  }
}, { immediate: true });


const closePopup = () => {
  emit('close');
};

const saveChanges = () => {
  const updatedMealInfo = {
    ...props.mealData,  // Keep other properties from mealData
    portionSize: portionSize.value,
    mealType: mealType.value
  };
  emit('save', updatedMealInfo);
  closePopup();
};


</script>

  
  <style scoped>
  .edit-meal-popup {
    width: 300px;
    background-color: #FFFEF1;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
  }
  </style>
  