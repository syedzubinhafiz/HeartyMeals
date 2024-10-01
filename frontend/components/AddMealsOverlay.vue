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
        <!-- <img :src="meal.recipe.storage_links.thumbnail" alt="meal image"> -->
        <img src="@/assets/img/LandingPage/image1.jpeg" alt="">
      </div>

      <div class="portion-nutrient-container">
        <div class="portion-container">
          <span style="font-weight: bold; font-size: 90%; align-self: center;">Portion</span>
          <input type="number" id="selectedPortion" step="0.5" min="1" placeholder="1" v-model="portion" @input="applyChanges">
        </div>
        <NutritionWidget />
      </div>

      <div class="component-container">
        <span style="font-weight: bold; font-size: 100%; align-self: center;">Ingredients</span>
        <div class="component-item-container">
          <div v-for="ingredient in meal.components.ingredients" :key="ingredient.name" class="individual-component-container">
            <img src="@/assets/img/LandingPage/image1.jpeg" style="border-radius: 10%;">
            <div class="component-name-amount-container">
              <span>{{ ingredient.name }}</span>
              <div class="component-amount-container">
                <label>Amount: </label>
                <span>{{ (portion > 1) ? parseFloat((ingredient.amount * portion/meal.recipe.serving_size).toFixed(2)) : parseFloat((ingredient.amount/meal.recipe.serving_size).toFixed(2)) }} {{ ingredient.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="component-container">
        <span style="font-weight: bold; font-size: 100%; align-self: center;">Seasonings</span>
        <div class="component-item-container">
          <div v-for="seasoning in meal.components.seasonings" :key="seasoning.name" class="individual-component-container">
            <img src="@/assets/img/LandingPage/image1.jpeg" style="border-radius: 10%;">
            <div class="component-name-amount-container">
                <span>{{ seasoning.name }}</span>
                <div class="component-amount-container">
                    <label>Amount: </label>
                    <span>{{ (portion > 1) ? parseFloat((seasoning.amount * portion/meal.recipe.serving_size).toFixed(2)) : parseFloat((seasoning.amount/meal.recipe.serving_size).toFixed(2)) }} {{ seasoning.unit }}</span>
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
import NutritionWidget from './Nutrient/NutritionWidget.vue';
export default {
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
      required: true
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
      afterAddingMeal: this.userRemainingNutrients,
    };
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay');
    },
    addMeal() {
      this.$emit('addMeal', this.mealId, this.portion, this.afterAddingMeal);
    },
    applyChanges() {
      const previous_portion = this.portion;
      this.portion = parseFloat(document.getElementById("selectedPortion").value);
    
      const original_after_meal_nutrients = {
        calories: this.afterAddingMeal.calories + parseFloat((meal.recipe.nutrition_info.calories * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
        protein: this.afterAddingMeal.protein + parseFloat((meal.recipe.nutrition_info.protein * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
        carbs: this.afterAddingMeal.carbs + parseFloat((meal.recipe.nutrition_info.carbs * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
        fat: this.afterAddingMeal.fat + parseFloat((meal.recipe.nutrition_info.fat * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
        sodium: this.afterAddingMeal.sodium + parseFloat((meal.recipe.nutrition_info.sodium * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
        cholesterol: this.afterAddingMeal.cholesterol + parseFloat((meal.recipe.nutrition_info.cholesterol * (previous_portion/meal.recipe.serving_size)).toFixed(2)),
      };

      if (this.portion < 1) {
        this.portion = 1;
        document.getElementById("selectedPortion").value = 1;
      }

      this.afterAddingMeal = {
        calories: original_after_meal_nutrients.calories - parseFloat((meal.recipe.nutrition_info.calories * (this.portion/meal.recipe.serving_size)).toFixed(2)),
        protein: original_after_meal_nutrients.protein - parseFloat((meal.recipe.nutrition_info.protein * (this.portion/meal.recipe.serving_size)).toFixed(2)),
        carbs: original_after_meal_nutrients.carbs - parseFloat((meal.recipe.nutrition_info.carbs * (this.portion/meal.recipe.serving_size)).toFixed(2)),
        fat: original_after_meal_nutrients.fat - parseFloat((meal.recipe.nutrition_info.fat * (this.portion/meal.recipe.serving_size)).toFixed(2)),
        sodium: original_after_meal_nutrients.sodium - parseFloat((meal.recipe.nutrition_info.sodium * (this.portion/meal.recipe.serving_size)).toFixed(2)),
        cholesterol: original_after_meal_nutrients.cholesterol - parseFloat((meal.recipe.nutrition_info.cholesterol * (this.portion/meal.recipe.serving_size)).toFixed(2)),
      };
    }
  }
};
</script>


<style scoped>
    .add-meal-overlay {
        position: absolute;
        width: 50%;
        height: 85%;
        background-color: #F3EADA;
        z-index: 100;
        transform: translate(50%, 8.8%);
        border-radius: 5%;
        
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

    .overlay-header span{
        position: absolute;
        font-weight: bold;
        top: 4%;
        left: 45%;
        font-size: 2rem;
        color: #000;
    }

    .overlay-header hr{
        position: absolute;
        top: 12%;
        width: 80%;
        left: 10%;
        border: 0.124rem solid #000000;
    }

    .add-to-stomach-button{
        position: absolute;
        right: 2%;
        bottom: 5%;
        font-size: 0.7rem;
        font-weight: bold;
        color: #FFFEF1;
        z-index: 102;
    }

    .overlay-body{
        position:relative;
        display: grid;
        grid-template-columns: 42.5% 42.5%;
        grid-template-rows: 30%, 65%;
        column-gap: 10%;
        row-gap: 5%;
        top : 17%;
        left: 12.5%;
        height: 75%;
        width: 80%;
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
        row-gap: 5%;
    }

    .portion-container{
        display: grid;
        grid-template-columns: 55% 40%;
        column-gap: 5%;
    }

    .portion-container input{
        width: 80%;
        height: 80%;
        border-radius: 5%;
        border: 1px solid #ccc;
        align-self: center;
        font-size: 1rem;
        text-align: center;
    }

    .component-container{
        display: grid;
        grid-template-rows: 10% 85%;
        row-gap: 5%;
    }

    .component-item-container{
        padding-top: 5%;
        padding-left: 2.5%;
        padding-right: 2.5%;
        display: flex;
        flex-direction: column;
        gap: 5%;
        overflow-y: scroll;
        z-index: 103;
    }

    .individual-component-container{
        display: grid;
        grid-template-columns: 30% 65%;
        column-gap: 5%;
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #FFFEF1;
    }
    
    .component-name-amount-container{
        display: grid;
        grid-template-rows: 60% 35%;
        padding-top: 5%;
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
        font-weight: bold;
    }
    .individual-component-container img{
        border-radius: 5%;
        padding:5%;
    }

</style>