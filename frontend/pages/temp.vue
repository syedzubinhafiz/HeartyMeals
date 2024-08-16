<template>
    <div class="h-96 absolute top-0 left-0 w-screen bg-custom-bg-green"/>
    <div class="relative h-screen">
        <div class="w-full h-96 relative bg-custom-bg-green bg-heart-image">
            <div class="absolute inset-x-0 bottom-0 overflow-hidden text-custom-bg-brown">
                <svg class="w-full h-48" viewBox="0 0 1440 250" xmlns="http://www.w3.org/2000/svg" >
                    <path fill="currentColor" d="M-300,0 Q720,520 1940,0 L1940,320 L-400,320 Z"></path>
                </svg>
            </div>
        </div>

        <!-- Content in the center of the green section -->
        <div class="absolute top-0 w-full h-96 flex flex-col items-center justify-center text-white">
            <h1 class="text-4xl mb-4">Welcome back, Bruno Mars</h1>
            <p class="text-lg mb-6">What do you want to do today?</p>
            <div class="flex space-x-5">
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/recipe-icon.png" alt="Recipe Library" class="w-6 h-6 mr-2" /> Recipe Library
                </button>
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/logging-icon.png" alt="Meal Logging" class="w-6 h-6 mr-2" /> Meal Logging
                </button>
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/planning-icon.png" alt="Meal Planning" class="w-6 h-6 mr-2" /> Meal Planning
                </button>
            </div>
        </div>

        <div class="flex items-center justify-center py-9 bg-custom-overlay-brown">
            <p class="text-center text-lg font-semibold italic text-custom-text-orange">
                Every day may not be good, but there's something good in every day. Focus on the good, no matter how small.
            </p>
        </div>
    
    </div>


    <div class="flex items-center justify-center h-screen">
        <!-- <div class="shadow-sm bg-custom-overlay-brown h-40 w-64 rounded-lg flex flex-col items-center justify-center space-y-2">
            <p class="font-medium text-md">Nuxt JS Guide</p>
            <button class="rounded-sm shadow-sm bg-custom-button-green py-1 px-2 text-white hover:bg-custom-button-green" @click.prevent="onClickButton">Button</button>
        </div> -->
        <div class="flex-1 h-25">
        <WaterTankWidget/>
        </div>
        <div class="flex-1 h-31">
        <NutrientWidget />
        </div>
    </div>

    <div class="relative z-10 text-center py-16 h-screen">
      <div class="background-wrapper">
        <img :src="backgroundImage" alt="Background" class="background-image" />
          </div>
        <div class="container mx-auto relative z-20 px-4">
          <h2 class="text-white text-xl font-semibold mb-8 mt-5">Recommended For You</h2>
          <div class="overflow-x-auto meal-cards-container">
          <div class="flex justify-center space-x-4 min-w-max pb-4">
            <MealCard v-for="(card, index) in cardData" :key="index" :cardInfo="card" />
          </div>
        </div>
        </div>
    </div>
    <div class="flex items-center justify-center h-screen">
        <RecipeOfTheDay recipeName="Nasi Ayam"/>
    </div>
</template>

<script setup>
// defines the name of the page
defineOptions({
    name: "HomePage",
});

// this defines the layout that the page uses
// the page will be wrapped around the selected layout, which are defined in the layouts folder
definePageMeta({
    layout: "baselayout",
    // middleware: "login-check",
});

const onClickButton = async () => {
    navigateTo("/vueExample");
}

import image1 from 'assets/img/LandingPage/image1.jpeg';
  import image2 from 'assets/img/LandingPage/image2.jpeg';
  import image3 from 'assets/img/LandingPage/image3.jpeg';
  import image4 from 'assets/img/LandingPage/image4.jpeg';
  
  // Import the local background image
  import backgroundImage from '/assets/img/LandingPage/landingpage3-bg.png';
  
  const cardData = [
    {
      title: "Best Healthy Restaurants in Manila",
      description: "Explore Manila healthily with this travel guide updated to 2024.",
      image: image1
    },
    {
      title: "Best Healthy Restaurants in Manila",
      description: "Explore Manila healthily with this travel guide updated to 2024.",
      image: image2
    },
    {
      title: "Best Healthy Restaurants in Manila",
      description: "Explore Manila healthily with this travel guide updated to 2024, with over 10 restaurants marked all around Manila!",
      image: image3
    },
    {
      title: "Best Healthy Restaurants in Manila",
      description: "Explore Manila healthily with this travel guide updated to 2024.",
      image: image4
    }
  ];
  
  // Create a reactive style object
  const backgroundStyle = ref({
    background: `url(${backgroundImage}) no-repeat center center`,
    // backgroundSize: 'cover',
    height: '980px' // Adjust the height as needed
  });

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

/* Custom button text color */
.text-custom-button-text {
    color: #993300;
}

/* Other styles */
.bg-custom-bg-green {
    background-color: #015B59;
}

/* Smaller background image */
.bg-heart-image {
    background-image: url('@/assets/img/HeartGreen.png');
    background-size: 50%; /* Adjust this value to make the background image smaller or larger */
    background-repeat: no-repeat;
    background-position: center;
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
  
.meal-cards-container {
height: 800px; /* Adjust this value based on your non-expanded card height */
position: relative;
}
.background-wrapper {
position: absolute;
top: 0;
left: 0;
overflow: hidden;
margin-top: 10px;
}

.background-image {
width: 100%;
height: 100%;
object-fit: cover;
object-position: center bottom ;
}

.overflow-x-auto {
overflow-x: auto;
-webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
display: none;
}

@media (max-width: 640px) {
.flex.justify-start {
    justify-content: flex-start;
}
}

@media (max-width: 1050px) {
.background-wrapper {
    height: 90%; /* Increase height for smaller screens */
}
.flex.justify-start{
    justify-content: flex-start;
}
}

@media (max-width: 480px) {
.background-wrapper {
    height: 50%; /* Further increase height for even smaller screens */
}
.flex.justify-start{
    justify-content: flex-start;
}
}
</style>


