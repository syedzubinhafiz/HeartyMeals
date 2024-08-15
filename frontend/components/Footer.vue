<template>
  <div class="relative flex flex-col items-center">
    <img src="../assets/img/Footer.png" alt="Hearty Meal Footer" class="h-auto" style="width: 100vw;" />
    
    <!-- Transparent clickable areas -->
    <div 
      class="absolute top-[20%] left-[2%] w-[8%] h-[10%] cursor-pointer" 
      @click="handleClick('About')"
    ></div>
    <div 
      class="absolute top-[40%] left-[2%] w-[20%] h-[10%] cursor-pointer" 
      @click="handleClick('Join Our Community')"
    ></div>
    <div 
      class="absolute top-[60%] left-[2%] w-[8%] h-[10%] cursor-pointer" 
      @click="handleClick('News')"
    ></div>
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

  