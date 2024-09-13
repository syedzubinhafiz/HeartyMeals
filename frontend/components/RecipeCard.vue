<template>
  <div class="card" @click="$emit('openOverlay','meal')">
    <!-- Only show this section if the recipe is admin approved -->
    <div v-if="isAdminApproved" class="top-right">
      <img 
        src="/assets/img/checkMark.svg" 
        alt="Info Icon" 
        class="info-icon" 
        @mouseover.stop="showTooltip = true" 
        @mouseleave.stop="showTooltip = false"
        @click.stop
      />
      <div v-if="showTooltip" class="tooltip">
        <p v-if="isAdminApproved">Approved by Admin</p>
      </div>
    </div>
    <div class="top-section">
      <div class="image-container">
        <img :src="imageSrc" alt="Meal Image" class="img" />
        <!-- Move the custom tag inside the image-container -->
        <div v-if="isCustomRecipe" class="custom-tag">
          CUSTOM
        </div>
      </div>  
      <div class="content">
        <h3 class="meal-name">{{ mealName }}</h3>
        <p class="meal-description">{{ mealDescription }}</p>
      </div>
    </div>  
    <!-- Labels are now in a separate div below the top section -->
    <div class="labels">
      <span
        v-for="(label, index) in Object.keys(labels)"
        :key="index"
        class="label"
        :class="{ active: labels[label] }"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
const showTooltip = ref(false)
const props = defineProps({
    mealName: {
      type: String,
      required: true,
    },
    mealDescription: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    labels: {
      type: Object,
      required: true,
      default: {Breakfast: true, Lunch: false, Dinner: false, Snack: true},
    },
    isCustomRecipe: {
      type: Boolean,
      default: false, // Set this to true when it's a custom recipe by the user
    },
    isAdminApproved: {
      type: Boolean,
      default: false, // Set this to true when the admin approves the recipe
    },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap');

.card {
  font-family: 'Source Code Pro', monospace;
  background-color: #f8f8f8;
  border-radius: 15px;
  width: 100%;
  max-width: 571px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  box-sizing: border-box;
  position:relative;
}

.top-section {
  display: flex;
  align-items: flex-start; /* Ensures content is aligned with the image */
  margin-bottom: 10px;
}

.image-container {
  flex-shrink: 0;
  width: 90px;
  padding: 2px;
  position:relative;
}

.img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.content {
  flex: 1;
  margin-left: 20px;
}

.meal-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-description {
  font-size: 0.8rem;
  color: #004d40;
  margin: 5px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.labels {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.label {
  border: 2px solid #004d40;
  padding: 3px 8px;
  border-radius: 20px;
  background-color: #ffffff;
  color: #004d40;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.label.active {
  background-color: #004d40;
  color: #ffffff;
}
.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.info-icon {
  color: #ffffff;
  border-radius: 10%;
  cursor: pointer;
  width: 20px; /* Adjust these to make it smaller */
  height: 20px;
}

.tooltip {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #004d40;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
}
.custom-tag {
  position: absolute;
  bottom: 62px;
  right: 35px;
  transform: rotate(-40deg); /* Tilt effect */
  background-color: #004d40;
  color: #fff;
  padding: 5px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 3px;
  z-index: 10;
  border: 2px solid #fff;
}
</style>
