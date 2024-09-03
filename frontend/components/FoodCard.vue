<template>
  <div class="food-card flex items-center p-3 rounded-lg shadow-md relative">
    <!-- Food Image -->
    <img :src="cardInfo.image" alt="Meal Image" class="food-image rounded-lg shadow-sm" />

    <!-- Food Name -->
    <div class="ml-4 flex-1">
      <h3 class="text-lg font-semibold">{{ cardInfo.name }}</h3>
    </div>

    <!-- More Options Icon -->
    <div class="ml-auto" @click="toggleMiniCard">
      <i class="fas fa-ellipsis-v text-gray-600"></i>
    </div>

    <FoodCardNutrients 
    v-if="showMiniCard" 
    :visible="showMiniCard" 
    @close="toggleMiniCard" 
    @remove="removeMeal(cardInfo.mealLoggingId, cardInfo.mealDate, cardInfo.mealType)"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  cardInfo: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['removeMeal']);

const showMiniCard = ref(false);

const toggleMiniCard = () => {
  showMiniCard.value = !showMiniCard.value;
};

const removeMeal = async (mealLoggingId, mealDate, mealType) => {
  try {
    const response = await fetch('/api/meal-logging/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`, // Replace with actual token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mealDate: mealDate,
        mealLoggingId: mealLoggingId,
        mealType: mealType
      })
    });

    if (!response.ok) throw new Error('Failed to delete meal');

    // Handle success - for example, update the UI to remove the meal
  } catch (error) {
    console.error('Error deleting meal:', error);
  }
};
</script>

<style scoped>
.food-card {
  background-color: #F3EADA; /* Use your preferred background color */
  position: relative; /* Ensure the position is relative so that the child absolute element is positioned relative to this parent */
}

.food-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.food-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Add a hover effect */
}
</style>
