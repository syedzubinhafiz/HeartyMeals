<template>
  <!-- icons: https://icons.getbootstrap.com/ -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  
  <!-- header -->
  <div class="relative z-10">
      <!-- Header Image with Clickable Area -->
      <div class="relative w-full bg-custom-bg-green rounded-b-2xl h-16 lg:h-20 shadow-lg flex justify-center items-center px-4">
        <button 
          @click="toggleSidebar" 
          class="absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 text-white min-w-touch min-h-touch flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <i class="bi bi-list text-xl lg:text-2xl"></i>
        </button>
        <img 
          src="../assets/img/HeartyMealLogo.png" 
          alt="Hearty Meal" 
          class="clickable-img h-10 lg:h-12 max-w-full object-contain" 
          @click="handleNavigation('/home')" 
        />
      </div>
    </div>

  <!-- sidebar with backdrop -->
  <div v-if="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <!-- Sidebar container -->
    <div class="fixed top-0 left-0 w-72 max-w-[85vw] bg-custom-sidebar-yellow h-full shadow-md z-50 p-4 lg:p-5 rounded-r-lg overflow-y-auto" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <img src="../assets/img/HeartYellow.png" alt="Hearty Meal" class="w-10 h-10 lg:w-12 lg:h-12">
        <button 
          @click="toggleSidebar" 
          class="text-black min-w-touch min-h-touch flex items-center justify-center"
          aria-label="Close menu"
        >
          <i class="bi bi-x text-2xl lg:text-3xl"></i>
        </button>
      </div>
      <nav>
        <ul class="space-y-2">
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/home')"
            >
              <i class="bi bi-house mr-3 text-lg"></i> Home
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/meal-logging')"
            >
              <i class="bi bi-journals mr-3 text-lg"></i> Meal Logging
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/recipe-library')"
            >
              <i class="bi bi-basket mr-3 text-lg"></i> Recipe Library
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/meal-planning')"
            >
              <i class="bi bi-card-list mr-3 text-lg"></i> Meal Planning
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/analytics-day')"
            >
              <i class="bi bi-graph-up mr-3 text-lg"></i> Diet Analytics
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/educational-content')"
            >
              <i class="bi bi-easel mr-3 text-lg"></i> Educational Content
            </button>
          </li>
          <li>
            <button 
              class="flex items-center text-black w-full text-left py-3 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors min-h-touch"
              @click="handleNavigation('/profile-page')"
            >
              <i class="bi bi-person mr-3 text-lg"></i> Profile Page
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useNuxtApp } from 'nuxt/app';

defineOptions({
  name: 'Header',
});

const { $router } = useNuxtApp();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// TEMPORARY FIX: Direct navigation handler to bypass navigateTo bug
const handleNavigation = async (path) => {
  try {
    // Close sidebar first
    isSidebarOpen.value = false;
    
    // Wait for DOM update to ensure sidebar is closed
    await nextTick();
    
    console.log('Navigating to:', path);
    
    // TEMP FIX: Since navigateTo is not completing route transitions,
    // use window.location.href as immediate workaround for critical bug
    if (import.meta.client && typeof window !== 'undefined') {
      console.log('Using window.location.href (temp fix for navigation bug)');
      window.location.href = path;
    } else {
      // Server-side fallback (though less likely to be needed)
      await navigateTo(path).catch(() => {
        console.error('Server-side navigation also failed');
      });
    }
    
  } catch (error) {
    console.error('Navigation error:', error);
    
    // Final fallback: try navigateTo if somehow window.location fails
    try {
      await navigateTo(path);
    } catch (finalError) {
      console.error('All navigation methods failed:', finalError);
    }
  }
};
</script>

<style scoped>
.clickable-img{
  cursor: pointer;
}
</style>
