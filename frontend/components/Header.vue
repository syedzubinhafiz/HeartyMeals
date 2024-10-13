<template>
  <!-- icons: https://icons.getbootstrap.com/ -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  
  <!-- header -->
  <div class="relative z-10">
      <!-- Header Image with Clickable Area -->
      <div class="relative w-full bg-custom-bg-green rounded-b-2xl h-20 shadow-lg flex justify-center">
        <button @click="toggleSidebar" class="absolute top-1/2 left-8 transform -translate-y-1/2 text-white">
          <i class="bi bi-list text-2xl"></i>
        </button>
        <img src="../assets/img/HeartyMealLogo.png" alt="Hearty Meal" class="clickable-img" @click.prevent="navigateTo('/home')" />
      </div>
    </div>

  <!-- sidebar with backdrop -->
  <div v-if="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <!-- Sidebar container -->
    <div class="fixed top-0 left-0 w-64 bg-custom-sidebar-yellow h-full shadow-md z-50 p-5 rounded-r-lg" @click.stop>
      <div class="flex items-center justify-between">
        <img src="../assets/img/HeartYellow.png" alt="Hearty Meal" :width="50">
        <button @click="toggleSidebar" class="text-black">
          <i class="bi bi-x text-3xl"></i>
        </button>
      </div>
      <nav class="mt-5">
        <ul>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/home')">
              <i class="bi bi-house mr-2"></i> Home
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/meal-logging')">
              <i class="bi bi-journals mr-2"></i> Meal Logging
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/recipe-library')">
              <i class="bi bi-basket mr-2"></i> Recipe Library
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/meal-planning')">
              <i class="bi bi-card-list mr-2"></i> Meal Planning
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/analytics-day')">
              <i class="bi bi-graph-up mr-2"></i> Diet Analytics
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/educational-content')">
              <i class="bi bi-easel mr-2"></i> Educational Content
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="navigateTo('/profile-page')">
              <i class="bi bi-person mr-2"></i> Profile Page
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({
  name: 'Header',
});

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
.clickable-img{
  cursor: pointer;
}
</style>
