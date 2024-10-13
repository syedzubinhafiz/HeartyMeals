<template>
    <div v-if="visible" class="sidebar">

        <div class="sidebar-header">
            <button @click="closeSidebar" class="close-button">x</button>
    
            <div class="logo">
                <img src="@/assets/img/meal_logging/big_stomach.svg">
                <p>Stomach</p>
                <p class="counter">{{this.selectedMeals.length || 0}}</p>
            </div>

            <hr>
    
        </div>
    
        <div class="body">
            <div class="meal" v-for="meal in selectedMeals" :key="meal.id">
              <button class="remove-item" @click="removeSelectedMeal(meal.id)">x</button>
              <div class="meal-image-container">
                <img :src="meal.recipe.storage_links.thumbnail" >
              </div>
              <div style="display: grid; grid-template-rows: 42.5% 55%; row-gap: 2.5%;">
                  <span style="font-weight: bold; font-size:100%; align-self: center;">{{ meal.recipe.name }}</span>
                  <div class="nutrition-list-container">
                      <div class="nutrient-label">
                        <label>Calories: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.calories * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> cal</label>
                      </div>
                      <div class="nutrient-label">
                        <label>Carbs: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.totalCarbohydrate * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> cal</label>
                      </div>
                      <div class="nutrient-label">
                        <label>Protein: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.protein * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> g</label>
                      </div>
                      <div class="nutrient-label">
                        <label>Fats: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.fat * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> g</label>
                      </div>
                      <div class="nutrient-label">
                        <label>Sodium: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.sodium * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> mg</label>
                      </div>
                      <div class="nutrient-label">
                        <label>Cholesterol: </label>
                        <span>{{parseFloat((meal.recipe.nutrition_info.cholesterol * (meal.portion/meal.recipe.serving_size)).toFixed(2))}}</span>
                        <label> mg</label>
                      </div>
                  </div>
              </div>
              <div style="width: 100%; align-self: center; padding-right: 10%;">
                <input 
                  class="serving-input"
                  type="number" 
                  v-model="meal.portion" 
                  @input="updatePortion(meal.id, meal.portion)" 
                  min="0.5" 
                  step="0.5"
                  placeholder="Serving"
                  >
              </div>

            </div>
        </div>
        

        <div class="sidebar-footer">
            <Button class="summary-button" @click="logMeal">
                <img src="@/assets/icon/summary-icon.svg" alt="">
                Summary
            </Button>
        </div>
    </div>

    <div v-if="visible" class="greyed-bg" @click="closeSidebar"></div>

</template>
  
<script>

  export default {
    name: "StomachSidebar",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      selectedMeals: {
        type: Array,
        default: () => []
      },
      mealDate: {
        type: String,
        default: ""
      },
      mealType: {
        type: String,
        default: ""
      }
    },
    methods: {
      closeSidebar() {
        this.$emit('closeSidebar');
      },
      updatePortion(id, portion) {
        this.$emit('updatePortion', id, portion);
      },
      removeSelectedMeal(id) {
        console.log('trigger remove meal in sidebar');
        this.$emit('removeSelectedMeal', id);
      },
      logMeal(){
        console.log('trigger log meal in sidebar');
        this.$emit('logMeal');
      }
    },
  };
</script>
  
<style scoped>
  .sidebar {
    position: absolute;
    background-color: #F3EADA;
    width: 30%;
    height: 100%;
    z-index: 100;
    right: 0;
    border-top-left-radius: 5%;
    border-bottom-left-radius: 5%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .sidebar-header{
    position: relative;
    height: 10%;
  }
  .sidebar-footer{
    position: absolute;
    top: 92%;
    left: 42%;
  }

  .summary-button{
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 7%;
    padding: 10% 30%;
    justify-content: center;
  }

  .greyed-bg {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 99;
    right: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .close-button{
    position: absolute;
    top: 10%;
    right: 5%;
    font-size: 2rem;
  }

  .logo{
    position:absolute;
    top: 20%;
    left: 45%;
  }

  .logo img{
    width: 80%;
  }

  .logo p{
    font-size: 1rem;
    padding-top: 5%;
    font-weight: bold;
  }

 .counter {
    position: absolute;
    top: 60%;
    left: 65%;
    background-color: red;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    border-radius: 50%; 
    width: 20px; 
    height: 20px; 
    text-align: center; 
    line-height: 17px; 
    transform: translate(-50%, -50%); 
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }


  .sidebar-header hr{
    position: absolute;
    top: 130%;
    width: 90%;
    left: 5%;;
    border: 0.124rem solid #000000;
  }

  .body{
    position: absolute;
    top: 16%;
    left: 5%;
    width: 90%;
    height: 67%;
    overflow-y: scroll;
  }

  .meal{
    position: relative;
    left:2.5%;
    width: 95%;
    height: 25%;
    border-radius: 10px;
    background-color: #FFF;
    margin-top: 5%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 25% 55% 20%;
  }

  .meal-image-container {
    justify-self: center;
    align-self: center;
  }

  .meal-image-container img{
    width:120px;
    height: 120px;
    object-fit: cover;
    border-radius: 20px;
    padding: 5%;
  }

  .nutrition-list-container {
    width: 100%;
    height: 100%;
    column-count: 2;    
  }
  .nutrient-label{
    height: 20%;
  }
  .nutrient-label span {
    font-size: x-small;
  }
  
  .nutrient-label label {
    font-size: x-small;
    font-weight: bold;
  }
  .serving-input{
     width: 100%; 
     border: 1px solid #ccc; 
     border-radius: 10px; 
     text-align: center;
  }

  .remove-item{
    position: absolute;
    right: 5%;
    top: 5%;
    font-size:1.2rem;
  }
</style>
  