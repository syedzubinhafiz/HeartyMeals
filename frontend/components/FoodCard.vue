<template>
  <div class="food-card flex items-center p-3 rounded-lg shadow-md relative" :class="{ 'consumed': is_consumed, 'planned': !is_consumed }">
    <!-- Enhanced Status Badge -->
    <div v-if="is_consumed" class="status-badge consumed-badge">
      <span class="text-white font-bold">✓</span>
    </div>
    <div v-else class="status-badge planned-badge">
      <span class="text-white font-bold">⏰</span>
    </div>

    <!-- Food Image -->
    <img :src="getRecipeImage()" alt="Meal Image" class="food-image rounded-lg shadow-sm" :class="{ 'consumed-image': is_consumed }" />

    <!-- Food Name -->
    <div class="ml-4 flex-1">
      <h3 class="text-lg font-semibold" :class="is_consumed ? 'text-gray-600' : 'text-gray-800'">{{ cardInfo.recipe.name }}</h3>
      <!-- Status text indicator -->
      <p class="text-sm mt-1 font-medium" :class="is_consumed ? 'text-green-600' : 'text-orange-600'">
        <span class="mr-1">{{ is_consumed ? '✅' : '⏰' }}</span>
        {{ is_consumed ? 'Consumed' : 'Planned' }}
      </p>
    </div>

    <!-- More Options Icon -->
    <div v-if="!is_consumed" class="ml-auto" @click="selectMeal">
      <!-- Font Awesome 6 vertical ellipsis icon -->
      <i class="fas fa-ellipsis-vertical text-gray-600"></i>
    </div>

    <FoodCardNutrients 
        v-if="showMiniCard" 
        :nutritionInfo="cardInfo.recipe.nutrition_info"
        :visible="showMiniCard" 
        :showButtons="isToday"  
        :isConsumed="is_consumed"
        @close="toggleMiniCard" 
        @remove="removeMeal" 
        @editMeal="$emit('editMeal', $event)"
        @consumeMeal="toggleConsumed" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';

const props = defineProps({
  cardInfo: {
    type: Object,
    required: true
  },
  isToday: {
    type: Boolean,
    required: true
  },
  dateStr: {
    type: String,
    default: useDate().getFormattedDateLong()
  }
});
const is_consumed = ref(props.cardInfo.is_consumed);

onMounted(() => {
  is_consumed.value = props.cardInfo.is_consumed
  console.log(props.cardInfo.is_consumed)
})

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
    "mealDate": props.cardInfo.created_at.split('T')[0],
    "userLocalDate": useDate().getFormattedDateShort(),
    "timeZone": "Asia/Kuala_Lumpur",
    "mealLoggingId": props.cardInfo.id,
    "mealType": props.cardInfo.type
  });
  console.log(result);
  emit('removeMeal');
};

const toggleConsumed = async () => {
  const results = await useApi("/meal-logging/mark_consume","POST",  {
	"dateTime": props.dateStr,
	"timeZone": "Asia/Kuala_lumpur",
	"mealLoggingId": props.cardInfo.id
  })
  console.log(results)
  if (!results.isError) {
    is_consumed.value = true;
    useToast().success("Meal marked as consumed");
  } else {
    useToast().error("Meal consumption failed!");
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
</script>

<style scoped>
.food-card {
  background-color: #F3EADA; /* Use your preferred background color */
  position: relative; /* Ensure the position is relative so that the child absolute element is positioned relative to this parent */
  transition: all 0.2s ease;
  overflow: visible;
}

/* Enhanced styling for consumed meals */
.food-card.consumed {
  background-color: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
}

/* Enhanced styling for planned meals */
.food-card.planned {
  background-color: rgba(251, 146, 60, 0.1);
  border: 2px solid rgba(251, 146, 60, 0.3);
}

.food-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  transition: all 0.2s ease;
}

.consumed-image {
  opacity: 0.7;
  filter: grayscale(20%);
}

.food-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Add a hover effect */
  transform: translateY(-1px);
}

/* Status Badge Styles */
.status-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.status-badge span {
  line-height: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 0.75rem;
  margin: 0;
  padding: 0;
}

.consumed-badge {
  background-color: #22c55e;
}

.planned-badge {
  background-color: #f59e0b;
}
</style>
