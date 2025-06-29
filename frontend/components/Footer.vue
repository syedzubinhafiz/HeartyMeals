<template>
  <div class="bg-custom-bg-green text-white rounded-t-2xl p-4 lg:p-6">
    <div class="container mx-auto flex flex-wrap justify-between items-center">
      
      <!-- Left side: Links -->
      <div class="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-x-6 mb-4 sm:mb-0 text-center sm:text-left">
        <ButtonTransparent @click="handleClick('About')" class="text-white">About</ButtonTransparent>
        <ButtonTransparent @click="handleClick('Join Our Community')" class="text-white">Join Our Community</ButtonTransparent>
        <ButtonTransparent @click="handleClick('News')" class="text-white">News</ButtonTransparent>
      </div>

      <!-- Middle: Copyright - hidden on small screens, visible on medium and up -->
      <div class="hidden md:flex flex-1 justify-center items-center h-full">
        <P class="text-white text-sm">Copyright HeartyMeal, All rights reserved.</P>
      </div>

      <!-- Right side: Logo -->
      <div class="w-full sm:w-auto flex justify-center sm:justify-end items-center">
        <img src="../assets/img/HeartyMealLogo.png" alt="Hearty Meal" class="h-12 lg:h-16" />
      </div>

      <!-- Copyright - visible on small screens -->
      <div class="w-full md:hidden text-center mt-4">
        <P class="text-white text-sm">Copyright HeartyMeal, All rights reserved.</P>
      </div>

    </div>
  </div>
</template>

<script setup>
function handleClick(section) {
  console.log(`${section} button clicked!`);
  // Future implementation for navigation goes here
}
</script>

<style scoped>
/* Tailwind CSS handles most styling; no additional CSS is required */
</style>

  