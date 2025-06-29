<template>
  <div>
    <div class="food-card flex items-center p-3 rounded-lg shadow-md relative" :class="{ 'consumed': is_consumed }">
      <!-- Food Image -->
      <img :src="getRecipeImage()" alt="Meal Image" class="food-image rounded-lg shadow-sm" :class="{ 'consumed-image': is_consumed }" />

      <!-- Food Name -->
      <div class="ml-2 flex-1">
        <h3 class="text-xs font-medium leading-tight" :class="is_consumed ? 'text-gray-500' : 'text-gray-800'">{{ cardInfo.recipe.name }}</h3>
        <p class="text-xs mt-0.5" :class="is_consumed ? 'text-gray-400' : 'text-gray-600'">{{ cardInfo.portion }}g</p>
      </div>

      <!-- More Options Icon -->
      <div class="ml-auto p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer" @click.stop="selectMeal">
        <i class="fas fa-ellipsis-vertical text-gray-600 text-sm"></i>
      </div>
    </div>

    <!-- Elegant Floating Popover - MOVED OUTSIDE -->
    <div v-if="showMiniCard" class="meal-popover-overlay fixed inset-0 z-50 flex items-center justify-center p-4" @click="handleOverlayClick">
      <div class="meal-popover bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4 transform transition-all duration-200 scale-100" @click.stop>
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ cardInfo.recipe.name }}</h3>
              <p class="text-sm text-gray-500">{{ cardInfo.portion }}g portion</p>
            </div>
            <button @click="closeMiniCard" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  <p class="text-sm font-semibold text-gray-900">{{ Math.round(cardInfo.recipe.nutrition_info.totalCarbohydrate) }}g</p>
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
                  <p class="text-sm font-semibold text-gray-900">{{ Math.round(cardInfo.recipe.nutrition_info.protein) }}g</p>
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
                  <p class="text-sm font-semibold text-gray-900">{{ Math.round(cardInfo.recipe.nutrition_info.fat) }}g</p>
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
                  <p class="text-sm font-semibold text-gray-900">{{ Math.round(cardInfo.recipe.nutrition_info.cholesterol) }}mg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div v-if="isToday && !is_consumed" class="p-6 pt-0">
          <div class="space-y-3">
            <button @click="$emit('editMeal', $event); closeMiniCard()" class="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
              <i class="fas fa-edit mr-2"></i>
              Edit Meal
            </button>
            <div class="flex space-x-3">
              <button @click="removeMeal; closeMiniCard()" class="flex-1 flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
                <i class="fas fa-trash mr-2"></i>
                Remove
              </button>
              <button v-if="!is_consumed" @click="toggleConsumed" class="flex-1 flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-medium">
                <i class="fas fa-check mr-2"></i>
                Consume
              </button>
            </div>
          </div>
        </div>
        
        <!-- Consumed Status -->
        <div v-if="is_consumed" class="px-6 pb-6">
          <div class="bg-gray-100 text-gray-600 text-center py-3 rounded-lg font-medium">
            Consumed
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useDate } from '@/composables/date.js';

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

const emit = defineEmits(['removeMeal', 'editMeal', 'mealConsumed']);

const showMiniCard = ref(false);
const is_consumed = ref(props.cardInfo.is_consumed);
const isProcessing = ref(false);

const openMiniCard = () => {
  if (isProcessing.value) return;
  console.log('Opening mini card');
  showMiniCard.value = true;
};

const closeMiniCard = () => {
  console.log('Closing mini card');
  isProcessing.value = true;
  showMiniCard.value = false;
  setTimeout(() => {
    isProcessing.value = false;
  }, 200);
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeMiniCard();
  }
};

const selectMeal = (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log('Meal selected:', props.cardInfo);
  openMiniCard();
};

const removeMeal = async () => {
  let result = await useApi("/meal-logging/delete", "DELETE", {
    "mealDate": props.cardInfo.created_at,
    "mealLoggingId": props.cardInfo.id,
    "mealType": props.cardInfo.type
  });
  console.log(result);
  emit('removeMeal');
};

const toggleConsumed = async () => {
  if (is_consumed.value) return; // already consumed

  const results = await useApi('/meal-logging/mark_consume', 'POST', {
    dateTime: useDate().getFormattedDateLong(),
    timeZone: 'Asia/Kuala_Lumpur',
    mealLoggingId: props.cardInfo.id,
  });
  
  console.log('Mark consumed API response:', results);

  if (!results.isError) {
    is_consumed.value = true;
    useToast().success('Meal marked as consumed');
    closeMiniCard();
    
    // Emit event to notify parent components that nutrition data needs refresh
    emit('mealConsumed', props.cardInfo.id);
  } else {
    useToast().error('Meal consumption failed');
  }
};

const getRecipeImage = () => {
  // Try to get image from recipe storage_links, fallback to default
  const storageLinks = props.cardInfo?.recipe?.storage_links;
  if (storageLinks?.image) {
    return storageLinks.image;
  }
  if (storageLinks?.thumbnail) {
    return storageLinks.thumbnail;
  }
  // Fallback to default image
  return '/assets/img/potato.svg';
};

// No need for document click listener since we use @click.self on overlay
</script>


<style scoped>
.food-card {
  background-color: rgba(218, 194, 168, 0.5);
  margin: 8px 6px;
  border: 1px solid rgba(218, 194, 168, 0.8);
  position: relative;
  transition: all 0.2s ease;
}

.food-image {
  width: 35px;
  height: 35px;
  object-fit: cover;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .food-image {
    width: 38px;
    height: 38px;
  }

  .food-card {
    padding: 0.6rem;
    margin: 6px 8px;
  }

  .food-card h3 {
    font-size: 0.8rem;
    line-height: 1.2;
  }

  .food-card p {
    font-size: 0.7rem;
  }
}

.food-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(218, 194, 168, 1);
  transform: translateY(-1px);
}

/* Consumed items styling */
.food-card.consumed {
  background-color: rgba(218, 194, 168, 0.3);
  border-color: rgba(34, 197, 94, 0.4);
  opacity: 0.75;
}

.consumed-image {
  opacity: 0.6;
  filter: grayscale(30%);
}

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
