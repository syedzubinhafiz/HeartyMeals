<template>
    <!-- icons: https://icons.getbootstrap.com/ -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <div class="relative bg-custom-bg-green shadow-md">
        <!-- header -->
      <div class="mx-auto container px-5">
        <div class="flex items-center justify-between py-3">
          <button @click="toggleSidebar" class="text-white">
            <i class="bi bi-list text-3xl"></i>
          </button>
          <div class="flex items-center justify-center">
            <img src="../assets/img/HeartyMealHeaderLogo.png" alt="Hearty Meal" :width="200">
          </div>
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
                <a href="#" class="flex items-center text-black">
                  <i class="bi bi-box-arrow-right mr-2"></i> Log Out
                </a>
              </li>
            </ul>
          </nav>
        </div>
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