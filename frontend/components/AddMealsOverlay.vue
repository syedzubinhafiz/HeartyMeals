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
        <img :src="meal.recipe.storage_links.thumbnail" alt="" style="object-fit: cover; height: 250px; width: 250px;">
      </div>

      <div class="portion-nutrient-container">
        <div class="portion-container">
          <span style="font-weight: bold; font-size: 90%; align-self: center;">Portion</span>
          <input type="number" id="selectedPortion" step="0.5" min="0.5" placeholder="Portion" v-model="portion" @input="applyChanges">
        </div>
        <div style="z-index: 102;">
            <NutritionBar
            v-for="(nutrient, index) in nutrients"
            :key="index"
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
            :progressBarContainerStyle="'margin-top: 0.5%; margin-bottom: 0.5%;'"
        />
        </div>
      </div>

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
      ]
    };
  },
  watch: {
    visible: function (newVal, oldVal) {
      if (newVal === true) {
        this.portion = 1;
        this.applyChanges();
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
        this.afterAddingMeal = this.userRemainingNutrients;
      }
      
      this.afterAddingMeal = {
        calories: parseFloat((this.userRemainingNutrients.calories - this.meal.recipe.nutrition_info.calories * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
        protein: parseFloat((this.userRemainingNutrients.protein - this.meal.recipe.nutrition_info.protein * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
        carbs: parseFloat((this.userRemainingNutrients.carbs - this.meal.recipe.nutrition_info.totalCarbohydrate * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
        fat: parseFloat((this.userRemainingNutrients.fat - this.meal.recipe.nutrition_info.fat * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
        sodium: parseFloat((this.userRemainingNutrients.sodium - this.meal.recipe.nutrition_info.sodium * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
        cholesterol: parseFloat((this.userRemainingNutrients.cholesterol - this.meal.recipe.nutrition_info.cholesterol * (this.portion/this.meal.recipe.serving_size)).toFixed(2)),
      };
      
      console.log(this.meal.recipe);
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
        grid-template-columns: 40% 40%;
        grid-template-rows: 30%, 65%;
        column-gap: 5%;
        top : 17%;
        padding-left: 12.5%;
        height:75%;
        width: 100%;
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
        padding-left: 2.5%;
        padding-right: 2.5%;
        width: 100%;
        height: 200px;
        gap: 5%;
        overflow-y: scroll;
        z-index: 103;
    }

    .individual-component-container{
        width: 100%;
        max-height:fit-content;
        margin-top: 5%;
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

</style>