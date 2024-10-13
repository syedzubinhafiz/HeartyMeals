<template>
    <div class="filter-overlay" @mouseleave="hideOverlay">
      <div class="filter-item">
        <label for="cuisine" class="label-format">Cuisine</label>
        <MultiSelectionWSearchbarDropdown
            ref="cuisineDropdown"
            :items="cuisine_dropdown_option"
            @items-selected="updateSelectedCuisine"
            defaultText="Select Cuisine"
            buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
            dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
        />
      </div>
      <div class="filter-item">
        <label for="dietary" class="label-format">Dietary</label>
        <MultiSelectionWSearchbarDropdown
            ref="dietaryDropdown"
            :items="dietaries_dropdown_option"
            @items-selected="updateSelectedDietary"
            defaultText="Select Dietary"
            buttonStyle="border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10;"
            dropdownStyle="border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px;z-index: 25;"
          />
      </div>
      <div class="filter-item">
        <label for="food-category" class="label-format">Food Category</label>
        <MultiSelectionWSearchbarDropdown
            ref="foodCategoryDropdown"
            :items="food_categories_dropdown_option"
            @items-selected="updateSelectedFoodCategory"
            defaultText="Select Food Category"
            buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10;"
            dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px;z-index: 25;"
        />
      </div>
      <div class="filter-item">
        <label class="label-format">Recommended Meal Time</label>
        <div class="checkbox-group-grid">
          <label><input type="checkbox" value="Breakfast" class="large-checkbox" v-model="filters.recommended_meal_time.Breakfast" /> Breakfast</label>
          <label><input type="checkbox" value="Lunch" class="large-checkbox" v-model="filters.recommended_meal_time.Lunch" /> Lunch</label>
          <label><input type="checkbox" value="Dinner" class="large-checkbox" v-model="filters.recommended_meal_time.Dinner" /> Dinner</label>
          <label><input type="checkbox" value="Other" class="large-checkbox" v-model="filters.recommended_meal_time.Other" /> Other</label>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 30% 20% 20% 30%;">
        <div></div>
        <ButtonGreen @click="applyFilters">Apply</ButtonGreen>
        <ButtonGreen @click="clearFilters">Clear Filters</ButtonGreen>
        <div></div>
        </div>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useNuxtApp } from '#app';
  import MultiSelectionWSearchbarDropdown from './Dropdown/MultiSelectionWSearchbarDropdown.vue';
  import ButtonGreen from './Button/Green.vue';
  
  const { $axios } = useNuxtApp();
  const emit = defineEmits(['hideOverlay', 'applyFilters', 'clearFilters']);
  
  const cuisine_dropdown_option = ref([]);
  const dietaries_dropdown_option = ref([]);
  const food_categories_dropdown_option = ref([]);
  const cuisineDropdown = ref(null);
    const dietaryDropdown = ref(null);
    const foodCategoryDropdown = ref(null);

  try {
    // Get all cuisines
    const cuisine_response = await $axios.get('/cuisine', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      }
    });
    const dietary_response = await $axios.get('/dietary', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      }
    });
    const food_category_response = await $axios.get('/food_category/get', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      }
    });
  
    cuisine_response.data.forEach(cuisine => {
      cuisine_dropdown_option.value.push({
        id: cuisine.id,
        display: cuisine.name
      });
    });
  
    dietary_response.data.forEach(dietary => {
      dietaries_dropdown_option.value.push({
        id: dietary.id,
        display: dietary.name
      });
    });
  
    food_category_response.data.forEach(food_category => {
      food_categories_dropdown_option.value.push({
        id: food_category.id,
        display: food_category.type
      });
    });
  
  } catch (error) {
    console.log(error);
  }
  
  const filters = ref({
    cuisine: [],
    dietary: [],
    foodCategory: [],
    recommended_meal_time: {
      Breakfast: false,
      Lunch: false,
      Dinner: false,
      Other: false
    },
  });
  
  const hideOverlay = () => {
    emit('hideOverlay');
  };
  
  const applyFilters = () => {
    emit('applyFilters', filters.value);
    hideOverlay();
  };
  
  const clearFilters = () => {
  filters.value = {
    cuisine: [],
    dietary: [],
    foodCategory: [],
    recommended_meal_time: {
      Breakfast: false,
      Lunch: false,
      Dinner: false,
      Other: false
    },
  };
  cuisineDropdown.value.reset();      
    dietaryDropdown.value.reset();
    foodCategoryDropdown.value.reset();
  emit('clearFilters');
};

  const updateSelectedCuisine = (selectedItems) => {
    filters.value.cuisine = selectedItems;
  };
  
  const updateSelectedDietary = (selectedItems) => {
    filters.value.dietary = selectedItems;
  };
  
  const updateSelectedFoodCategory = (selectedItems) => {
    filters.value.foodCategory = selectedItems;
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
  
  * {
    font-family: 'Overpass', sans-serif;
  }
  
  .filter-overlay {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr;
    width: 70%;
    top: 50px; /* Adjust based on your layout */
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 2.5% 2.5%;
    z-index: 50;
    border-radius: 5%;
  }
  
  .filter-item {
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 35% 65%;
    padding-bottom: .5%;
  }
  
  .filter-toggles {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .label-format {
    font-family: 'Overpass', sans-serif;
    font-weight: 600; /* SemiBold */
    font-size: 14px;
    align-self: center;
    letter-spacing: normal; /* Auto */
    text-transform: none; /* No text transformation */
    text-align: left; /* Left align */
  }
  
  .checkbox-group-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .large-checkbox {
    width: 15px;
    height: 15px;
  }
  </style>
  