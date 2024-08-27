<template>
    <div ref="container" class="container relative">
      <div class="section w-screen h-screen bg-red-200 flex items-center justify-center">
        <NutrientWidgetDelta/>
      </div>
      <div class="section w-screen h-screen bg-green-200 flex items-center justify-center">
        <StomachSidebar v-model="isSidebarOpen"/>
        <ButtonGreen @click="toggleSidebar">
          <p>open sidebar</p>
        </ButtonGreen>
      </div>
      <div class="section w-screen h-screen bg-yellow-200 flex items-center justify-center">
        <p>section 3</p>
      </div>
      <div class="section w-screen h-screen bg-blue-200 flex items-center justify-center">
        <p>section 4</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  
  const container = ref(null);
  
  onMounted(() => {
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
  
    const scrollToSection = (index) => {
      if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
        currentSection = index;
      }
    };
  
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        scrollToSection(currentSection + 1);
      } else {
        scrollToSection(currentSection - 1);
      }
    };
  
    container.value.addEventListener('wheel', handleWheel);
  });
// ---------------------------------

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
  </script>
  
  <style scoped>
  html {
    scroll-behavior: smooth;
  }
  
  .container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
  
  .section {
    scroll-snap-align: start;
    height: 100vh;
    width: 100%;
  }
  </style>
  