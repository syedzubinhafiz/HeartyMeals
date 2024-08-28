<template>
    <div class="summary-page">
    <div class="absolute w-screen z-40">
        <Header/>
    </div>
    <div class="content">
        <button class="back-button">← Back</button>
        <h2 class="page-title">Summary</h2>
        <div class="main-content">
            <div class="summary-container">
                <SummaryCard 
                v-for="item in summaryItems" 
                :key="item.id" 
                :item="item"
                :itemNumber="index + 1"
                />
            </div>
            <div class="nutrition-summary">
                <NutrientWidgetDelta />
            </div>
        </div>
  <div class="button-container"> 
    <button class="done-button">
        <img src="/assets/img/done-icon.svg" alt="done" class="done-icon"/>
        Done
    </button>
    </div> 
</div>
<div class="section flex flex-col justify-end">
            <Footer/>
        </div>
</div>
</template>
<script setup>
defineOptions({
	name: "HomePage",
});


definePageMeta({
	layout: "emptylayout"
});


const summaryItems = [
{
    id: 1,
    title: 'Tomato and Cheese Croissant',
    description: 'Incredible flavour-packed croissant that serves just nice for a tea time snack.',
    info: 'Click to show nutrition information.',
    imageUrl: 'assets/img/Tomato-&-Mozzeralla-Croissant_0.png',
    nutritionInfo: {
      Calories: '240 kcal',
      Carbohydrates: '14g',
      Protein: '28g',
      Fats: ` 8g`,
      Sodium: '8g',
      Cholesterol: '50mg'
    }
},
{
    id: 2,
    title: 'Pan Seared Salmon with Asparagus',
    description: 'This incredible salmon fills your protein of the day whilst not compromising in flavour.',
    info: 'Click to show more information.',
    imageUrl: 'assets/img/Tomato-&-Mozzeralla-Croissant_0.png',
    nutritionInfo: {
      Calories: '240 kcal',
      Carbohydrates: '14g',
      Protein: '28g',
      Fats: ` 8g`,
      Sodium: '8g',
      Cholesterol: '50mg'
    }
},
  {
    id: 3,
    title: 'Custom Recipe 1',
    description: 'A custom recipe.',
    info: 'Click to show more information.',
    imageUrl: 'assets/img/Tomato-&-Mozzeralla-Croissant_0.png',
    nutritionInfo: {
      Calories: '240 kcal',
      Carbohydrates: '14g',
      Protein: '28g',
      Fats: ` 8g`,
      Sodium: '8g',
      Cholesterol: '50mg'
    }
  },
  {
    id: 4,
    title: 'Custom Recipe 1',
    description: 'A custom recipe.',
    info: 'Click to show more information.',
    imageUrl: 'assets/img/Tomato-&-Mozzeralla-Croissant_0.png',
    nutritionInfo: {
      Calories: '240 kcal',
      Carbohydrates: '14g',
      Protein: '28g',
      Fats: ` 8g`,
      Sodium: '8g',
      Cholesterol: '50mg'
    }
  },
  {
    id: 5,
    title: 'Custom Recipe 1',
    description: 'A custom recipe.',
    info: 'Click to show more information.',
    imageUrl: 'assets/img/Tomato-&-Mozzeralla-Croissant_0.png',
    nutritionInfo: {
      Calories: '240 kcal',
      Carbohydrates: '14g',
      Protein: '28g',
      Fats: ` 8g`,
      Sodium: '8g',
      Cholesterol: '50mg'
    }
  }

// ... other items
]

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro&display=swap');
*{
    font-family: 'Overpass', sans-serif;
}
.summary-page {
    position: relative;
  min-height: 100vh;
  background-image: url('/assets/img/Design.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-position: center;
  overflow-x: hidden;
}

.content {
    position: relative;
  z-index: 1;
  margin-top: 100px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
}
@media (max-width: 600px) {
  .summary-page {
    background-size: cover;
  }
}

.main-content {
    display: flex;
  flex-grow: 1;
  gap: 20px;
  margin-bottom: 20px;
}
.summary-container {
    width: 50%;
    overflow-y: auto;
    height: calc(3 * 120px); /* Assumes each SummaryCard is about 120px high */
    padding-right: 20px;
}

.back-button {
    background-color: #87A98D;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 10px;
    margin-bottom: 5px;
    height: 40px;
    width: 120px;
    font-size: 20px;
    align-self: flex-start;

}

.page-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 30px;
}

.done-button {
    background-color: #87A98D;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    height: 45px;
    width: 140px;
    font-size: 20px;
    display: flex;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nutrition-summary {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 20px;
    width: 100%;
}

.done-icon {
  width: 24px;
  height: 24px;
  margin-left: 8px;
}
</style>