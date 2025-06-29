<template>
  <!-- Elegant Floating Popover -->
  <div v-if="visible" class="meal-popover-overlay fixed inset-0 z-50 flex items-center justify-center p-4" @click="handleOverlayClick">
    <div class="meal-popover bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4 transform transition-all duration-200 scale-100" @click.stop>
      <!-- Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ mealInfo.recipe.name }}</h3>
            <p class="text-sm text-gray-500">{{ mealInfo.portion }}g portion</p>
          </div>
          <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i class="fas fa-times text-gray-400"></i>
          </button>
        </div>
      </div>

      <!-- Nutrition Info -->
      <div class="p-6">
        <h4 class="text-sm font-medium text-gray-700 mb-4">Nutrition Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="nutrition-item">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <img src="/assets/img/carbIcon.png" alt="Carbs" class="w-5 h-5">
              </div>
              <div>
                <p class="text-xs text-gray-500">Carbs</p>
                <p class="text-sm font-semibold text-gray-900">{{ Math.round(mealInfo.recipe.nutrition_info.totalCarbohydrate * (mealInfo.portion/mealInfo.recipe.serving_size)) }}g</p>
              </div>
            </div>
          </div>
          <div class="nutrition-item">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <img src="/assets/img/proteinIcon.png" alt="Protein" class="w-5 h-5">
              </div>
              <div>
                <p class="text-xs text-gray-500">Protein</p>
                <p class="text-sm font-semibold text-gray-900">{{ Math.round(mealInfo.recipe.nutrition_info.protein * (mealInfo.portion/mealInfo.recipe.serving_size)) }}g</p>
              </div>
            </div>
          </div>
          <div class="nutrition-item">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <img src="/assets/img/fatsIcon.png" alt="Fat" class="w-5 h-5">
              </div>
              <div>
                <p class="text-xs text-gray-500">Fat</p>
                <p class="text-sm font-semibold text-gray-900">{{ Math.round(mealInfo.recipe.nutrition_info.fat * (mealInfo.portion/mealInfo.recipe.serving_size)) }}g</p>
              </div>
            </div>
          </div>
          <div class="nutrition-item">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <img src="/assets/img/cholesterolsIcon.png" alt="Cholesterol" class="w-5 h-5">
              </div>
              <div>
                <p class="text-xs text-gray-500">Cholesterol</p>
                <p class="text-sm font-semibold text-gray-900">{{ Math.round(mealInfo.recipe.nutrition_info.cholesterol * (mealInfo.portion/mealInfo.recipe.serving_size)) }}mg</p>
              </div>
            </div>
          </div>
          <div class="nutrition-item col-span-2">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <img src="/assets/img/caloriesIcon.png" alt="Calories" class="w-5 h-5">
              </div>
              <div>
                <p class="text-xs text-gray-500">Calories</p>
                <p class="text-sm font-semibold text-gray-900">{{ Math.round(mealInfo.recipe.nutrition_info.calories * (mealInfo.portion/mealInfo.recipe.serving_size)) }} cal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div v-if="isToday && !mealInfo.is_consumed" class="p-6 pt-0">
        <div class="space-y-3">
          <button @click="editMeal" class="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
            <i class="fas fa-edit mr-2"></i>
            Edit Meal
          </button>
          <div class="flex space-x-3">
            <button @click="removeMeal" class="flex-1 flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
              <span class="text-lg mr-2">🗑️</span>
              Remove
            </button>
            <button v-if="!mealInfo.is_consumed" @click="consumeMeal" class="flex-1 flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-medium">
              <span class="text-lg mr-2">✅</span>
              Consume
            </button>
          </div>
        </div>
      </div>
      
      <!-- Consumed Status -->
      <div v-if="mealInfo.is_consumed" class="px-6 pb-6">
        <div class="bg-gray-100 text-gray-600 text-center py-3 rounded-lg font-medium">
          Consumed
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isSameDay } from 'date-fns';
import { ref, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mealInfo: {
    type: Object,
    required: true
  },
  mealLogTime: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'consume', 'edit', 'remove']);

const isToday = computed(() => {
  const today = new Date();
  return isSameDay(props.mealLogTime, today);
});

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
};

const close = () => {
  emit('update:visible', false);
};

const consumeMeal = () => {
  if (!props.mealInfo.is_consumed) {
    emit('consume', props.mealInfo.id);
    close();
  }
};

const editMeal = () => {
  emit('edit', props.mealInfo);
  close();
};

const removeMeal = () => {
  emit('remove', props.mealInfo);
  close();
};
</script>

<style scoped>
/* Elegant Popover Styles */
.meal-popover-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.meal-popover {
  animation: slideUp 0.2s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

/* Elegant Scrollbar for Modal */
.meal-popover::-webkit-scrollbar {
  width: 6px;
}

.meal-popover::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, 
    rgba(243, 234, 218, 0.1) 0%,
    rgba(243, 234, 218, 0.3) 50%,
    rgba(243, 234, 218, 0.1) 100%);
  border-radius: 10px;
  margin: 8px 0;
}

.meal-popover::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, 
    rgba(1, 91, 89, 0.6) 0%,
    rgba(1, 91, 89, 0.8) 50%,
    rgba(1, 91, 89, 0.6) 100%);
  border-radius: 10px;
  border: 1px solid rgba(1, 91, 89, 0.1);
  box-shadow: 
    0 1px 3px rgba(1, 91, 89, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.meal-popover::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, 
    rgba(1, 91, 89, 0.7) 0%,
    rgba(1, 91, 89, 0.9) 50%,
    rgba(1, 91, 89, 0.7) 100%);
  box-shadow: 
    0 2px 6px rgba(1, 91, 89, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.nutrition-item {
  transition: all 0.2s ease;
}

.nutrition-item:hover {
  transform: translateY(-1px);
}
</style> 