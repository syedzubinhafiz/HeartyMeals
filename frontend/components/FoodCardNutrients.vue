<template>
  <!-- Modal Overlay -->
  <div v-if="visible" class="modal-overlay" @click.self="closeCard">
    <div class="modal-content" @click.stop>

    <!-- Nutrition Info Grid -->
    <div class="nutrition-grid mb-3">
      <div class="nutrition-item">
        <img src="/assets/img/carbIcon.png" alt="Carbs" class="icon-style">
        <span class="nutrition-value">{{ Math.round(nutritionInfo.totalCarbohydrate) }}g</span>
      </div>
      <div class="nutrition-item">
        <img src="/assets/img/cholesterolsIcon.png" alt="Cholesterol" class="icon-style">
        <span class="nutrition-value">{{ Math.round(nutritionInfo.cholesterol) }}mg</span>
      </div>
      <div class="nutrition-item">
        <img src="/assets/img/proteinIcon.png" alt="Protein" class="icon-style">
        <span class="nutrition-value">{{ Math.round(nutritionInfo.protein) }}g</span>
      </div>
      <div class="nutrition-item">
        <img src="/assets/img/sodiumIcon.png" alt="Sodium" class="icon-style">
        <span class="nutrition-value">{{ Math.round(nutritionInfo.dietaryFiber) }}g</span>
      </div>
      <div class="nutrition-item">
        <img src="/assets/img/fatsIcon.png" alt="Fat" class="icon-style">
        <span class="nutrition-value">{{ Math.round(nutritionInfo.fat) }}g</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="showButtons" class="button-container">
      <div v-if="!isConsumed" class="flex gap-2 mb-2">
        <button class="action-btn remove-btn" @click="removeFood">Remove</button>
        <button class="action-btn edit-btn" @click="emitEditMeal">Edit</button>
      </div>
      <button
        class="consume-btn"
        :class="isConsumed ? 'consumed' : 'ready'"
        @click="consumeMeal"
      >
        {{ isConsumed ? 'Consumed' : 'Consume Now' }}
      </button>
    </div>

      <!-- Close button -->
      <button class="close-btn" @click.stop="closeCard">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  nutritionInfo: {
    type: Object,
    required: true
  },
  showButtons: {
    type: Boolean,
    default: true
  },
  isConsumed: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close', 'remove', 'editMeal', 'consumeMeal']);

// Prevent body scroll when modal is open
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const emitEditMeal = () => {
  emit('editMeal');
};

const closeCard = (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  console.log('Close card called');
  emit('close');
};

const removeFood = () => {
  emit('remove');
  closeCard();
};

const consumeMeal = () => {
  emit('consumeMeal');
};

// Modal doesn't need positioning logic anymore
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

/* Modal Content */
.modal-content {
  background-color: #FFFEF1;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid rgba(139, 107, 85, 0.2);
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: modalAppear 0.2s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 15px;
  }
  
  .modal-content {
    padding: 20px;
    max-width: none;
  }
  
  .nutrition-value {
    font-size: 0.85rem;
  }
  
  .action-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .consume-btn {
    padding: 12px;
    font-size: 1rem;
  }
}

.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.nutrition-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(243, 234, 218, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(139, 107, 85, 0.2);
}

.nutrition-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.icon-style {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.button-container {
  margin-top: 0;
}

.action-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn {
  background-color: #e53e3e;
  color: white;
}

.remove-btn:hover {
  background-color: #c53030;
}

.edit-btn {
  background-color: #b59f89;
  color: white;
}

.edit-btn:hover {
  background-color: #a08b73;
}

.consume-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.consume-btn.ready {
  background-color: #68D391;
  color: white;
}

.consume-btn.ready:hover {
  background-color: #48bb78;
}

.consume-btn.consumed {
  background-color: #A0AEC0;
  color: #4a5568;
  cursor: not-allowed;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(113, 128, 150, 0.1);
  border: none;
  font-size: 1.2rem;
  color: #718096;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(113, 128, 150, 0.2);
  color: #4a5568;
  transform: scale(1.1);
}
</style>
