<template>
  <div class="page-container" @click="handleClickOutside">
    
    <div v-if="userRole === 'admin'">
      <header class="header">
        <AdminHeader></AdminHeader>
      </header>
    </div>
    <div v-else>
      <header class="header">
        <Header></Header>
      </header>
    </div>
    

    <div class="image-container">
      <img src="/assets/img/backGround.svg" class="background-image"/>
      <div class="text-overlay">
        <h2 class="text-white text-2xl sm:text-3xl font-bold text-center">Recipe Library</h2>
        <p class="mt-[15px] text-white text-lg sm:text-xl text-center italic">Because healthy food should be tasty too.</p>
      </div>
    </div>

    <div class="body">
      <div class="search-bar" ref="searchBar">
        <img src="../assets/icon/Search_Icon.svg" alt="Search Icon">
        <input
          type="text"
          v-model="query"
          @input="debouncedOnInput"
          placeholder="Enter Keywords (e.g. Chicken, Rice)"
          class="search-input"
          aria-label="Search Recipe"
        />
        <img :src="filter_on ? activeFilterIcon : filterIcon" alt="Filter" class="filter-button" @click="toggleFilterOverlay">
        <RecipeFilterOverlay 
          v-show="isFilterOverlayVisible" 
          @hideOverlay="isFilterOverlayVisible = false" 
          @applyFilters="applyFilters"
          @clearFilters ="clearFilters"
         />
      </div>

      <div class="search-result-text-display">
        <p class="aligned-paragraph" style="font-size: 15px; margin-top: 20px;" v-if="query">Search Result of "{{ query }}"</p>
        <p class="aligned-paragraph" style="font-size: 15px; margin-top: 20px;" v-if="!query">Recently Added</p>
      </div>

      <div class="search-result-wrapper">
        <div class="search-result-container" @scroll="onScroll">
          <div class="search-result-item-display">
            <RecipeCard 
            v-for="(recipe, index) in searchResults" 
            :key="index"
            :meal-id="recipe.id" 
            :meal-name="recipe.name"
            :meal-description="recipe.description"
            :labels="recipe.recommended_meal_time ?? {}"
            :is-custom-recipe="recipe.user && recipe.user.user_id != null && recipe.user.user_id !== undefined"
            :is-admin-approved="recipe.is_approved"
            :image-src="recipe.storage_links.thumbnail"
            @click.native="openOverlay(recipe)"     
            />
            <div v-if="isLoading" class="loading-indicator">Loading...</div>
          </div>
        </div>
      </div>
    </div>
    <RecipeOverlay
    :visible="isOverlayVisible"
    :meal="selectedRecipe"
    :instruction="instruction"
    @closeOverlay="isOverlayVisible = false"
    />
    <footer class="footer">
      <Footer></Footer>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useNuxtApp } from '#app';
import debounce from 'lodash/debounce';
import RecipeOverlay from '/components/RecipeOverlay.vue';
import RecipeFilterOverlay from '/components/RecipeFilterOverlay.vue';
import filterIcon from '@/assets/icon/filter-icon.svg';
import activeFilterIcon from '@/assets/icon/active-filter-icon.svg';


const { $axios } = useNuxtApp();

definePageMeta({
  layout: "emptylayout",
  middleware: ["auth"],
});

// for search query 
const isLoading = ref(false);
const query = ref("");
const searchResults = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// for overlay
const recipeList = ref([])
const searchValue = ref("");
const searchDataList = ref([]);
const instruction = ref('');

const isOverlayVisible = ref(false)
const selectedRecipe = ref(null)
const userRole = ref(null);

// for filter overlay
const isFilterOverlayVisible = ref(false);
const searchBar = ref(null);
const filter_on = ref(false);
const savedFilters = ref({
  cuisine: [],
  dietary: [],
  food_category: [],
  recommended_meal_time: {
    Breakfast: false,
    Lunch: false,
    Dinner: false,
    Other: false,
  },
});

watch(query, (newQuery) => {
  if (newQuery === '') {
    pageNumber.value = 1;
    totalPages.value = 1;
    searchResults.value = [];
    fetchData(savedFilters.value);
  }
});

async function fetchData(filters = {}) {
  console.log('fetchData called with filters:', filters); // Debug log

  if (
    isLoading.value || pageNumber.value > totalPages.value
  )
    return;

  console.log('fetchData called'); // Debug log

  isLoading.value = true;
  const token = localStorage.getItem('accessToken');
  try {
    let suffix = '/recipe/get';
    let  meal_type = []

    if(filters.recommended_meal_time.Breakfast) meal_type.push('Breakfast')
    if(filters.recommended_meal_time.Lunch) meal_type.push('Lunch')
    if(filters.recommended_meal_time.Dinner) meal_type.push('Dinner')
    if(filters.recommended_meal_time.Other) meal_type.push('Other')

    // Ensure meal_type is an array of strings
    if (Array.isArray(meal_type)) {
      meal_type = meal_type.map(item => item.toString());
    } else {
      meal_type = [];
    }

    const response = await $axios.get(suffix, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page: pageNumber.value,
        pageSize: pageSize.value,
        search: query.value || undefined,
        cuisine: JSON.stringify(filters.cuisine) || [],
        dietary: JSON.stringify(filters.dietary) || [],
        food_category: JSON.stringify(filters.foodCategory) || [],
        mealType: meal_type.length > 0 ? JSON.stringify(meal_type) : undefined
      },
    });

    const data = response.data;

    if (!data.data || data.data.length === 0) {
      isLoading.value = false;
      return;
    }
    searchResults.value = [...searchResults.value, ...data.data];
    totalPages.value = data.totalPages;
    pageNumber.value += 1;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

async function verifyAdmin(){
  const token = localStorage.getItem('accessToken');
  try {
    const response = await $axios.get('/user/verify/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    if (response.data) {
      userRole.value = 'admin';
    } else {
      userRole.value = 'patient';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const debouncedOnInput = debounce(async () => {
  pageNumber.value = 1;
  totalPages.value = 1;
  searchResults.value = [];
  await fetchData(savedFilters.value);

}, 300);

function onScroll(event) {
  const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;
  if (bottom) {
    fetchData(savedFilters.value);
  }
} 

onMounted(async() => {
  fetchData(savedFilters.value);
  document.addEventListener('click', handleClickOutside);

  if(localStorage.getItem("recipeId")) {
    const meal = {id: localStorage.getItem("recipeId")}
    openOverlay(meal)
    localStorage.removeItem("recipeId")
  }

  await verifyAdmin();
  
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const openOverlay = async (meal) => {
  try {
    const response = await $axios.get(`/recipe/get?recipeId=${meal.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    const detailedRecipeInfo = ref(response.data);
    console.log(detailedRecipeInfo)
    selectedRecipe.value = detailedRecipeInfo.value
    instruction.value = detailedRecipeInfo.value.recipe.instruction
    isOverlayVisible.value = true
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

const toggleFilterOverlay = () => {
  isFilterOverlayVisible.value = !isFilterOverlayVisible.value;
}

const applyFilters = async (filters) => {
  savedFilters.value = filters; // Save the filters
  if (filterOn()){
    filter_on.value = true;
  } else {
    filter_on.value = false;
  }
  debouncedOnInput(); // Fetch data with the new filters
}

function filterOn(){
  if (savedFilters.value.cuisine.length > 0) return true;
  if (savedFilters.value.dietary.length > 0) return true;
  if (savedFilters.value.foodCategory.length > 0) return true;
  if (savedFilters.value.recommended_meal_time.Breakfast) return true;
  if (savedFilters.value.recommended_meal_time.Lunch) return true;
  if (savedFilters.value.recommended_meal_time.Dinner) return true;
  if (savedFilters.value.recommended_meal_time.Other) return true;
}

const clearFilters = () => {
  savedFilters.value = {
    cuisine: [],
    dietary: [],
    foodCategory: [],
    recommended_meal_time: {
      Breakfast: false,
      Lunch: false,
      Dinner: false,
      Other: false,
    },
  };
  filter_on.value = false;
  debouncedOnInput();
}



const handleClickOutside = (event) => {
  if (searchBar.value && !searchBar.value.contains(event.target)) {
    isFilterOverlayVisible.value = false;
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  --header-height: 4rem;
  --footer-height: 6rem;
  padding-top: var(--header-height);
}

@media (min-width: 1024px) {
  .page-container {
    --header-height: 5rem;
    --footer-height: 7rem;
  }
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 40;
}

.image-container {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  height: 200px;
  z-index: 5;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-overlay {
  position: absolute;
  width: 100%;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 1rem;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
  padding: 200px 1rem calc(var(--footer-height) + 2rem);
  margin-top: -50px;
  z-index: 10;
  overflow: hidden;
  box-sizing: border-box;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 8px 15px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  align-self: center;
  padding: 5px;
}

.search-input:focus {
  outline: none;
}

.search-result-item-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-gap: 15px;
  padding: 15px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .search-result-item-display {
    grid-template-columns: repeat(2, 1fr);
  }
}

.search-result-text-display {
  height: auto;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  padding-bottom: 10px;
  margin-top: 20px;
}

.search-result-wrapper {
  width: 100%;
  max-width: 1200px;
  /* Set a fixed height that ends before footer */
  height: calc(100vh - var(--header-height) - 200px - var(--footer-height) - 6rem);
  position: relative;
  overflow: hidden;
}

.search-result-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /* Add padding to prevent cards from touching */
  padding-bottom: 2rem;
  box-sizing: border-box;
  /* Hide default scrollbar and create custom one */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.search-result-container::-webkit-scrollbar {
  display: none;
}

/* Remove the custom scrollbar indicator completely */

.aligned-paragraph {
  text-align: left;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.filter-button {
  cursor: pointer;
  height: 24px;
}
</style>
