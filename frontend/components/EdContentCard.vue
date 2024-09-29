<template>
    <div class="card-container shadow-lg overflow-hidden">
      <!-- Image section -->
      <div class="image-container">
        <!-- You can add your image here -->
        <img :src="('assets/img/edcontentimg.svg')" alt="Card Image" class="w-full h-full object-cover" />
      </div>
  
      <!-- Text section -->
      <div class="text-container bg-white p-4">
        <h3 class="text-lg font-bold">Diagnosing Heart Failure</h3>
        <p class="mt-2 text-gray-600">
          It's always important to have regular checkups even if you're not noticing any particular symptoms. If you do notice any of the potential signs of heart failure, take action and talk to a health care professional.
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .card-container {
    width: 300px; /* Set width to 350px */
    height: 333.68px; /* Set height to 333.68px */
    background-color: #DAC2A8;
    border-radius: 20px 0px 20px 0px; /* Top left and bottom right rounded */
  }
  
  .image-container {
    height: 150px; /* Adjust the height of the image container */
    background-color: #dac2a8;
    border-radius: 0px 0px 0px 0px; /* Round only the top left corner */
  }
  
  .text-container {
    height: calc(100% - 150px); /* Adjust the height of the text container */
    border-radius: 00px 0px 0px 0px; /* Round only the bottom right corner */
  }
  </style>
  