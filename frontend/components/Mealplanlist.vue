<template>
  <div class="meal-list">
    <!-- Card Container with dynamic background color based on day type -->
    <div :class="['card-container', { 'prev-list': isPast, 'today-list': isToday, 'future-list': isFuture }]" class="p-4 rounded-xl shadow-md mb-3 border border-opacity-30">
      <!-- Clickable Header Section -->
      <div @click="toggleExpand" class="card-header flex justify-between items-center relative cursor-pointer py-2 px-2">
        <!-- Title and meal count -->
        <div class="flex items-center relative">
          <h3 class="text-sm font-semibold text-gray-800">{{ title }}</h3>
          <span v-if="itemsCount > 0" class="meal-count-badge">{{ itemsCount }}</span>
        </div>

        <!-- Chevron icon on the right -->
        <div :class="{'rotate-90': isExpanded}" class="p-1">
          <i class="fas fa-chevron-right text-custom-green"></i>
        </div>
      </div>

      <!-- Expanded Content (Scrollable meal list) -->
      <transition name="expand">
        <div v-if="isExpanded" class="meal-items-container mt-3" :key="title">
          <!-- Add Meal button - always reserve space for consistent layout -->
          <div v-if="!isPast" class="button-container">
            <button 
              class="add-dishes-button" 
              :class="{ 'disabled-button': isTooFarInFuture }"
              :disabled="isTooFarInFuture"
              @click="onAddDishes">
              <i class="fas fa-plus mr-2"></i>
              <span v-if="!isTooFarInFuture">Add Meal</span>
              <span v-else>Too Far Ahead</span>
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
import { ref, computed, onMounted } from 'vue';

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

// Force expanded state on mobile
onMounted(() => {
  // Ensure sections are expanded on mount, especially on mobile
  isExpanded.value = true;
});

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
  overflow: hidden; /* Changed from visible to hidden to prevent content overflow */
  position: relative; /* Ensure proper positioning context */
  width: 100%; /* Ensure consistent width */
  box-sizing: border-box; /* Include padding and border in width */
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

.text-custom-green {
  color: #015B59;
}

.meal-count-badge {
  position: absolute;
  top: -8px;
  right: -16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #015B59 0%, #068D8A 100%);
  color: white;
  font-size: 0.55rem;
  font-weight: 700;
  border-radius: 50%;
  min-width: 16px;
  text-align: center;
  line-height: 1;
  box-shadow: 
    0 2px 8px rgba(1, 91, 89, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.meal-count-badge:hover {
  transform: scale(1.1);
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px; /* Allow enough space for content */
  opacity: 1;
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
  box-sizing: border-box; /* Include padding in width */
  min-width: 0; /* Allow button to shrink if needed */
}

.add-dishes-button:hover:not(:disabled) {
  background-color: #6d8b71;
}

.disabled-button {
  background-color: rgba(176, 172, 165, 0.5) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

.disabled-button:hover {
  background-color: rgba(176, 172, 165, 0.5) !important;
}

/* MAIN ADDITION FOR SCROLLABLE LIST */
/* Scrollable Meal Items Container */
.meal-items-container {
  max-height: none; /* Remove height limit to use available space */
  padding: 8px;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  position: relative;
  flex: 1; /* Take up available space */
  width: 100%; /* Ensure consistent width */
  box-sizing: border-box; /* Include padding in width */
}

/* Completely Hidden Scrollbars */
.meal-items-container {
  /* Hide scrollbars completely while keeping functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.meal-items-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* Scroll Fade Indicators */
.meal-items-container::before,
.meal-items-container::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  height: 12px;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.meal-items-container::before {
  top: 8px;
  background: linear-gradient(to bottom, rgba(243, 234, 218, 0.9), transparent);
}

.meal-items-container::after {
  bottom: 8px;
  background: linear-gradient(to top, rgba(243, 234, 218, 0.9), transparent);
}

/* Show fade indicators when content is scrollable */
.meal-items-container:hover::before,
.meal-items-container:hover::after {
  opacity: 1;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .card-container {
    padding: 0.6rem;
    margin-bottom: 0.8rem;
    min-height: auto; /* Ensure container can expand */
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
    max-height: none; /* Remove height limit on mobile */
    min-height: 50px; /* Ensure minimum visible height */
    overflow-y: auto;
    flex: 1; /* Take available space on mobile */
    display: block; /* Ensure visibility */
  }

  /* Keep scrollbars hidden on mobile too */
  .meal-items-container::-webkit-scrollbar {
    display: none;
  }

  /* Adjust fade indicators for mobile */
  .meal-items-container::before,
  .meal-items-container::after {
    left: 4px;
    right: 4px;
    height: 8px;
  }

  /* Ensure expanded content is visible on mobile */
  .expand-enter-active,
  .expand-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .expand-enter-from,
  .expand-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  .expand-enter-to,
  .expand-leave-from {
    max-height: 500px; /* Allow enough space for content */
    opacity: 1;
  }

  /* Force visibility of meal content on mobile */
  .meal-items-container {
    display: block !important;
    visibility: visible !important;
    height: auto !important;
  }

  /* Ensure buttons are visible */
  .add-dishes-button {
    display: block !important;
    visibility: visible !important;
  }
}
</style>
