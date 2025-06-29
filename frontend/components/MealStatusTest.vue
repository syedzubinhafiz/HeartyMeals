<template>
  <div class="test-container p-6 bg-gray-50 rounded-lg">
    <h2 class="text-xl font-bold mb-4">TASK-009 Visual Indicators Test</h2>
    
    <!-- Test meal cards with different states -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="test-card consumed" :class="getMealStatusStyling(true).cardClass">
        <div class="p-4">
          <h3 class="font-semibold">Consumed Meal Example</h3>
          <p :class="getMealStatusStyling(true).textClass">
            {{ getMealStatusStyling(true).statusText }}
          </p>
        </div>
      </div>
      
      <div class="test-card planned" :class="getMealStatusStyling(false).cardClass">
        <div class="p-4">
          <h3 class="font-semibold">Planned Meal Example</h3>
          <p :class="getMealStatusStyling(false).textClass">
            {{ getMealStatusStyling(false).statusText }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Test actions -->
    <div class="actions space-x-4">
      <button @click="testConsumeMeal" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Test Consume Meal
      </button>
      <button @click="testBulkConsume" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Test Bulk Consume
      </button>
      <button @click="testRemoveMeal" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
        Test Remove Meal
      </button>
    </div>
    
    <!-- Test results -->
    <div v-if="testResults.length" class="mt-6">
      <h3 class="font-semibold mb-2">Test Results:</h3>
      <ul class="space-y-1">
        <li v-for="(result, index) in testResults" :key="index" 
            :class="result.success ? 'text-green-600' : 'text-red-600'">
          {{ result.message }}
        </li>
      </ul>
    </div>

    <!-- Status Text Test Section -->
    <div class="fallback-test mt-6">
      <h3 class="text-lg font-semibold mb-3">Status Text Test</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Status Text Version -->
        <div class="test-card border p-4 rounded">
          <h4 class="font-medium mb-2">Status Text Display</h4>
          <div class="flex items-center gap-4">
            <span class="text-green-600 font-medium">Consumed</span>
            <span class="text-orange-600 font-medium">Planned</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMealActions } from '@/composables/mealActions.js';

const { consumeMeal, removeMeal, bulkConsumeMeals, getMealStatusStyling } = useMealActions();

const testResults = ref([]);

// Mock meal data for testing
const mockMeal = {
  id: 'test-meal-123',
  name: 'Test Meal',
  type: 'breakfast',
  created_at: new Date().toISOString()
};

const mockMeals = [
  { id: 'test-1', name: 'Test Meal 1', type: 'breakfast' },
  { id: 'test-2', name: 'Test Meal 2', type: 'lunch' },
  { id: 'test-3', name: 'Test Meal 3', type: 'dinner' }
];

function addTestResult(message, success = true) {
  testResults.value.push({ message, success, timestamp: new Date() });
}

async function testConsumeMeal() {
  addTestResult('Testing single meal consumption...', true);
  const success = await consumeMeal(mockMeal, (mealId) => {
    addTestResult(`✅ Meal ${mealId} consumed successfully!`, true);
  });
  
  if (!success) {
    addTestResult('❌ Single meal consumption failed', false);
  }
}

async function testBulkConsume() {
  addTestResult('Testing bulk meal consumption...', true);
  const success = await bulkConsumeMeals(mockMeals, (successCount, totalCount) => {
    addTestResult(`✅ Bulk consume: ${successCount}/${totalCount} meals processed`, true);
  });
  
  if (!success) {
    addTestResult('❌ Bulk meal consumption failed', false);
  }
}

async function testRemoveMeal() {
  addTestResult('Testing meal removal...', true);
  const success = await removeMeal(mockMeal, (mealId) => {
    addTestResult(`✅ Meal ${mealId} removed successfully!`, true);
  });
  
  if (!success) {
    addTestResult('❌ Meal removal failed', false);
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
}

.test-card {
  position: relative;
  border: 2px solid;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.test-card.consumed {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.4);
}

.test-card.planned {
  background-color: rgba(251, 146, 60, 0.1);
  border-color: rgba(251, 146, 60, 0.4);
}

/* Status text styling removed, just using Tailwind classes now */
</style> 