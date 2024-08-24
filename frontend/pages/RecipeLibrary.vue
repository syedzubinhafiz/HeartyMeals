<template>
    <div class="absolute w-screen z-40">
      <Header />
    </div>
    <div class="relative min-h-screen text-white">
      <!-- Background image section -->
      <div class="bg-header-image flex flex-col items-center justify-center relative-parent">
        <h2 class="text-white text-4xl font-bold text-center">Recipe Library</h2>
        <p class="mt-[145px] text-xl text-center italic">Because healthy food should be tasty too.</p>
        <!-- Adding the curvy SVGs directly inside the background section -->
        <div class="curvy-left">
          <img src="/assets/img/curvyLeft.svg" alt="Curvy Left" />
        </div>
        <div class="curvy-right">
          <img src="/assets/img/curvyRight.svg" alt="Curvy Right" />
        </div>
      </div>
      <!-- Content section -->
      <div class="flex justify-center">
        <MealSearchBar />
      </div>
      <div class="pt-20">
        
            <RecipeCard
      imageSrc="/asset/img/croissant.svg"
      mealName="Tomato and Cheese Croissant"
      mealDescription="Incredible flavour-packed croissant that serves just nice for a tea time snack."
      :labels="[
        { name: 'Breakfast', active: true },
        { name: 'Lunch', active: false },
        { name: 'Dinner', active: false },
        { name: 'Snack', active: true },
      ]"
    />
      </div>
    </div>
  </template>

  <script>
  definePageMeta({
	layout: "emptylayout"
});
</script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
  
  * {
    font-family: 'Overpass', sans-serif;
  }
  
  /* Background image and text adjustments */
  .bg-header-image {
    background-image: url('@/assets/img/smallerBlob.svg');
    background-size: 110% auto;
    background-repeat: no-repeat;
    background-position: center;
    height: 50vh; /* Adjust the height as needed */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 20px; /* Optional padding */
    position: relative; /* Ensure relative positioning for absolute children */
  }
  
  /* Styling the curvy blobs */
  .curvy-left {
    position: absolute;
    bottom: 0;
    left: -55px;
    top:310px;
    width: 150px; /* Adjust size as needed */
    height: 500px; /* Explicit height */
    z-index: 1;
  }
  
  .curvy-right {
    position: absolute;
    bottom: 0;
    right: 0;
    top:310px;
    width: 150px; /* Adjust size as needed */
    height: 500px; /* Explicit height */
    z-index: 1;
  }
  
  .curvy-left img, .curvy-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Scrollable content starts below the image */
  .scroll-content {
    height: calc(100vh - 50vh); /* Remaining height after the header */
    overflow-y: auto;
    padding-top: 20px; /* Add padding if necessary */
  }
  
  /* Styling the search bar section */
  .scroll-content .flex {
    margin-top: 20px;
  }
  
  .text-white {
    color: #ffffff;
  }
  
  /* Additional styles if needed */
  .text-custom-button-text {
    color: #993300;
  }
  
  .bg-custom-bg-green {
    background-color: #015B59;
  }
  
  .bg-custom-button-orange {
    background-color: #FFA17A;
  }
  
  .hover\:bg-custom-button-orange-dark:hover {
    background-color: #e5946b; /* A slightly darker shade */
  }
  
  .text-custom-text-orange {
    color: #000000;
  }
  
  .bg-custom-overlay-brown {
    background-color: #DAC2A8;
  }
  </style>
  