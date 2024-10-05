<template>
  <div class="absolute w-screen z-40">
    <Header />
  </div>

  <div class="relative min-h-screen text-white bg-custom-color overflow-hidden"> 
    <!-- Background image section -->
    <div class="bg-header-image flex flex-col items-center justify-center relative-parent z-10">
      <h2 class="text-white text-4xl font-bold text-center">Educational Content</h2>
      <p class="mt-[15px] text-xl text-center italic">
        Caring for your body with wholesome foods is a lifelong investment in your health and well-being.
      </p>
    </div>
    
    <!-- Curved images as part of the background -->
    <div class="curvy-images-container absolute inset-x-0 top-0 transform z-0">
      <div class="flex justify-between items-end w-full">
        <img src="/assets/img/bigleftBlob.png" alt="Curvy Left" class="curvy-left" />
        <img src="/assets/img/bigrightBlob.svg" alt="Curvy Right" class="curvy-right" />
      </div>
    </div>

    <!-- Cards layout section -->
    <div class="flex justify-center mb-16 text-black z-20 relative">
      <MealSearchBar v-model="searchValue" :dataList="searchDataList"/>
    </div>

    <!-- Adjusted Card Container (scrollable) -->
    <div class="scrollable-card-container flex justify-center items-center flex-wrap mt-12 px-4 z-20 backdrop:relative">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-lg justify-items-center">
        <EdContentCard @click="openOverlay('Diagnosing Heart Failure')" v-for="(card, index) in displayedCards" :key="index" />
      </div>
      <infinite-loading @infinite="loadMoreCards"></infinite-loading>
    </div>

  </div>
  <Footer/>
  <EdContentOverlay 
    :show="isOverlayVisible" 
    :header="overlayHeader" 
    :imageSrc="overlayImageSrc" 
    @close="isOverlayVisible = false" 
  />
</template>

<script setup>
import { ref } from 'vue';
import EdContentCard from '@/components/EdContentCard.vue';  // Adjust path if necessary
import EdContentOverlay from '@/components/EdContentOverlay.vue';

const isOverlayVisible = ref(false);
const overlayHeader = ref('');
const overlayImageSrc = ref('');

function openOverlay(header, imageSrc) {
  overlayHeader.value = header;
  overlayImageSrc.value = imageSrc;
  isOverlayVisible.value = true;
}

// Define the cards array with data
const cards = ref([
  { id: 1, title: 'Card 1' },
  { id: 2, title: 'Card 2' },
  { id: 3, title: 'Card 3' },
  { id: 4, title: 'Card 4' },
  { id: 5, title: 'Card 5' },
  { id: 6, title: 'Card 6' },
  { id: 7, title: 'Card 7' },
  { id: 8, title: 'Card 8' },
  // Add more card data as needed
]);

// Initialize displayedCards with the first few cards
const displayedCards = ref(cards.value.slice(0, 6)); // Initial display count of 6 cards

// Function to load more cards as the user scrolls down
function loadMoreCards($state) {
  const currentLength = displayedCards.value.length;
  const moreCards = cards.value.slice(currentLength, currentLength + 6); // Load the next 6 cards
  if (moreCards.length > 0) {
    displayedCards.value = [...displayedCards.value, ...moreCards];
    $state.loaded(); // Mark as loaded
  } else {
    $state.complete(); // No more cards to load
  }
}
</script>

<style scoped>
.bg-header-image {
  background-image: url('@/assets/img/smallerBlob.svg');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center;
  height: 35vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 5%;
  position: relative;
}

.scrollable-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: calc(100% - 4%);
  overflow-y: auto;
  padding: 2%;
  box-sizing: border-box;
}

.bg-custom-color {
  background-color: #DAC2A8;
  min-height: 100vh;
  position: relative;
}

.curvy-images-container {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
}

.curvy-left {
  height: 50vh;  /* Adjust the height for better scaling */
  margin-left: -1%; /* Adjust positioning to fit nicely */
}

.curvy-right {
  height: 60vh;  /* Adjust the height for better scaling */
  margin-right: -1%; /* Adjust positioning to fit nicely */
  margin-top:20%
}

/* Layout for Cards */
.grid {
  width: 100%;
  gap: 2rem; /* Add spacing between cards */
  grid-template-columns: repeat(1, 1fr); /* 1 column on mobile */
  margin-bottom:10%
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium and larger screens */
  }
}

.grid.justify-items-center {
  justify-items: center; /* Center the grid items */
}

.flex.justify-center {
  margin-top: 2rem;
  position: relative;
  z-index: 20;
}

.scrollable-card-container {
  height: 50vh;
  width: 80%;
  max-width: 900px;
  overflow-y: auto;
  margin: 0 auto;

  /* Firefox */
  scrollbar-width: thin;  /* Makes the scrollbar thin */
  scrollbar-color: #015B59 #DAC2A8; /* Thumb color is #015B59 and track is #DAC2A8 for Firefox */
}

/* WebKit-based browsers (Chrome, Safari, Edge) */
.scrollable-card-container::-webkit-scrollbar {
  width: 12px; /* Scrollbar width */
}

.scrollable-card-container::-webkit-scrollbar-thumb {
  background-color: #015B59; /* Scrollbar thumb color */
  border-radius: 10px; /* Rounded corners for the thumb */
  border: 3px solid #DAC2A8; /* Optional padding around the thumb */
}

.scrollable-card-container::-webkit-scrollbar-track {
  background-color: #DAC2A8; /* Scrollbar track color */
  border-radius: 10px; /* Rounded corners for the track */
}

</style>
