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
              <div class="meal-info">
                  <span class="meal-name">{{ meal.recipe.name }}</span>
                  <div class="nutrition-list-container">
                      <div class="nutrient-label">
                        <label>Calories: </label>
                        <span>{{getNutrientValue(meal, 'calories')}} cal</span>
                      </div>
                      <div class="nutrient-label">
                        <label>Carbs: </label>
                        <span>{{getNutrientValue(meal, 'totalCarbohydrate')}} g</span>
                      </div>
                      <div class="nutrient-label">
                        <label>Protein: </label>
                        <span>{{getNutrientValue(meal, 'protein')}} g</span>
                      </div>
                      <div class="nutrient-label">
                        <label>Fats: </label>
                        <span>{{getNutrientValue(meal, 'fat')}} g</span>
                      </div>
                      <div class="nutrient-label">
                        <label>Sodium: </label>
                        <span>{{getNutrientValue(meal, 'sodium')}} mg</span>
                      </div>
                      <div class="nutrient-label">
                        <label>Cholesterol: </label>
                        <span>{{getNutrientValue(meal, 'cholesterol')}} mg</span>
                      </div>
                  </div>
              </div>
              <div class="serving-input-container">
                <input
                  class="serving-input"
                  type="number"
                  v-model="meal.portion"
                  @input="updatePortion(meal.id, meal.portion)"
                  min="0.5"
                  step="0.5"
                  placeholder="Serv."
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
    watch: {
      visible(newVal) {
        if (newVal) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    },
    beforeUnmount() {
      document.body.style.overflow = '';
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
      },
      getNutrientValue(meal, nutrientKey) {
        // Safely access nutrition_info with null checks to avoid Pinia hydration issues
        const nutritionInfo = meal.recipe?.nutrition_info || {};
        const portion = meal.portion || 1;
        const servingSize = meal.recipe?.serving_size || 1;
        const multiplier = portion / servingSize;
        const nutrientValue = nutritionInfo[nutrientKey] || 0;
        return parseFloat((nutrientValue * multiplier).toFixed(1));
      }
    },
  };
</script>
  
<style scoped>
  .sidebar {
    position: fixed; /* Prevent page scroll */
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
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    position: fixed; /* Cover full viewport */
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 99;
    right: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .close-button{
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.8rem;
    z-index: 10;
  }

  .logo{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
  }

  .logo img{
    width: 60px;
    height: 60px;
    object-fit: contain;
  }

  .logo p{
    font-size: 1rem;
    margin: 8px 0 0 0;
    font-weight: bold;
  }

 .counter {
    position: absolute;
    top: -5px;
    right: -8px;
    background-color: red;
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
    border-radius: 50%; 
    width: 20px; 
    height: 20px; 
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 5;
 }


  .sidebar-header hr{
    position: absolute;
    bottom: 0;
    width: 90%;
    left: 5%;
    border: 0.124rem solid #000000;
    margin: 0;
  }

  .body{
    position: absolute;
    top: 15%;
    left: 5%;
    width: 90%;
    height: 65%;
    overflow-y: scroll;
  }

  .meal{
    position: relative;
    left:2.5%;
    width: 95%;
    height: auto;
    border-radius: 10px;
    background-color: #FFF;
    margin-top: 4%;
    padding: 8px;
    box-sizing: border-box;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 70px 1fr 70px;
    column-gap: 8px;
    align-items: center;
  }

  .meal-image-container {
    justify-self: center;
    align-self: center;
  }

  .meal-image-container img{
    width:70px;
    height: 70px;
    object-fit: cover;
    border-radius: 10px;
    padding: 5%;
  }

  .meal-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px; /* A little space between name and nutrients */
    min-width: 0; /* Prevents overflow in flex children */
  }

  .meal-name {
    font-weight: bold;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Use ellipsis for long names */
  }

  .nutrition-list-container {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nutrient-label{
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
  }

  .nutrient-label span {
    font-size: 0.75rem;
  }

  .nutrient-label label {
    font-size: 0.75rem;
    font-weight: bold;
    margin-right: 4px;
    white-space: nowrap;
  }

  .serving-input-container {
    align-self: center;
    justify-self: center;
    width: 100%;
  }

  .serving-input{
     width: 100%;               /* Fill the column without overflow */
     box-sizing: border-box;
     text-align: center;
     border: 1px solid #A8A8A8;
     border-radius: 5px;
  }

  .serving-input::placeholder {
    font-size: 0.8rem;
    color: #888;
    text-overflow: ellipsis;
  }

  .remove-item{
    position: absolute;
    right: 5%;
    top: 5%;
    font-size:1.2rem;
  }

  /* ----------------------------
     Mobile responsiveness tweaks
     ---------------------------- */
  @media (max-width: 768px) {
    .sidebar {
      width: 100vw;              /* Take full width on mobile */
      overflow-x: hidden;        /* Prevent horizontal scroll */
      border-top-left-radius: 0; /* Remove rounded corners for full-width modal */
      border-bottom-left-radius: 0;
    }

    .sidebar-header {
      height: 120px;             /* Fixed height for mobile */
      padding: 15px 0;
    }

    .close-button {
      font-size: 1.5rem;         /* Slightly smaller close button */
      top: 10px;
      right: 10px;
    }

    .logo {
      position: relative;        /* Keep relative positioning */
      padding-top: 15px;
    }

    .logo img {
      width: 50px;               /* Smaller logo for mobile */
      height: 50px;
    }

    .counter {
      top: -3px;                /* Adjust for smaller logo */
      right: -6px;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
    }

    .sidebar-header hr {
      bottom: 0;                 /* Keep at bottom of header */
    }

    .body {
      top: 120px;               /* Match header height */
      height: calc(100% - 200px); /* Account for header and footer */
      left: 0;                  /* Remove horizontal offset */
      width: 100%;              /* Use full width */
      padding: 0 4%;            /* Small horizontal padding */
      overflow-x: hidden;       /* Remove horizontal scroll */
    }

    .meal {
      height: auto;              /* Let meal card height grow */
      left: 0;                   /* Reset relative offset */
      width: 100%;               /* Full width inside body */
      margin-top: 4%;
      grid-template-columns: 28% 57% 15%; /* Provide more space for middle column */
      column-gap: 2%;            /* Add small gap between columns */
    }

    .meal-image-container img {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }

    .nutrition-list-container {
      width: 100%;
    }

    .serving-input{
      width: 80%;                /* Smaller input so it doesn't overflow */
    }

    .sidebar-footer {
      position: fixed;           /* Keep summary button fixed at bottom */
      bottom: 3%;
      left: 50%;
      transform: translateX(-50%);
      top: auto;                 /* Override previous top value */
    }

    .summary-button {
      padding: 10px 20px;
    }
  }
</style>
  