<template>
  <!-- icons: https://icons.getbootstrap.com/ -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  
  <!-- header -->
  <div class="relative">
      <!-- Header Image with Clickable Area -->
      <div class="relative w-full">
        <img src="../assets/img/Header.png" alt="Hearty Meal" class="w-full h-auto" />
        
        <!-- Clickable Area for Sidebar -->
        <button @click="toggleSidebar" class="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10">
          <span class="sr-only">Open Sidebar</span>
        </button>
      </div>
    </div>
  <!-- sidebar -->
  <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <div class="fixed top-0 left-0 w-64 bg-custom-sidebar-yellow h-full shadow-md z-50 p-5 rounded-r-lg">
      <div class="flex items-center justify-between">
        <img src="../assets/img/HeartYellow.png" alt="Hearty Meal" :width="50">
        <button @click="toggleSidebar" class="text-black">
          <i class="bi bi-x text-3xl"></i>
        </button>
      </div>
      <nav class="mt-5">
        <ul>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-house mr-2"></i> Home
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-journals mr-2"></i> Meal Logging
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-basket mr-2"></i> Recipe Library
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-card-list mr-2"></i> Meal Planning
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-graph-up mr-2"></i> Diet Analytics
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-easel mr-2"></i> Educational Content
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black">
              <i class="bi bi-person mr-2"></i> Profile Page
            </a>
          </li>
          <li class="mb-4">
            <button @click.prevent="useUserInfo().logout(); navigateTo('/login')" class="flex items-center text-black">
              <i class="bi bi-box-arrow-right mr-2"></i> Log Out
            </button>
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
