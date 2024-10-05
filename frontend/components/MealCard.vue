<template>
  <div class="meal-card-wrapper">
    <div class="p-6 rounded-lg w-72 flex-shrink-0 flex flex-col items-center justify-between transition-all duration-300">
      <div class="relative w-full">
        <!-- Image, positioned absolutely to not affect layout -->
        <img :src="cardInfo.image" alt="Meal Image" class="absolute w-20 h-20 object-cover rounded-full mb-4 z-10 left-1/2 transform -translate-x-1/2 -top-1" />
        
        <!-- Card content -->
        <div 
          class="bg-custom-bg-lightgreen p-6 rounded-lg w-full flex flex-col items-center justify-center text-center shadow-md mt-10 pt-14"
          :style="cardStyle"
          @mouseover="grow"
          @mouseleave="shrink"
        >
          <!-- Title, shown only when not hovered -->
          <h2 v-if="!isHovered" class="text-white text-lg font-semibold mb-4 text-center">{{ cardInfo.title }}</h2>

          <!-- Description, shifted lower when hovered -->
          <p v-if="isHovered" class="text-white" :class="hoveredDescriptionClass">{{ cardInfo.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MealCard',
  props: {
    cardInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isHovered: false, // Track hover state
      cardStyle: {
        height: '15rem',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        backgroundColor : '#427573', // Initial background color
        transform: 'translateY(-20px)' // Move the card up slightly
      },
      hoveredDescriptionClass: '', // Class to handle the description shifting down
    };
  },
  methods: {
    grow() {
      this.cardStyle.height = '22rem'; // Increase height on hover
      this.cardStyle.backgroundColor = '#366767'; // Change background color
      this.isHovered = true; // Show description on hover, hide title
      this.hoveredDescriptionClass = 'mt-8'; // Add margin-top to shift the description lower
    },
    shrink() {
      this.cardStyle.height = '15rem'; // Reset height
      this.cardStyle.backgroundColor = '#427573'; // Reset background color
      this.isHovered = false; // Show title, hide description when not hovered
      this.hoveredDescriptionClass = ''; // Remove the margin when not hovered
    }
  }
};
</script>

<style scoped>
/* Adjust the image to sit above the card content */
.meal-card-wrapper img {
  z-index: 10;
  position: absolute;
  top: -5%; /* Adjust this if needed */
  left: 50%;
  transform: translateX(-50%);
}

/* Ensure the card wrapper doesn't shrink */
.meal-card-wrapper {
  overflow: hidden;
}

/* Adjust the card position to be slightly elevated */
.meal-card-wrapper .p-6 {
  transform: translateY(0%); /* Adjust this value to control how much the card is moved up */
}

/* Additional styling for the description shift */
.mt-8 {
  margin-top: 0%; /* Increase this value to shift the description lower */
}
</style>
