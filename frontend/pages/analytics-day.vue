<template>
    <Header/>
    <div class="analytics-page">
      <!-- Date Selector & Time Frame Switcher -->
      <div class="date-selector flex justify-between items-center p-4 rounded-xl mx-6 mt-4">
        <div class="date text-lg text-gray-600 flex items-center">
          <i class="fas fa-chevron-left cursor-pointer"></i>
          <span class="mx-4">24 April 2024</span>
          <i class="fas fa-chevron-right cursor-pointer"></i>
        </div>
        <div class="time-frame-switch flex space-x-2">
          <button class="px-4 py-2 bg-green-200 text-green-800 font-medium rounded-full">Day</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-full">Week</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-full">Month</button>
        </div>
      </div>
  
      <!-- Main Content Layout with 2 Columns -->
      <div class="main-content grid grid-cols-3 gap-6 p-6">
        <!-- Left Column: Meal Cards -->
        <div class="meal-cards col-span-2 grid grid-cols-2 gap-6">
          <!-- Meal Type Card -->
          <div class="meal-type-card bg-white rounded-lg p-6 shadow-lg">
            <div class="header flex justify-between items-center">
              <h2 class="text-lg font-bold">Meal Type <i class="fas fa-info-circle"></i></h2>
              <span class="text-gray-600">Calories 0000kcal</span>
            </div>
            <div class="nutrients-grid grid grid-cols-5 gap-2 mt-4 text-sm text-gray-800">
              <div>Protein: 00g</div>
              <div>Carbs: 00g</div>
              <div>Cholesterol: 00g</div>
              <div>Fats: 00g</div>
              <div>Sodium: 00g</div>
            </div>
          </div>
  
          <!-- Lunch Card -->
          <div class="lunch-card bg-white rounded-lg p-6 shadow-lg">
            <div class="header flex justify-between items-center">
              <h2 class="text-lg font-bold">Lunch</h2>
              <span class="text-gray-600">Calories 1000kcal</span>
            </div>
            <div class="meal-details mt-2 text-sm text-gray-800">
              <p>Pad Thai</p>
            </div>
            <div class="nutrients-grid grid grid-cols-5 gap-2 mt-4 text-sm">
              <div>Protein: 10g</div>
              <div>Carbs: 40g</div>
              <div>Cholesterol: 15g</div>
              <div>Fats: 0g</div>
              <div>Sodium: 0.3g</div>
            </div>
          </div>
  
          <!-- Dinner Card -->
          <div class="dinner-card bg-white rounded-lg p-6 shadow-lg">
            <div class="header flex justify-between items-center">
              <h2 class="text-lg font-bold">Dinner</h2>
            </div>
            <div class="meal-placeholder bg-red-100 text-red-500 p-4 text-center rounded-lg">
              <p>Meal not logged <i class="fas fa-times-circle"></i></p>
            </div>
          </div>
  
          <!-- Other Card -->
          <div class="other-card bg-white rounded-lg p-6 shadow-lg">
            <div class="header flex justify-between items-center">
              <h2 class="text-lg font-bold">Other</h2>
            </div>
            <div class="meal-placeholder bg-yellow-100 text-yellow-600 p-4 text-center rounded-lg">
              <p>Meal yet to be logged <i class="fas fa-exclamation-circle"></i></p>
            </div>
          </div>
        </div>
  
        <!-- Right Column: NutrientWidget -->
        <div class="nutrient-widget-container col-span-1">
          <NutrientWidget/>
        </div>
      </div>
    </div>
    <Footer/>
  </template>
  
  <script>
  export default {
    name: 'AnalyticsPageDay',
  }
  </script>
  
  <style scoped>
  .analytics-page {
    background-color: #f5e3d4;
    min-height: 100vh;
  }
  
  .date-selector {
    background-color: #f2e9e4;
  }
  
  .time-frame-switch button {
    transition: background-color 0.3s ease;
  }
  
  .time-frame-switch button:hover {
    background-color: #dedede;
  }
  
  .main-content {
    background-color: transparent;
    /* Use CSS Grid with 3 columns: 2 for meal cards, 1 for the NutrientWidget */
  }
  
  .meal-cards {
    grid-column: span 2;
  }
  
  .meal-type-card,
  .lunch-card,
  .dinner-card,
  .other-card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .nutrient-widget-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  </style>
  