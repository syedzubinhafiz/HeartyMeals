<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div>
    <!-- Card Container with dynamic background color based on day type -->
    <div :class="['card-container', { 'prev-list': isPast, 'today-list': isToday, 'future-list': isFuture }]" class="p-1 rounded-lg shadow-md mb-2">
      <!-- Clickable Header Section -->
      <div @click="toggleExpand" class="card-header flex justify-center items-center relative cursor-pointer">
        <!-- Title in the center -->
        <h3 class="text-lg">{{ title }}</h3>

        <!-- Chevron icon on the right -->
        <div :class="{'rotate-90': isExpanded}" class="absolute right-0">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <!-- Expanded Content (by default expanded) -->
      <transition name="expand">
        <div v-if="isExpanded" class="mt-1">
          <!-- Add Meal button right below the title -->
          <div class="button-container">
            <nuxt-link :to="{ path: '/add-meals', query: { mealType: title } }">
              <button class="add-dishes-button">
                <i class="fas fa-plus mr-2"></i>Add Meal
              </button>
            </nuxt-link>
          </div>

          <!-- Slot for other content like meal cards -->
          <slot></slot>
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
    required: true,
  },
  itemsCount: {
    type: Number,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  isPast: Boolean,
  isToday: Boolean,
  isFuture: Boolean
});

console.log(props.isPast)
// Set the section to be expanded by default
const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.card-container {
  background-color: #F3EADA; /* Default beige color */
  transition: all 0.3s ease;
}

/* Dynamic background for different day types */
.prev-list {
  background-color: rgba(176, 172, 165, 1)
  /* Grayish for past days */
}

.today-list, .future-list {
  background-color: #F3EADA; /* Beige for today and future days */
}

.card-header {
  padding: 10px 0;
  position: relative; /* Required for absolutely positioning the chevron */
  width: 100%; /* Ensures full width for proper centering */
}

.fas {
  font-size: 1rem;
  color: #fff;
  transition: transform 0.2s ease;
}

/* Add margin to the chevron icon */
.absolute.right-0 {
  margin-right: 10px; /* Increase space between icon and container edge */
  padding: 5px;
}

/* Rotation for the arrow when expanded */
.rotate-90 {
  transform: rotate(90deg);
}

/* Transition for expanding and collapsing */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.2s ease;
}

.expand-enter,
.expand-leave-to {
  max-height: 0;
  overflow: hidden;
}

/* Button container to center the button */
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Green button styling */
.add-dishes-button {
  background-color: rgba(135, 169, 141, 0.8);
  color: white;
  padding: 5px 30px;
  border: none;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  margin-top: 0px;
  margin-bottom: 3px;
}

.add-dishes-button:hover {
  background-color: #6d8b71;
}
</style>
