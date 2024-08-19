<template>
  <div class="relative flex justify-between items-center bg-custom-bg-green h-20 lg:h-24 rounded-t-2xl p-4">
    <div class="flex flex-col text-sm lg:text-md">
      <ButtonTransparent @click="handleClick('About')" class="text-white">About</ButtonTransparent>
      <ButtonTransparent @click="handleClick('Join Our Community')" class="text-white">Join Our Community</ButtonTransparent>
      <ButtonTransparent @click="handleClick('News')" class="text-white">News</ButtonTransparent>
    </div>
    <div class="h-full flex items-end">
      <P class="text-white text-sm">Copyright HeartyMeal, All rights reserved.</P>
    </div>
    <div>
      <img src="../assets/img/HeartyMealLogo.png" alt="Hearty Meal" class="h-10 lg:h-24" />
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

  