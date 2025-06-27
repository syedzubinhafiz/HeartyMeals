<template>
  <div class="meal-list">
    <!-- Card Container with dynamic background color based on day type -->
    <div :class="['card-container', { 'prev-list': isPast, 'today-list': isToday, 'future-list': isFuture }]" class="p-4 rounded-xl shadow-md mb-3 border border-opacity-30">
      <!-- Clickable Header Section -->
      <div @click="toggleExpand" class="card-header flex justify-between items-center relative cursor-pointer py-2 px-2">
        <!-- Title and meal count -->
        <div class="flex items-center">
          <h3 class="text-sm font-semibold text-gray-800">{{ title }}</h3>
          <span v-if="itemsCount > 0" class="ml-1 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full text-xs">{{ itemsCount }}</span>
        </div>

        <!-- Chevron icon on the right -->
        <div :class="{'rotate-90': isExpanded}" class="p-1">
          <i class="fas fa-chevron-right text-gray-600"></i>
        </div>
      </div>

      <!-- Expanded Content (Scrollable meal list) -->
      <transition name="expand">
        <div v-if="isExpanded" class="meal-items-container mt-3">
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
    default: useDate().getFormattedDateLong(),
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

const onAddDishes = async () => {
  const currentDate =  new Date(props.isoDate);
  console.log(currentDate);
  console.log(props.isoDate);
  localStorage.setItem("mealInfo", JSON.stringify({
    logType: "planning",
    logDate: formatDate(currentDate),
    mealType: props.title,
    expiryTime: new Date().getTime().toLocaleString() + (5*60*1000),
  }));
  await navigateTo('/add-meals')
};
</script>

<style scoped>
.card-container {
  background-color: #F3EADA;
  transition: all 0.3s ease;
  border-color: rgba(139, 107, 85, 0.3);
}

.prev-list {
  background-color: rgba(176, 172, 165, 1);
  border-color: rgba(111, 111, 111, 0.3);
}

.today-list {
  background-color: rgba(1, 91, 89, 0.1);
  border-color: rgba(1, 91, 89, 0.3);
}

.future-list {
  background-color: #F3EADA;
  border-color: rgba(139, 107, 85, 0.3);
}

.card-header {
  position: relative;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
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
  padding: 12px 30px;
  border: none;
  border-radius: 14px;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  margin-top: 4px;
  margin-bottom: 12px;
}

.add-dishes-button:hover {
  background-color: #6d8b71;
}

/* MAIN ADDITION FOR SCROLLABLE LIST */
/* Scrollable Meal Items Container */
.meal-items-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 2px 0;
}

/* Custom scrollbar styling */
.meal-items-container::-webkit-scrollbar {
  width: 6px;
}

.meal-items-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.meal-items-container::-webkit-scrollbar-track {
  background-color: #e0e0e0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .card-container {
    padding: 0.6rem;
    margin-bottom: 0.8rem;
  }

  .card-header h3 {
    font-size: 1rem;
  }

  .card-header span {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  .add-dishes-button {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .meal-items-container {
    max-height: 220px;
  }
}
</style>
