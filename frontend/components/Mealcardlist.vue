<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <div>
      <!-- Card Container -->
      <div class="card-container p-3 rounded-lg shadow-md mb-6">
          <!-- Clickable Header Section -->
          <div @click="toggleExpand" class="card-header flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                  <h3 class="font-bold text-lg mr-4">{{ title }}</h3>
                  <p class="text-sm text-gray-600">{{ itemsCount }} items</p>
              </div>
              <div :class="{'rotate-90': isExpanded}">
                  <!-- Arrow icon -->
                  <i class="fas fa-chevron-right"></i>
              </div>
          </div>

          <!-- Expanded Content -->
          <transition name="expand">
              <div v-if="isExpanded" class="mt-4">
                  <!-- Custom content for the expanded section will go here -->
                  <slot></slot>
                  <!-- Green Button -->
                  <button class="add-dishes-button mt-4" @click="onAddDishes">
                      <i class="fas fa-plus mr-2"></i>Add Dishes
                  </button>
              </div>
          </transition>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
      type: String,
      required: true
  },
  itemsCount: {
      type: Number,
      required: true
  },
  route: {
      type: String,
      required: true
  },
  isoDate: {
      type: String,
      default: (new Date()).toISOString()
  }
});

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const onAddDishes = () => {
  useMealLogging().unsavedMealList.value = []
  useMealLogging().mealDate.value = props.isoDate
  navigateTo(`/add-meals?mealType=${props.title}&selectedDate=${props.isoDate}`)
}
</script>

<style scoped>
.card-container {
  background-color: #F3EADA;
  transition: all 0.3s ease;
  
}

.card-header {
  padding: 10px 0; /* Add some padding to the header */
}

.fas, .icon-chevron-right {
  font-size: 1.5rem;
  color: #333;
  transition: transform 0.2s ease;
}

/* Rotation for the arrow when expanded */
.rotate-90 {
  transform: rotate(90deg);
}

/* Transition for expanding and collapsing */
.expand-enter-active, .expand-leave-active {
  transition: max-height 0.2s ease;
}
.expand-enter, .expand-leave-to {
  max-height: 0;
  overflow: hidden;
}

/* Green button styling */
.add-dishes-button {
  background-color: #87A98D;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.add-dishes-button:hover {
  background-color: #6d8b71;
}
</style>
