<template>
  <div class="food-card flex items-center p-3 rounded-lg shadow-md relative">
    <!-- Food Image -->
    <img :src="`/assets/img/potato.svg`" alt="Meal Image" class="food-image rounded-lg shadow-sm" />

    <!-- Food Name -->
    <div class="ml-2 flex-1">
      <h3 class="text-xs">{{ cardInfo.recipe.name }}</h3>
    </div>

    <!-- More Options Icon -->
    <div class="ml-auto" @click="selectMeal">
      <i class="fas fa-ellipsis-v text-gray-600"></i>
    </div>

    <FoodCardNutrients 
        v-if="showMiniCard" 
        :nutritionInfo="cardInfo.recipe.nutrition_info"
        :visible="showMiniCard" 
        :showButtons="isToday"  
        @close="toggleMiniCard" 
        @remove="removeMeal" 
        @editMeal="$emit('editMeal', $event)"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  cardInfo: {
    type: Object,
    required: true
  },
  isToday: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['removeMeal', 'selectMeal', 'editMeal']);

const showMiniCard = ref(false);

const toggleMiniCard = () => {
  showMiniCard.value = !showMiniCard.value;
};

const selectMeal = () => {
  toggleMiniCard();
  console.log('Meal selected:', props.cardInfo);
  emit('selectMeal', props.cardInfo); // Emit the selected meal data
};

const removeMeal = async () => {
  let result = await useApi("/meal-logging/delete", "DELETE", {
    "mealDate": props.cardInfo.created_at,
    "mealLoggingId": props.cardInfo.id,
    "mealType": props.cardInfo.type
  });
  console.log(result);
};
</script>


<style scoped>
.food-card {
  background-color: rgba(218, 194, 168, 0.5);
  margin: 5px;

  position: relative; /* Ensure the position is relative so that the child absolute element is positioned relative to this parent */
}

.food-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.food-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Add a hover effect */
}
</style>
