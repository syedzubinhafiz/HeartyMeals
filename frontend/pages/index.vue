<template>
    <div class="relative z-10 text-center py-16 ">
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