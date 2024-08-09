<template>
  <div class="relative z-10 text-center py-16 mt-10" :style="backgroundStyle">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
        </div>
        <h2 class="text-white text-xl font-semibold mb-8">Recommended For You</h2>
        <div class="flex justify-center space-x-4">
          <MealCard v-for="(card, index) in cardData" :key="index" :cardInfo="card" />
        </div>
      </div>
  </div>

</template>
<script setup>
// defines the name of the page
defineOptions({
	name: "HomePage",
});

// this defines the layout that the page uses
// the page will be wrapped around the  selected layout, which are defined in the layouts folder
definePageMeta({
	layout: "baselayout",
    middleware: "login-check",
});


console.log(useUserInfo().getUserInfo().email)

import image1 from 'assets/img/LandingPage/image1.jpeg';
import image2 from 'assets/img/LandingPage/image2.jpeg';
import image3 from 'assets/img/LandingPage/image3.jpeg';
import image4 from 'assets/img/LandingPage/image4.jpeg';

// Import the local background image
import backgroundImage from '/assets/img/LandingPage/landingpage3-bg.png';


// const images = [
//   image1, // Imported images from assets directory
//   image2,
//   image3,
//   image4,
// ];

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
  backgroundSize: 'cover',
  height: '750px' 
});

</script>