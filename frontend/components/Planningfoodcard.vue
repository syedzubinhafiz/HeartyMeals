<template>
  <div class="food-card flex items-center p-3 rounded-lg shadow-md relative" :class="{ 'consumed': is_consumed }">
    <!-- Food Image -->
    <img :src="getRecipeImage()" alt="Meal Image" class="food-image rounded-lg shadow-sm" :class="{ 'consumed-image': is_consumed }" />

    <!-- Food Name -->
    <div class="ml-2 flex-1">
      <h3 class="text-xs font-medium leading-tight" :class="is_consumed ? 'text-gray-500' : 'text-gray-800'">{{ cardInfo.recipe.name }}</h3>
      <p class="text-xs mt-0.5" :class="is_consumed ? 'text-gray-400' : 'text-gray-600'">{{ cardInfo.portion }}g</p>
      <!-- Status text indicator -->
      <p class="text-xs mt-1 font-medium" :class="is_consumed ? 'text-green-600' : 'text-orange-600'">
        {{ is_consumed ? 'Consumed' : 'Planned' }}
      </p>
    </div>

    <!-- More Options Icon -->
    <div class="ml-auto p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer" @click.stop="selectMeal">
      <i class="fas fa-ellipsis-vertical text-gray-600 text-sm"></i>
    </div>
  </div>

  <!-- Use shared MealPopover component -->
  <MealPopover
    :visible="showMiniCard"
    :mealInfo="cardInfo"
    :mealLogTime="getCurrentDate()"
    @update:visible="showMiniCard = $event"
    @consume="handleConsume"
    @edit="handleEdit"
    @remove="handleRemove"
  />
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useDate } from '@/composables/date.js';
import MealPopover from '~/components/MealPopover.vue';

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

const selectMeal = (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log('Meal selected:', props.cardInfo);
  showMiniCard.value = true;
};

const getCurrentDate = () => {
  return new Date(); // Returns the current date for the MealPopover
};

const handleConsume = async (id) => {
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
    
    // Emit event to notify parent components that nutrition data needs refresh
    emit('mealConsumed', props.cardInfo.id);
  } else {
    useToast().error('Meal consumption failed');
  }
};

const handleEdit = () => {
  emit('editMeal', props.cardInfo);
};

const handleRemove = async () => {
  let result = await useApi("/meal-logging/delete", "DELETE", {
    "mealDate": props.cardInfo.created_at,
    "mealLoggingId": props.cardInfo.id,
    "mealType": props.cardInfo.type
  });
  console.log(result);
  emit('removeMeal');
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
</script>

<style scoped>
.food-card {
  background-color: rgba(218, 194, 168, 0.5);
  margin: 8px 6px;
  border: 1px solid rgba(218, 194, 168, 0.8);
  position: relative;
  transition: all 0.2s ease;
  overflow: visible;
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
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.4);
  opacity: 0.85;
}

/* Planned items styling */
.food-card:not(.consumed) {
  background-color: rgba(251, 146, 60, 0.1);
  border-color: rgba(251, 146, 60, 0.4);
}

.consumed-image {
  opacity: 0.7;
  filter: grayscale(20%);
}

/* Status text styling - badges removed */
</style>
