<template>
  <div class="carousel-container">
    <h2 class="carousel-title">Recommended For You</h2>
    
    <div class="carousel-wrapper">
      <!-- Previous Arrow -->
      <button 
        class="carousel-arrow prev-arrow" 
        @click="previousSlide"
        :disabled="currentIndex === 0"
        :class="{ 'disabled': currentIndex === 0 }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Carousel Content -->
      <div class="carousel-content" v-if="articles && articles.length > 0">
        <div 
          class="carousel-slide"
          :key="articles[currentIndex].id"
        >
          <div class="article-card" @click="handleCardClick(articles[currentIndex])">
            <div class="article-image-container">
              <img 
                v-if="!imageError"
                :src="articles[currentIndex].image || '/assets/img/default.png'" 
                :alt="articles[currentIndex].title"
                class="article-image"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div v-if="imageError || !articles[currentIndex].image" class="image-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="placeholder-text">{{ articles[currentIndex].title.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            
            <div class="article-content">
              <h3 class="article-title">{{ articles[currentIndex].title }}</h3>
              <p class="article-description">{{ articles[currentIndex].description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Arrow -->
      <button 
        class="carousel-arrow next-arrow" 
        @click="nextSlide"
        :disabled="currentIndex === articles.length - 1"
        :class="{ 'disabled': currentIndex === articles.length - 1 }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Dots Indicator -->
    <div class="carousel-dots" v-if="articles && articles.length > 1">
      <button 
        v-for="(article, index) in articles" 
        :key="index"
        class="carousel-dot"
        :class="{ 'active': index === currentIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  articles: {
    type: Array,
    required: true,
    default: () => []
  }
});

const currentIndex = ref(0);
const imageError = ref(false);

const nextSlide = () => {
  if (currentIndex.value < props.articles.length - 1) {
    currentIndex.value++;
    imageError.value = false;
  }
};

const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    imageError.value = false;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
  imageError.value = false;
};

const handleImageError = () => {
  imageError.value = true;
};

const handleImageLoad = () => {
  imageError.value = false;
};

const handleCardClick = async (article) => {
  localStorage.setItem('educationalContentId', article.id);
  await navigateTo('/educational-content');
};

// Auto-advance carousel (optional)
let autoAdvanceInterval = null;

const startAutoAdvance = () => {
  autoAdvanceInterval = setInterval(() => {
    if (currentIndex.value < props.articles.length - 1) {
      nextSlide();
    } else {
      currentIndex.value = 0;
      imageError.value = false;
    }
  }, 5000); // Change slide every 5 seconds
};

const stopAutoAdvance = () => {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
  }
};

onMounted(() => {
  // Uncomment to enable auto-advance
  // startAutoAdvance();
});

onBeforeUnmount(() => {
  stopAutoAdvance();
});
</script>

<style scoped>
.carousel-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.carousel-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.carousel-arrow {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #427573;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.carousel-arrow:hover:not(.disabled) {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.carousel-arrow.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.carousel-content {
  flex: 1;
  max-width: 400px;
  margin: 0 1rem;
}

.carousel-slide {
  width: 100%;
}

.article-card {
  background: #427573;
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.article-card:hover {
  background: #366767;
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.article-image-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image {
  transform: scale(1.1);
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  gap: 0.5rem;
}

.placeholder-text {
  font-size: 2rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.article-content {
  text-align: center;
  color: white;
}

.article-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.article-description {
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
  max-height: 3.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: white;
  transform: scale(1.2);
}

.carousel-dot:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .carousel-container {
    padding: 0 0.5rem;
  }
  
  .carousel-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .carousel-wrapper {
    gap: 0.5rem;
  }
  
  .carousel-arrow {
    width: 40px;
    height: 40px;
  }
  
  .carousel-content {
    margin: 0 0.5rem;
  }
  
  .article-card {
    padding: 1.25rem;
  }
  
  .article-image-container {
    width: 100px;
    height: 100px;
    margin-bottom: 1.25rem;
  }
  
  .article-title {
    font-size: 1rem;
  }
  
  .article-description {
    font-size: 0.85rem;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .carousel-container {
    padding: 0 0.25rem;
  }
  
  .carousel-wrapper {
    gap: 0.25rem;
  }
  
  .carousel-arrow {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
  }
  
  .carousel-content {
    margin: 0 0.25rem;
    max-width: calc(100% - 80px); /* Account for arrow space */
  }
  
  .article-card {
    padding: 1rem;
  }
  
  .article-image-container {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }
  
  .article-title {
    font-size: 0.9rem;
    line-height: 1.2;
  }
  
  .article-description {
    font-size: 0.8rem;
    line-height: 1.3;
    -webkit-line-clamp: 2;
    max-height: 2.6rem;
  }
  
  .placeholder-text {
    font-size: 1.5rem;
  }
}
</style> 