<template>
    <div class="absolute w-screen z-40">
      <Header />
    </div>
  
    <div class="relative min-h-screen text-white bg-custom-color"> 
      <!-- Background image section -->
      <div class="bg-header-image flex flex-col items-center justify-center relative-parent z-10">
        <h2 class="text-white text-4xl font-bold text-center">Educational Content</h2>
        <p class="mt-[15px] text-xl text-center italic">
          Caring for your body with wholesome foods is a lifelong investment in your health and well-being.
        </p>
      </div>
      
      <!-- Curved images as part of the background -->
      <div class="curvy-images-container absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-0">
        <div class="flex justify-between items-end w-full">
          <img src="/assets/img/bigleftBlob.png" alt="Curvy Left" class="curvy-left" style="height: 60vh" />
          <img src="/assets/img/bigrightBlob.svg" alt="Curvy Right" class="curvy-right" style="height: 70vh" />
        </div>
      </div>
  
      <!-- Cards layout section -->
      <div class="flex justify-center mb-16 text-black z-20 relative">
        <MealSearchBar v-model="searchValue" :dataList="searchDataList"/>
      </div>
  
      <!-- Adjusted Card Container -->
      <<div class="flex justify-center items-center flex-wrap mt-12 px-4 z-20 backdrop:relative">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 w-full max-w-screen-lg justify-items-center mb-20">
    <EdContentCard @click="openOverlay('Diagnosing Heart Failure')" />
    <EdContentCard @click="openOverlay('Diagnosing Heart Failure')" />
    <EdContentCard @click="openOverlay('Diagnosing Heart Failure')" />
    <EdContentCard @click="openOverlay('Diagnosing Heart Failure')" />
  </div>
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
    padding-top: 20px;
    position: relative;
  }
  .scrollable-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: calc(100% - 40px); /* Deducts padding from available height */
  overflow-y: auto; /* Enables vertical scrolling */
  padding: 20px;
  box-sizing: border-box;
}
  .bg-custom-color {
    background-color: #DAC2A8;
    min-height: 100vh;
  }
  
  .curvy-images-container {
    position: absolute;
    z-index: 1; /* Curvy images behind content */
  }
  
  .curvy-left {
    height: 50vh; /* Adjust height as necessary */
    margin-left: -10px; /* Adjust positioning if needed */
  }
  
  .curvy-right {
    height: 50vh; /* Adjust height as necessary */
    margin-right: -10px; /* Adjust positioning if needed */
  }
  
  .grid {
    width: 100%;
    row-gap: 3rem; /* Added vertical space between rows of cards */
  }
  
  .grid.justify-items-center {
    justify-items: center; /* Center the grid items */
  }
  
  .flex.justify-center {
    margin-top: 2rem;
    position: relative;
    z-index: 20;
  }
  </style>
  