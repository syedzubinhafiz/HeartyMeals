<template>
  <div class="add-meal-overlay" v-if="visible">
    <div class="overlay-header">
      <button @click="closeOverlay" class="close-button">+</button>
      <span> Recipe</span>
      <hr>
    </div>

    <div class="overlay-body">
      <div class="image-title-container">
        <span style="font-weight: bold; font-size: 120%;">{{ meal.recipe.name }}</span>
        <img :src="meal.recipe.storage_links.thumbnail" alt="" style="object-fit: cover; height: 250px; width: 250px;">
      </div>

      <div class="portion-nutrient-container">
        <div class="portion-container">
          <span style="font-weight: bold; font-size: 90%; align-self: center;">Portion</span>
          <input type="number" id="selectedPortion" step="0.5" min="0.5" placeholder="Portion" v-model="portion" @input="applyChanges">
        </div>
        <div style="z-index: 102;">
          <div v-for="(nutrient, index) in nutrients" :key="index" class="tooltip-wrapper">
            <div 
              class="tooltip-container"
              @mouseenter="showTooltip(index)" 
              @mouseleave="hideTooltip"
            >
              <NutritionBar
                :icon="nutrient.icon"
                :label="nutrient.label"
                :totalValue="userDailyBudget[nutrient.key]"
                :currentValue="userRemainingNutrients[nutrient.key]"
                :afterMealValue="afterAddingMeal[nutrient.key]"
                :unit="nutrient.unit"
                :maxColor="nutrient.maxColor"
                :currentColor="nutrient.currentColor"
                :afterMealColor="nutrient.afterMealColor"
                :fontColor="nutrient.fontColor"
                :progressBarContainerStyle="'margin-top: 0.25%; margin-bottom: 0.25%;'"
              />
              <div v-if="activeTooltip === index" class="custom-tooltip">
                <div v-for="line in tooltips[index]" :key="line">
                  {{ line }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ingredients section -->
      <div class="component-container">
        <span style="font-weight: bold; font-size: 100%; align-self: center;">Ingredients</span>
        <div class="component-item-container">
          <div v-for="ingredient in meal.components.ingredients" :key="ingredient.name" class="individual-component-container">
            <img :src="ingredient.storage_links.thumbnail" style="border-radius: 15px; object-fit: cover; width: 100px;">
            <div class="component-name-amount-container">
              <span>{{ ingredient.name }}</span>
              <div class="component-amount-container">
                <label>Amount: </label>
                <span>{{ (portion > 0) ? parseFloat((ingredient.amount * portion/meal.recipe.serving_size).toFixed(2)) : parseFloat((ingredient.amount/meal.recipe.serving_size).toFixed(2)) }} {{ ingredient.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seasonings section -->
      <div class="component-container">
        <span style="font-weight: bold; font-size: 100%; align-self: center;">Seasonings</span>
        <div class="component-item-container">
          <div v-for="seasoning in meal.components.seasonings" :key="seasoning.name" class="individual-component-container">
            <img :src="seasoning.storage_links.thumbnail" style="border-radius: 15px; object-fit: cover; width: 100px;">
            <div class="component-name-amount-container">
                <span>{{ seasoning.name }}</span>
                <div class="component-amount-container">
                    <label>Amount: </label>
                    <span>{{ (portion > 0) ? parseFloat((seasoning.amount * portion/meal.recipe.serving_size).toFixed(2)) : parseFloat((seasoning.amount/meal.recipe.serving_size).toFixed(2)) }} {{ seasoning.unit }}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="add-to-stomach-button" @click="addMeal">
      <img src="@/assets/img/meal_logging/add_to_stomach_button.svg" class="add-button">
      Add to Stomach
    </button>

    <img src="@/assets/img/meal_logging/add_meal_overlay_base.svg" class="overlay-base">
  </div>

  <div class="greyed-bg" v-if="visible" @click="closeOverlay"></div>
</template>

<script>
import NutritionBar from './Nutrient/NutritionBar.vue';


export default {
  components: {
    NutritionBar
  },
  name: "AddMealsOverlay",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mealId: {
      type: String,
      default: ""
    },
    meal: {
      type: Object,
      required: true
    },
    userDailyBudget: {
      type: Object,
      default: () => ({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sodium: 0,
        cholesterol: 0,
      })
    },
    userRemainingNutrients: {
      type: Object,
      default: () => ({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sodium: 0,
        cholesterol: 0,
      })
    },
  },
  data() {
    return {
      portion: 1,
      afterAddingMeal: { ...this.userRemainingNutrients },
      nutrients:[
        {
          key: 'calories',
          icon: "/assets/img/caloriesIcon.png",
          label: 'Calories',
          unit: 'cal',
          maxColor: '#e9e5cd',
          currentColor: '#d7d1b4',
          afterMealColor: '#b8b396',
          fontColor: '#b8b396',
        },
        {
          key: 'carbs',
          icon: "/assets/img/carbIcon.png",
          label: 'Carbohydrates',
          unit: 'g',
          maxColor: '#e2f3f4',
          currentColor: '#a2d3d6',
          afterMealColor: '#83bbbe',
          fontColor: '#83bbbe',
        },
        {
          key: 'protein',
          icon: "/assets/img/proteinIcon.png",
          label: 'Protein',
          unit: 'g',
          maxColor: '#e8f0e9',
          currentColor: '#99d0a3',
          afterMealColor: '#87a98d',
          fontColor: '#87a98d',
        },
        {
          key: 'fat',
          icon: "/assets/img/fatsIcon.png",
          label: 'Fats',
          unit: 'g',
          maxColor: '#fbf1cd',
          currentColor: '#fcdea3',
          afterMealColor: '#ecc474',
          fontColor: '#ecc474',
        },
        {
          key: 'sodium',
          icon: "/assets/img/sodiumIcon.png",
          label: 'Sodium',
          unit: 'mg',
          maxColor: '#f9e1da',
          currentColor: '#f6aa97',
          afterMealColor: '#ec7455',
          fontColor: '#ec7455',
        },
        {
          key: 'cholesterol',
          icon: "/assets/img/cholesterolsIcon.png",
          label: 'Cholesterol',
          unit: 'mg',
          maxColor: '#ffe5d4',
          currentColor: '#f1c9af',
          afterMealColor: '#be9a83',
          fontColor: '#be9a83',
        }
      ],
      tooltips: [
      ],
      activeTooltip: null,
    };
  },
  watch: {
    visible: function (newVal, oldVal) {
      if (newVal === true) {
        this.portion = 1;
        this.applyChanges();
        // Disable body scroll when overlay is open (prevents extra grey scrollbar)
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        // Re-enable body scroll when overlay is closed
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    },
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay');
    },
    addMeal() {
      this.$emit('addMeal', this.mealId, this.portion, this.afterAddingMeal);
    },
    applyChanges() {
      if (this.portion === "") return;
      if (this.afterAddingMeal === null) {
        this.afterAddingMeal = { ...this.userRemainingNutrients };
      }
      
      // Safely access nutrition_info with null checks to avoid Pinia hydration issues
      const nutritionInfo = this.meal.recipe?.nutrition_info || {};
      const portion = this.portion || 1;
      const servingSize = this.meal.recipe?.serving_size || 1;
      const multiplier = portion / servingSize;
      
      this.afterAddingMeal = {
        calories: parseFloat((this.userRemainingNutrients.calories - (nutritionInfo.calories || 0) * multiplier).toFixed(2)),
        protein: parseFloat((this.userRemainingNutrients.protein - (nutritionInfo.protein || 0) * multiplier).toFixed(2)),
        carbs: parseFloat((this.userRemainingNutrients.carbs - (nutritionInfo.totalCarbohydrate || 0) * multiplier).toFixed(2)),
        fat: parseFloat((this.userRemainingNutrients.fat - (nutritionInfo.fat || 0) * multiplier).toFixed(2)),
        sodium: parseFloat((this.userRemainingNutrients.sodium - (nutritionInfo.sodium || 0) * multiplier).toFixed(2)),
        cholesterol: parseFloat((this.userRemainingNutrients.cholesterol - (nutritionInfo.cholesterol || 0) * multiplier).toFixed(2)),
      };
      
      console.log(this.meal.recipe);

      // set the text
      this.tooltips = [];
      this.tooltips.push([`Remaining calories: ${parseFloat(this.userRemainingNutrients.calories).toFixed(2)} cal`,`After adding meal: ${parseFloat(this.afterAddingMeal.calories).toFixed(2)} cal`]);
      this.tooltips.push([`Remaining protein: ${parseFloat(this.userRemainingNutrients.protein).toFixed(2)} g`,`After adding meal: ${parseFloat(this.afterAddingMeal.protein).toFixed(2)} g`]);
      this.tooltips.push([`Remaining carbs: ${parseFloat(this.userRemainingNutrients.carbs).toFixed(2)} g`,`After adding meal: ${parseFloat(this.afterAddingMeal.carbs).toFixed(2)} g`]);
      this.tooltips.push([`Remaining fat: ${parseFloat(this.userRemainingNutrients.fat).toFixed(2)} g`,`After adding meal: ${parseFloat(this.afterAddingMeal.fat).toFixed(2)} g`]);
      this.tooltips.push([`Remaining sodium: ${parseFloat(this.userRemainingNutrients.sodium).toFixed(2)} mg`,`After adding meal: ${parseFloat(this.afterAddingMeal.sodium).toFixed(2)} mg`]);
      this.tooltips.push([`Remaining cholesterol: ${parseFloat(this.userRemainingNutrients.cholesterol).toFixed(2)} mg`,`After adding meal: ${parseFloat(this.afterAddingMeal.cholesterol).toFixed(2)} mg`]);
      
    },
    showTooltip(index) {
      this.activeTooltip = index;
    },
    hideTooltip() {
      this.activeTooltip = null;
    }
  },
  beforeUnmount() {
    // Ensure body scroll is restored if component is unmounted while visible
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
};

</script>


<style scoped>
    .add-meal-overlay {
        /* Center the overlay for desktop/tablet */
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;            /* a bit wider for clarity */
        max-width: 1000px;
        height: 90vh;
        background-color: #F3EADA;
        z-index: 100;
        border-radius: 1rem;
        /* Prevent unintended scrolling on the outer overlay */
        overflow: hidden;
    }
    .greyed-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 90;
    }

    .overlay-base {
        position: absolute;
        right:0;
        bottom:0;
        border-bottom-right-radius: 10%;
        z-index: 101;
    }
    
    .close-button {
        position: absolute;
        top: 3%;
        right: 4%;
        font-size: 2rem;
        color: #000;
        rotate: 45deg;
    }

    /* Desktop header layout fix */
    .overlay-header{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.25rem 0 1rem 0;
    }

    .overlay-header span{
        position: static;
        font-weight: bold;
        font-size: 2rem;
        color: #000;
    }

    .overlay-header hr{
        position: static;
        width: 80%;
        border: 0.124rem solid #000000;
        margin-top: 0.75rem;
    }

    .add-to-stomach-button{
        position: absolute;
        left: 50%;
        bottom: 2rem;
        transform: translateX(-50%);
        font-size: 1rem;
        font-weight: bold;
        color: #45a049;
        z-index: 200; /* above lists */
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        padding: 0.75rem 1.75rem;
        border-radius: 8px;
        border: 2px solid #45a049;
        color: #FFFEF1;
        transition: background 0.3s ease;
        border-radius: 16px !important;
    }

    /* Desktop button hover (outlined to filled) */
    .add-to-stomach-button:hover {
        background: linear-gradient(135deg, #45a049, #3d8b40);
    }

    /* Icon color adjustments for desktop */
    .add-to-stomach-button .add-button {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
    }

    .overlay-body{
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;  /* equal width columns */
        grid-template-rows: auto auto;   /* rows adjust to content */
        column-gap: 2rem;
        row-gap: 2rem;
        margin-top: 1rem;
        padding: 0 2rem;
        height: calc(100% - 160px); /* account for header + button */
        padding-bottom: 3rem; /* keep lists away from button */
        width: 100%;
        /* Disable scrolling for desktop/tablet — dedicated lists scroll individually */
        overflow: hidden;
        align-items: start;
    }

    .image-title-container{
        display: grid;
        grid-template-rows: 10% 88%;

        row-gap: 2%;
    }

    .image-title-container img{
        border-radius: 5%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      }
    
    .portion-nutrient-container{
        display: grid;
        grid-template-rows: 10% 85%;
    }

    .portion-container{
        display: grid;
        grid-template-columns: 55% 40%;
        column-gap: 5%;
    }

    .portion-container input{
        width: 100%;
        height: 80%;
        border-radius: 10px;
        border: 1px solid #ccc;
        align-self: center;
        font-size: 1rem;
        text-align: center;
    }

    .component-container{
        display: grid;
        grid-template-rows: 10% 89%;
    }

    .component-item-container{
        padding-left: 0;
        padding-right: 0;
        width: 100%;
        height: 200px;
        gap: 5%;
        overflow-y: scroll;
        z-index: 103;
        margin-top: 0;
        margin-bottom: 0;
    }

    .individual-component-container{
        width: 100%;
        max-height:fit-content;
        margin-top: 1rem;
        margin-bottom: 0;
        display: grid;
        grid-template-columns: 25% 65%;
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #FFFEF1;
    }
    
    .component-name-amount-container{
        display: flex;
        flex-direction: column;
        padding-top: 2.5%;
    }

    .component-name-amount-container span{
        font-size: 80%;
        font-weight: bold;
    }
    .component-amount-container span{
        font-size: 0.7rem;
        font-weight: 500;
    }    
    .component-amount-container label{
        font-size: 0.7rem;
        padding-top: 2.5%;
        font-weight: bold;
    }
    .individual-component-container img{
        border-radius: 20px;
        padding:10%;
        height: 80px;
        width: 80px;
        object-fit: cover;
    }

    .tooltip-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-bottom: 0%;
    }

    .tooltip-container {
        position: relative;
        cursor: initial;
    }

    .custom-tooltip {
        position: absolute;
        top: -100%; /* Adjust based on your layout */
        left: 75%;
        transform: translateX(-50%);
        background-color: rgb(227, 212, 190);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
        border-radius: 2vh;
        z-index: 10;
        width: 25vh;
        cursor: initial;

        font-size: 90%;
        font-weight: 600;
        padding: 2vh;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        opacity: 1; /* Tooltip is visible */
    }

/* Mobile Responsive Styles */
@media (max-width: 768px) {
    .add-meal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        height: 100dvh; /* Dynamic viewport height for better mobile support */
        transform: none;
        border-radius: 0;
        z-index: 100;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .overlay-header {
        position: relative;
        padding: 0.75rem 1rem; /* Reduced top/bottom padding */
        background-color: #F3EADA;
        border-bottom: 2px solid #000;
        flex-shrink: 0;
        z-index: 101;
    }

    .close-button {
        position: absolute;
        top: 0.75rem;
        right: 1rem;
        font-size: 1.5rem;
        color: #000;
        rotate: 45deg;
        background: none;
        border: none;
        cursor: pointer;
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .overlay-header span {
        position: static;
        display: block;
        text-align: center;
        font-weight: bold;
        font-size: 1.5rem;
        color: #000;
        margin: 0;
        padding-top: 0.5rem;
    }

    .overlay-header hr {
        display: none; /* Hide HR on mobile */
    }

    .overlay-body {
        position: relative;
        display: flex;
        flex-direction: column;
        /* Remove all grid properties for mobile */
        /* grid-template-columns: unset; */
        /* grid-template-rows: unset; */
        /* column-gap: unset; */
        /* row-gap: unset; */
        padding: 1rem;
        padding-top: 0.5rem; /* Reduce top gap */
        width: 100%;
        gap: 1.5rem;
        box-sizing: border-box;
        flex: 1;
        overflow-y: auto;
        min-height: 0; /* Important for flex container scrolling */
        align-items: center;
    }

    .overlay-body > * {
        order: initial !important;
        grid-area: unset !important;
        grid-row: unset !important;
        grid-column: unset !important;
    }

    .image-title-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        order: 1;
        width: 100%;
    }

    .image-title-container span {
        font-size: 1.25rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 0;
        padding-left: 0;
    }

    .image-title-container img {
        width: 200px;
        height: 200px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        object-fit: cover;
    }

    .portion-nutrient-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        order: 2;
        width: 100%;
        align-items: center;
    }

    .portion-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        width: 100%;
    }

    .portion-container span {
        font-weight: bold;
        font-size: 1rem;
        white-space: nowrap;
    }

    .portion-container input {
        width: 80px;
        height: 44px;
        border-radius: 10px;
        border: 1px solid #ccc;
        font-size: 1rem;
        text-align: center;
        box-sizing: border-box;
    }

    .component-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        align-items: center;
    }
    /* Remove explicit order properties to follow template order */

    .component-container > span {
        font-weight: bold;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 0;
        padding-left: 0;
        width: 100%;
    }

    .component-item-container {
        padding: 0;
        width: 100%;
        height: auto;
        max-height: 200px; /* Reduced height to fit better */
        gap: 1rem;
        overflow-y: auto;
        z-index: 50; /* Lower than button */
        display: flex;
        flex-direction: column;
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        align-items: center;
    }

    .individual-component-container {
        width: 95%;
        max-width: 400px;
        max-height: fit-content;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #FFFEF1;
        padding: 1rem;
        box-sizing: border-box;
    }

    .individual-component-container img {
        border-radius: 10px;
        padding: 0;
        height: 60px;
        width: 60px;
        object-fit: cover;
        flex-shrink: 0;
    }

    .component-name-amount-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;
        min-width: 0;
    }

    .component-name-amount-container span {
        font-size: 0.9rem;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .component-amount-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .component-amount-container label {
        font-size: 0.8rem;
        font-weight: bold;
        margin: 0;
        padding: 0;
    }

    .component-amount-container span {
        font-size: 0.8rem;
        font-weight: 500;
    }

    .add-to-stomach-button {
        position: fixed;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        max-width: 350px;
        width: 90vw;
        margin: 0 auto;
        font-size: 1rem;
        font-weight: bold;
        color: #FFFEF1;
        background-color: #4CAF50;
        border: none;
        border-radius: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: 80px;
        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000; /* Much higher z-index */
        box-sizing: border-box;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        border-top: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px !important;
    }

    .add-to-stomach-button:hover {
        background: linear-gradient(135deg, #45a049, #3d8b40);
    }

    .add-to-stomach-button .add-button {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
    }

    .overlay-base {
        display: none; /* Hide decorative background on mobile */
    }

    /* Mobile Nutrition Bars */
    .tooltip-wrapper {
        margin-bottom: 0.5rem;
    }

    .custom-tooltip {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(227, 212, 190, 0.95);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        z-index: 200;
        width: 80%;
        max-width: 300px;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 1rem;
        backdrop-filter: blur(10px);
    }

    .component-container:last-of-type {
        margin-bottom: 8rem;
    }
}

/* Very Small Width Mobile Devices (360px and smaller) */
@media (max-width: 375px) {
    .overlay-header {
        padding: 0.5rem 0.75rem; /* Even smaller padding */
    }

    .close-button {
        top: 0.5rem;
        right: 0.75rem;
    }

    .overlay-body {
        padding: 0.75rem;
        padding-top: 0.25rem;
        gap: 1rem;
    }

    .image-title-container img {
        width: 140px;
        height: 140px;
    }

    .image-title-container span {
        font-size: 1rem;
        line-height: 1.2;
    }

    .portion-container {
        gap: 0.5rem;
    }

    .portion-container input {
        width: 60px;
        height: 40px;
        font-size: 0.9rem;
    }

    .individual-component-container {
        padding: 0.5rem;
        gap: 0.75rem;
    }

    .individual-component-container img {
        height: 45px;
        width: 45px;
    }

    .component-name-amount-container span {
        font-size: 0.75rem;
    }

    .component-amount-container label,
    .component-amount-container span {
        font-size: 0.7rem;
    }

    .component-item-container {
        max-height: 180px; /* Smaller on tiny screens */
        gap: 0.75rem;
    }

    .add-to-stomach-button {
        font-size: 0.85rem;
        padding: 0.5rem;
        height: 70px;
        z-index: 1000; /* Ensure it's above content */
    }

    .component-container:last-of-type {
        margin-bottom: 8rem;
    }
}

/* Ultra narrow phones (360px and smaller) */
@media (max-width: 360px) {
    .overlay-body {
        padding: 0.5rem;
        padding-top: 0.25rem;
        gap: 0.75rem;
    }

    .image-title-container {
        gap: 0.5rem;
    }

    .image-title-container img {
        width: 120px;
        height: 120px;
    }

    .component-container > span {
        font-size: 1rem;
    }

    .component-item-container {
        max-height: 160px;
    }

    .individual-component-container {
        padding: 0.4rem;
        gap: 0.5rem;
    }

    .individual-component-container img {
        height: 40px;
        width: 40px;
    }

    .component-container:last-of-type {
        margin-bottom: 8rem;
    }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
    .add-meal-overlay {
        width: 70%;
        height: 90%;
        transform: translate(21.5%, 5.5%);
    }

    .overlay-body {
        grid-template-columns: 45% 45%;
        column-gap: 5%;
        padding-left: 5%;
    }

    .image-title-container img {
        width: 200px;
        height: 200px;
    }
}

/* --- Subheading and Card Alignment --- */
.overlay-body {
    align-items: start;
}

/* Headings (Ingredients, Seasonings, Portion, etc.) */
.component-container > span,
.image-title-container span,
.portion-nutrient-container > .portion-container > span {
    display: block;
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    margin-top: 0;
    text-align: left;
    padding-left: 0.25rem;
}

/* Meal name heading */
.image-title-container span {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    margin-top: 0;
    padding-left: 0.25rem;
}

/* Portion heading */
.portion-nutrient-container > .portion-container > span {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    margin-top: 0;
    padding-left: 0.25rem;
}

/* Card containers consistent padding */
.component-item-container {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    box-sizing: border-box;
}

/* Ingredient/Seasoning card alignment */
.individual-component-container {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1rem;
    margin-bottom: 0;
}

/* Remove extra top margin from first card */
.component-item-container .individual-component-container:first-child {
    margin-top: 0;
}

/* Align grid columns to top */
.overlay-body {
    align-items: flex-start;
}
</style>