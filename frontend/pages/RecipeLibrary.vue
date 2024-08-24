<template>
  <div class="absolute w-screen z-40">
    <Header />
  </div>
  <div class="relative min-h-screen text-white">
    <!-- Background image section -->
    <div class="bg-header-image flex flex-col items-center justify-center relative-parent">
      <h2 class="text-white text-4xl font-bold text-center">Recipe Library</h2>
      <p class="mt-[145px] text-xl text-center italic">Because healthy food should be tasty too.</p>
      <!-- Curvy SVGs -->
      <div class="curvy-left">
        <img src="/assets/img/curvyLeft.svg" alt="Curvy Left" />
      </div>
      <div class="curvy-right">
        <img src="/assets/img/curvyRight.svg" alt="Curvy Right" />
      </div>
    </div>

    <!-- Search Bar and Recipe Cards Container -->
    <div class="content-container">
      <div class="flex justify-center mb-10">
        <MealSearchBar />
      </div>

      <!-- Scrollable Recipe Cards -->
      <div class="scroll-content">
        <div class="cards-grid">
          <RecipeCard
            v-for="(meal, index) in meals"
            :key="index"
            :imageSrc="meal.imageSrc"
            :mealName="meal.mealName"
            :mealDescription="meal.mealDescription"
            :labels="meal.labels"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePage",
  data() {
    return {
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
          imageSrc: "assets/img/pasta.svg",
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
          imageSrc: "assets/img/pasta.svg",
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
          imageSrc: "assets/img/pasta.svg",
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
          imageSrc: "assets/img/pasta.svg",
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
          imageSrc: "assets/img/pasta.svg",
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
          imageSrc: "assets/img/pasta.svg",
          mealName: "Pan-Fried Salmon and Fruit Salad",
          mealDescription: "Rich and creamy pasta that’s a treat for any dinner occasion.",
          labels: [
          { name: "Breakfast", active: true },
            { name: "Lunch", active: false },
            { name: "Dinner", active: true },
            { name: "Snack", active: false },
          ],
        }
        // Add more meal objects as needed
      ],
    };
  },
};
definePageMeta({
  layout: "emptylayout",
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
  font-family: 'Overpass', sans-serif;
}

.bg-header-image {
  background-image: url('@/assets/img/smallerBlob.svg');
  background-size: 110% auto;
  background-repeat: no-repeat;
  background-position: center;
  height: 50vh;
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
}

/* Scrollable Content */
.scroll-content {
  height: calc(100vh - 50vh); /* Remaining height after the header */
  overflow-y: auto;
  padding-top: 20px;
  padding-right: 0; /* Removed right padding to bring scrollbar closer */
  scrollbar-width: thin;
  scrollbar-color: #888 #e0e0e0;
  z-index:3;
}

.scroll-content::-webkit-scrollbar {
  width: 8px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.scroll-content::-webkit-scrollbar-track {
  background-color: #e0e0e0;
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
</style>
