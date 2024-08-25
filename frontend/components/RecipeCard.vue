<template>
  <div class="card" @click="$emit('openOverlay','meal')">
    <div class="top-section">
      <div class="image-container">
        <img :src="imageSrc" alt="Meal Image" class="img" />
      </div>
      <div class="content">
        <h3 class="meal-name">{{ mealName }}</h3>
        <p class="meal-description">{{ mealDescription }}</p>
      </div>
    </div>
    <!-- Labels are now in a separate div below the top section -->
    <div class="labels">
      <span
        v-for="(label, index) in labels"
        :key="index"
        class="label"
        :class="{ active: label.active }"
        @click="toggleLabel(label)"
      >
        {{ label.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
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
      type: Array,
      required: true,
      default: () => [
        { name: "Breakfast", active: false },
        { name: "Lunch", active: false },
        { name: "Dinner", active: false },
        { name: "Snack", active: false },
      ],
    },
  },
  methods: {
    toggleLabel(label) {
      label.active = !label.active;
    },
  },
};
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
</style>
