<template>
    <div v-if="visible" class="mini-card bg-custom-bg-light p-4 rounded-lg shadow-lg absolute z-50" :style="customStyle">
      <!-- Close Button -->

  
      <!-- Nutrient Details -->
      <div class="flex justify-between mb-2">
        <div>
          <div class="flex items-centern mb-1">
            <img src="/assets/img/carbIcon.png" alt="Carbs Icon" class="icon-style"><span class="ml-2">{{Math.round(nutritionInfo.totalCarbohydrate)}}g</span>
          </div>
          <div class="flex items-center mb-1">
            <img src="/assets/img/proteinIcon.png" alt="Protein Icon" class="icon-style"><span class="ml-2">{{Math.round(nutritionInfo.protein)}}g</span>
          </div>
          <div class="flex items-center mb-1">
            <img src="/assets/img/fatsIcon.png" alt="Fat Icon" class="icon-style"><span class="ml-2">{{Math.round(nutritionInfo.fat)}}g</span>
          </div>
        </div>
        <div>
          <div class="flex items-center mb-1">
            <img src="/assets/img/cholesterolsIcon.png" alt="Sodium Icon" class="icon-style"><span class="ml-2">{{Math.round(nutritionInfo.cholesterol)}}g</span>
          </div>
          <div class="flex items-center mb-1">
            <img src="/assets/img/sodiumIcon.png" alt="Fiber Icon" class="icon-style"><span class="ml-2">{{Math.round(nutritionInfo.dietaryFiber)}}g</span>
          </div>
        </div>
      </div>
  
      <!-- Buttons -->
      <div class="flex justify-between">
        <button class="p-2 rounded-lg w-1/2 mr-2" @click="removeFood">Remove Food</button>
        <button class="p-2 rounded-lg w-1/2">Edit Meal</button>
      </div>
    </div>
</template>

<script setup>

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  nutritionInfo: {
    type: Object,
  }
});

const emit = defineEmits(['close']);

const closeCard = () => {
  emit('close');
};

const removeFood = () => {
  emit('remove');
  closeCard();  // Optionally close the card after removing
};

// Customize position based on props or default positioning
const customStyle = ref({
  top: '100%', // Position below the food card
  right: '0', // Align to the right edge of the food card
  transform: 'translateY(10px)' // Add some spacing
});
</script>

<style scoped>

button{
    background-color: #b59f89;
    color: #fff;
}
.mini-card {
  background-color: #FFFEF1; /* Light background color for mini card */
  width: 200px; /* Adjust width as needed */
}

.mini-card .fa-times {
  font-size: 1rem;
}

.icon-style {
  width: 20px; /* Adjust the size of the icons as needed */
  height: 20px;
}
</style>
