<template>
    <div class="card">
        <div class="image-container">
      <img class="img" :src="imageSrc" alt="Meal Image" />
    </div>
      <div class="content">
        <h1 class="meal-name">{{ mealName }}</h1>
        <p class="meal-description">{{ mealDescription }}</p>
        <div class="labels">
          <button
            v-for="label in labels"
            :key="label.name"
            :class="['label', { active: label.active }]"
            @click="toggleLabel(label)"
          >
            {{ label.name }}
          </button>
        </div>
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
      required: true, // Ensure you pass the image source when using this component
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
    display: flex;
    width: 571px;
    height:175px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index:3
  }
  
  .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures labels stay inside */
}
  
  .meal-name {
    padding-top:10px;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    color:#000000
  }
  
  .meal-description {
  font-size: 1rem;
  color: #000000;
  margin: 10px 0;
  overflow-wrap: break-word; /* Prevents text from overflowing the card */
}
  
  .labels {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
  flex-wrap: nowrap; /* Prevents wrapping */
  padding-right: 10px; /* Reduce excess padding */
  justify-content: flex-start; /* Aligns items at the start */
}

  
  .label {
    border: 2px solid #004d40;
    padding: 3px 8px;
    border-radius: 20px;
    background-color: #ffffff;
    color: #004d40;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .label.active {
    background-color: #004d40;
    color: #ffffff;
  }
  </style>
  