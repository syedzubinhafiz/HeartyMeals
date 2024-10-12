<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
 
  <div class="meal-list">
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

      <!-- Expanded Content (Scrollable meal list) -->
      <transition name="expand">
        <div v-if="isExpanded" class="meal-items-container mt-1">
          <!-- Add Meal button only for valid dates (today or within the next 7 days) -->
          <div v-if="!isPast && !isTooFarInFuture" class="button-container">
            <button class="add-dishes-button" @click="onAddDishes">
              <i class="fas fa-plus mr-2"></i>Add Meal
            </button>
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
  isFuture: Boolean,
  isoDate: {
    type: String,
    default: (new Date()).toISOString(),
  },
});

// Calculate if the day is more than 7 days into the future
const isTooFarInFuture = computed(() => {
  const today = new Date();
  const dayToCheck = new Date(props.isoDate);
  
  // Calculate the difference in days between the current day and the given date
  const diffInDays = Math.ceil((dayToCheck - today) / (1000 * 60 * 60 * 24));
  
  return diffInDays > 7; // Return true if the date is more than 7 days in the future
});

console.log(props.isPast);
// Set the section to be expanded by default
const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const onAddDishes = () => {
  const currentDate =  new Date(props.isoDate);
  console.log(currentDate);
  console.log(props.isoDate);
  localStorage.setItem("mealInfo", JSON.stringify({
    logType: "planning",
    logDate: formatDate(currentDate),
    mealType: props.title,
    expiryTime: new Date().getTime().toLocaleString() + (5*60*1000),
  }));
  navigateTo('/add-meals')
};
</script>

<style scoped>
.card-container {
  background-color: #F3EADA;
  transition: all 0.3s ease;
}

.prev-list {
  background-color: rgba(176, 172, 165, 1);
}

.today-list,
.future-list {
  background-color: #F3EADA;
}

.card-header {
  padding: 10px 0;
  position: relative;
  width: 100%;
}

.fas {
  font-size: 1rem;
  color: #fff;
  transition: transform 0.2s ease;
}

.absolute.right-0 {
  margin-right: 10px;
  padding: 5px;
}

.rotate-90 {
  transform: rotate(90deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.2s ease;
}

.expand-enter,
.expand-leave-to {
  max-height: 0;
  overflow: hidden;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

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

/* MAIN ADDITION FOR SCROLLABLE LIST */
/* Scrollable Meal Items Container */
.meal-items-container {
  max-height: 250px; /* Set maximum height for the dropdown */
  overflow-y: auto;  /* Enable vertical scrolling */
}

/* OPTIONAL: Custom scrollbar styling */
.meal-items-container::-webkit-scrollbar {
  width: 8px;
}

.meal-items-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.meal-items-container::-webkit-scrollbar-track {
  background-color: #e0e0e0;
}
</style>
