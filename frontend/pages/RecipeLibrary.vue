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
                v-for="(meal, index) in paginatedMeals"
                :key="index"
                :imageSrc="meal.imageSrc"
                :mealName="meal.mealName"
                :mealDescription="meal.mealDescription"
                :labels="meal.labels"
                @click.native="openOverlay(meal)"
              />
            </div>
        </div>
        <!-- Pagination Component -->
        <Pagination
            :totalItems="meals.length"
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
onMounted(async () => {
  console.log("AAAA")
  await useApi("/dietary","GET")
  // console.log(await useApi("/dietary","GET"))
  const results = await useApi("/recipe/add","POST",  {"recipe": {
        "name": "White Soy Sauce Beef",
        "description": "wow so cool",
        "instruction": ["instruction"],
        "servingSize": 1,
        "mealTimeRecommendation": {
            "Breakfast" : true,
            "Lunch" : true,
            "Dinner": false
        },
        "visibility": "Public",
        "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
        "dietaryId": "6723c1d3-e47a-46bc-9048-780db825043c"
    },
    "components": [
        {
            "componentId": "194f8640-2f99-4baf-8d60-350993b53fb8",
            "amount" : 69,
            "unit": "g"
        },
        {
            "componentId": "79338f94-f372-41ec-a932-d56a582d303b",
            "amount" : 20,
            "unit": "g"
        }
    ]})
  console.log(results)
  // const recipeData = await useApi("/recipe/get?page=1&pageSize=10","GET")
  // console.log(recipeData)
})
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
      isOverlayVisible: false,
      selectedMeal: null,
      currentPage: 1,
      itemsPerPage: 6,
      meals: [
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Tomato and Cheese Croissant",
          mealDescription: "Incredible flavour-packed croissant that serves just nice for a tea time snack.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: false },
            { name: "Snack", active: true },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Banana Cake",
          mealDescription: "A delicious cake that is full of nutrients with a sweet banana twist.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Overnight Oats",
          mealDescription: "A hearty breakfast that is filling yet packed with juicy fruits to start your day off.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Bok Choy",
          mealDescription: "A healthy amount of fiber to pair with your lunch meal along with other dishes.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Creamy Alfredo Pasta",
          mealDescription: "Rich and creamy pasta that’s a treat for any dinner occasion.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Creamy Alfredo Pasta",
          mealDescription: "Rich and creamy pasta that’s a treat for any dinner occasion.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        },
        {
          imageSrc: "assets/img/croissant.svg",
          mealName: "Pan-Fried Salmon and Fruit Salad",
          mealDescription: "Rich and creamy pasta that’s a treat for any dinner occasion.",
          labels: [
            { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        }
      ],
    };
  },
  computed: {
    paginatedMeals() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.meals.slice(start, end);
    },
  },
  methods: {
    openOverlay(meal) {
      this.selectedMeal = meal;
      this.isOverlayVisible = true;
    },
  },
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
