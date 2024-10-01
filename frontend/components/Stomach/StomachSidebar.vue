<template>
    <div v-if="visible" class="sidebar">

        <div class="sidebar-header">
            <button @click="closeSidebar" class="close-button">x</button>
    
            <div class="logo">
                <img src="@/assets/img/meal_logging/big_stomach.svg">
                <p>Stomach</p>
                <span>{{this.selectedMeals.length || 0}}</span>
            </div>

            <hr>
    
        </div>
    
        <div class="body">
            <div class="meal" v-for="meal in selectedMeals" :key="meal.id">
                <img src="@/assets/img/LandingPage/image1.jpeg" style="align-self: center; border-radius: 10px; padding-left: 10%;">
                <div style="display: grid; grid-template-rows: 20% 75%; row-gap: 5%; ">
                    <span style="font-weight: bold; font-size:1.2rem; align-self: center;">{{ meal.recipe.name }}</span>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr);">
                        <span>Calories: {{meal.recipe.nutrition_info.calories}} cal</span>
                        <span>Protein: {{meal.recipe.nutrition_info.protein}} g</span>
                        <span>Fat: {{meal.recipe.nutrition_info.fat}} g</span>
                        <span>Carbs: {{meal.recipe.nutrition_info.totalCarbohydrate}} g</span>
                        <span>Sodium: {{meal.recipe.nutrition_info.sodium}} mg</span>
                        <span>Cholesterol: {{ meal.recipe.nutrition_info.cholesterol }} mg</span>
                    </div>
                </div>
                <div style="width: 100%; align-self: center; padding-right: 10%;">

                  <input type="number" min="1" value="{{meal.portion}}" step="0.5" placeholder="Serving" style="width: 100%; border: 1px solid #ccc; border-radius: 10px; text-align: center;">
                </div>

            </div>
        </div>
        

        <div class="sidebar-footer">
            <Button class="summary-button">
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

  .logo span{
    position: absolute;
    top: 35%;
    left: 50%;
    background-color: red;
    color: white;
    padding-top: 4%;
    padding-left: 15%;
    padding-right: 15%;
    padding-bottom: 3%;
    font-weight: bold;
    border-radius: 100%;
  }

  .sidebar-header hr{
    position: absolute;
    top: 110%;
    width: 90%;
    left: 5%;;
    border: 0.124rem solid #000000;
  }

  .body{
    position: absolute;
    top: 12%;
    left: 10%;
    width: 85%;
    height: 70%;
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
    column-gap: 2.5%;
    grid-template-columns: 25% 50% 20%;
  }
</style>
  