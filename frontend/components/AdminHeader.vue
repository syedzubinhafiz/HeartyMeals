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
        <img src="../assets/img/HeartyMealLogo.png" alt="Hearty Meal" class="clickable-img" @click="handleNavigation('/admin')" />
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
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin')">
              <i class="bi bi-house mr-2"></i> Home
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/recipe-library')">
              <!-- <i class="bi bi-journals mr-2"></i> Recipe Library -->
              <img src="@/assets/icon/recipe-lib-icon-black.svg" alt="" style="transform: scale(0.8); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;">
              Recipe Library
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/educational-content')">
              <img src="@/assets/icon/edu-content-icon-black.svg" alt="" style="transform: scale(0.8); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;">
                    Educational Content
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-component')">
              <img src="@/assets/icon/add-component-admin-icon-black.svg" alt="" style="transform: scale(0.8); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;">
              Add Component
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-edu-content')">
              <img src="@/assets/icon/add-edu-content-admin-icon-black.svg" alt="" style="transform: scale(0.8); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;">
                    Add Educational Content
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-admin')">
              <i class="bi bi-person mr-2"></i> Add Admin
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-dietary')">
              <img src="@/assets/icon/dietary-sidebar-icon.svg" alt="" style="transform: scale(0.7); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;"> Add Dietary
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-food-category')">
              <img src="@/assets/icon/food-category-sidebar-icon.svg" alt="" style="transform: scale(0.7); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;"> Add Food Category
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center text-black" @click.prevent="handleNavigation('/admin/add-cuisine')">
              <img src="@/assets/icon/cuisine-sidebar-icon.svg" alt="" style="transform: scale(0.7); margin-left: -2%; margin-right: 2%; margin-top: -1.5%; height: 24px;"> Add Cuisine
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
  name: 'AdminHeader',
});

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Proper navigation handler with await
const handleNavigation = async (path) => {
  try {
    await navigateTo(path);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};
</script>

<style scoped>
.clickable-img{
  cursor: pointer;
}
</style>
