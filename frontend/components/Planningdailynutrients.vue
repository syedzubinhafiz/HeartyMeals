<template>
  <div v-if="visible" class="mini-card bg-custom-bg-light p-4 rounded-lg shadow-lg absolute z-50" :style="customStyle">
    <div class="flex justify-between mb-2">
      <div>
        <div class="flex items-center mb-1">
          <img src="/assets/img/carbIcon.png" alt="Carbs Icon" class="icon-style">
          <span class="ml-2">{{ Math.round(nutritionInfo.totalCarbohydrate) }}g</span>
        </div>
        <div class="flex items-center mb-1">
          <img src="/assets/img/proteinIcon.png" alt="Protein Icon" class="icon-style">
          <span class="ml-2">{{ Math.round(nutritionInfo.protein) }}g</span>
        </div>
        <div class="flex items-center mb-1">
          <img src="/assets/img/fatsIcon.png" alt="Fat Icon" class="icon-style">
          <span class="ml-2">{{ Math.round(nutritionInfo.fat) }}g</span>
        </div>
      </div>
      <div>
        <div class="flex items-center mb-1">
          <img src="/assets/img/cholesterolsIcon.png" alt="Cholesterol Icon" class="icon-style">
          <span class="ml-2">{{ Math.round(nutritionInfo.cholesterol) }}mg</span>
        </div>
        <div class="flex items-center mb-1">
          <img src="/assets/img/sodiumIcon.png" alt="Sodium Icon" class="icon-style">
          <span class="ml-2">{{ Math.round(nutritionInfo.dietaryFiber) }}g</span>
        </div>
      </div>
    </div>

    <!-- Conditionally render buttons -->
    <div v-if="showButtons" class="flex justify-between">
      <button class="p-2 rounded-lg w-1/2 mr-2" @click="removeFood">Remove</button>
      <button class="p-2 rounded-lg w-1/2" @click="emitEditMeal">Edit</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  nutritionInfo: Object,
  showButtons: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'remove', 'editMeal']);

const removeFood = () => {
  emit('remove');
};

const emitEditMeal = () => {
  emit('editMeal');
};
</script>

<style scoped>
.mini-card {
  background-color: #FFFEF1;
  width: 200px;
}

.icon-style {
  width: 20px;
  height: 20px;
}
</style>
