<template>
  <div class="meal-card-wrapper">
    <div class="meal-card p-6 rounded-lg w-72 flex-shrink-0 flex flex-col items-center justify-between transition-all duration-300"
      @click="handleCardClick">
      <div class="relative w-full">
        <!-- Image, positioned absolutely to not affect layout -->
        <img :src="cardInfo.image" alt="Meal Image" class="meal-card-image" />
        
        <!-- Card content -->
        <div 
          class="card-content"
          :class="{ 'is-hovered': isHovered }"
          @mouseover="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <!-- Title, shown only when not hovered -->
          <h2 class="card-title">{{ cardInfo.title }}</h2>

          <!-- Description, shifted lower when hovered -->
          <p class="card-description">{{ cardInfo.description }}</p>
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
    };
  },
  methods: {
    async handleCardClick() {
      localStorage.setItem('educationalContentId', this.cardInfo.id);
      await navigateTo('/educational-content');
    }
  }
};
</script>

<style scoped>
.meal-card-wrapper {
  overflow: visible; /* Allow image to pop out */
  scroll-snap-align: center;
  padding-top: 2.5rem; /* Space for the image */
  height: 22rem; /* Give wrapper a fixed height */
}

.meal-card {
  height: 100%;
}

.meal-card-image {
  position: absolute;
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: -2.5rem; /* Position image half-way out */
  z-index: 10;
  transition: all 0.3s ease;
}

.card-content {
  background-color: #427573;
  padding: 3.5rem 1.5rem 1.5rem; /* More padding at the top for image */
  border-radius: 0.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-content.is-hovered {
  background-color: #366767;
}

.card-title,
.card-description {
  color: white;
  transition: all 0.3s ease;
  width: 100%;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-description {
  font-size: 0.875rem;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content.is-hovered .card-title {
  transform: translateY(-200%); /* Move title out of view */
  opacity: 0;
}

.card-content.is-hovered .card-description {
  top: 0; /* Slide description into view */
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .meal-card-wrapper {
    height: 18rem;
    padding-top: 2rem;
  }
  .meal-card {
    width: 16rem; /* Smaller width on mobile: 256px */
    min-width: 16rem;
  }
  
  .meal-card-image {
    width: 4rem;
    height: 4rem;
    top: -2rem;
  }

  .card-content {
    padding-top: 2.5rem;
  }
}

/* Medium screen sizes */
@media (min-width: 769px) and (max-width: 1200px) {
  .meal-card {
    width: 18rem;
    min-width: 18rem;
  }
}
</style>
