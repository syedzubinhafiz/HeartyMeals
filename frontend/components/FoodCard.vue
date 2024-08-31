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

    <FoodCardNutrients v-if="showMiniCard" :visible="showMiniCard" @close="toggleMiniCard" />
  </div>
</template>

<script setup>
const props = defineProps({
  cardInfo: {
    type: Object,
    required: true
  }
});

const showMiniCard = ref(false);

const toggleMiniCard = () => {
  showMiniCard.value = !showMiniCard.value;
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
