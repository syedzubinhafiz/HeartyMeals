<template>
  <div class="absolute w-screen z-40">
    <Header />
  </div>

  <div class="relative min-h-screen text-white">
    <!-- Background image section -->
    <div class="bg-header-image flex flex-col items-center justify-center relative-parent">
      <h2 class="text-white text-4xl font-bold text-center">Recipe Library</h2>
      <p class="mt-[15px] text-xl text-center italic">Because healthy food should be tasty too.</p>
    </div>

    <!-- Search Bar and Recipe Cards Container -->
    <div class="flex items-end justify-between">
      <div class="left-0 bottom-0 flex items-end">
        <img src="/assets/img/curvyLeft.svg" alt="Curvy Left" style="height: 60vh"/>
      </div>
      <div>
        <div class="content-container">

          <div class="flex justify-center mb-10 text-black">
            <MealSearchBar v-model="searchValue" :dataList="['Tomato and Cheese Croissant','Banana Cake', 'Overnight Oats', 'Bok Choy', 'Creamy Alfredo Pizza']"/>
          </div>

          <!-- Scrollable Recipe Cards -->
            <div class="cards-grid">
              <RecipeCard
                v-for="(meal, index) in paginatedMealList"
                :key="index"
                :imageSrc="'../assets/img/croissant.svg'"
                :mealName="meal.name"
                :mealDescription="meal.description"
                :labels="meal.recommended_meal_time ?? {}"
                @click.native="openOverlay(meal)"
              />
            </div>
        </div>
        <!-- Pagination Component -->
        <Pagination
            :totalItems="recipeList.length"
            :itemsPerPage="itemsPerPage"
            v-model:currentPage="currentPage"
          />
      </div>
      <!-- <div class="right-0 bottom-0 flex items-end"> -->
        <img src="/assets/img/curvyRight.svg" alt="Curvy Right" style="height: 50vh"/>
    </div>
  </div>
  <RecipeOverlay
    :visible="isOverlayVisible"
    :meal="selectedMeal"
    @closeOverlay="isOverlayVisible = false"
  />
  <Footer/>
</template>
<script setup>
const recipeList = ref([])
onMounted(async () => {
  console.log("AAAA")
  await useApi("/dietary","GET")
  // console.log(await useApi("/dietary","GET"))
  recipeList.value = await useFillData().fillRecipes()
  console.log(recipeList)
})
const isOverlayVisible = ref(false)
const selectedMeal = ref(null)
const currentPage = 1
const itemsPerPage = 6
const paginatedMealList = computed({
  get() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return recipeList.value?.value?.slice(start, end);
    },
})

const openOverlay = async (meal) => {
  const detailedMealInfo = await useApi(`/recipe/get?recipeId=${meal.id}`,"GET")
  console.log(detailedMealInfo)
  selectedMeal.value = detailedMealInfo
  isOverlayVisible.value = true
}
</script>
<script>
definePageMeta({
    layout: "emptylayout",
});

import RecipeOverlay from '/components/RecipeOverlay.vue';
import Pagination from '/components/Pagination.vue';
export default {
  name: "RecipePage",
  components: {
    Pagination,
    RecipeOverlay,
  },
  data() {
    return {
      searchValue: "",
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
  font-family: 'Overpass', sans-serif;
}

.bg-header-image {
  background-image: url('@/assets/img/smallerBlob.svg');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center;
  height: 35vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  position: relative;
}

/* Container for Search Bar and Recipe Cards */
.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 0;
  margin-bottom: 0;
}


.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 20px; /* Space between cards */
  padding-left: 85px;
  padding-right: 85px;
  z-index:3;
}



/* Styling the curvy blobs */
.curvy-left {
  position: absolute;
  bottom: 0;
  left: -55px;
  top: 310px;
  width: 150px;
  height: 500px;
  z-index: 1;
}

.curvy-right {
  position: absolute;
  bottom: 0;
  right: 0;
  top: 310px;
  width: 130px;
  height: 500px;
  z-index: 1;
}

.curvy-left img,
.curvy-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cards-grid, .pagination {
  margin-bottom: 20px; /* Reduce if this is too large */
}
.relative {
  min-height: auto;  /* Adjust this from min-h-screen or 100vh to auto */
}
.cards-grid, .content-container {
  margin-bottom: 0;  /* Ensure bottom margins are minimal */
  padding-bottom: 0;
}

.bg-header-image, .cards-grid {
  margin-bottom: 0px; /* Reduce or adjust based on your needs */
}
/* If your main container uses flex, make sure it's not spreading items too much */
.main-container {  /* Replace .main-container with actual class or element */
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* Change this if necessary */
}
.footer {  /* Add or modify an existing class */
  position: relative;  /* Position it relative to its natural flow */
}


</style>
