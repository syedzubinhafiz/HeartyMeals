<template>
    <div class="add-meals-page">
      <Header/>
      
      <div class="search-bar">
        <input type="text" placeholder="Enter Keywords" class="search-input">
        <button class="stomach-button">
          <img src="path-to-stomach-icon.svg" alt="Stomach" />
          <span class="notification-badge">3</span>
        </button>
      </div>
      
      <section class="recently-added">
        <h2>Recently Added</h2>
        <div class="meal-cards">
          <div class="meal-card customize">
            <p>+ Customize Your Meal</p>
          </div>
          <MealCard
            v-for="meal in meals"
            :key="meal.id"
            :meal="meal"
          />
        </div>
      </section>
      <Footer/>
    </div>
  </template>


<script setup>
const meals = [
  {
    id: 1,
    title: "Overnight Oats",
    description: "A hearty breakfast that is filling yet packed with juicy fruits to start your day off.",
    imageUrl: "path-to-overnight-oats-image.png",
    tags: ["Breakfast", "Lunch", "Dinner", "Snack"]
  },
  {
    id: 2,
    title: "Banana Cake",
    description: "A delicious cake that is full of nutrients with a sweet banana twist.",
    imageUrl: "path-to-banana-cake-image.png",
    tags: ["Breakfast", "Lunch", "Dinner", "Snack"]
  },
  // Add more meals as necessary...
];
</script>


<style scoped>
.add-meals-page {
  padding: 20px;
  background-color: #f5d6b1; /* Adjust the background color */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1f6e5f; /* Header background color */
  padding: 20px;
  color: white;
}

.page-title {
  font-size: 24px;
  margin: 0 auto;
}

.search-bar {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 10px;
  border-radius: 25px;
  border: 1px solid #ccc;
}

.stomach-button {
  background-color: #ff7f50;
  border: none;
  padding: 10px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  position: relative;
}

.notification-badge {
  background-color: red;
  border-radius: 50%;
  color: white;
  padding: 5px;
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 12px;
}

.recently-added {
  margin-top: 20px;
}

.meal-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meal-card {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  width: 200px; /* Adjust to fit your layout */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.customize {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>
