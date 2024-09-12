<template>
   <div class="summary-card" :class="{'expanded': isExpanded}" @click="toggleExpand">
    <div class="card-header">
      <div class="item-number">{{ itemNumber }}.</div>
      <div class="item-image">
        <img :src="item.imgSrc" :alt="item.recipe.name">
      </div>
      <div class="item-details">
        <h3 class="item-title">{{ item.recipe.name }}</h3>
        <p class="item-description">{{ item.recipe.description }}</p>
        <p class="more-details">Click to show nutrition information.</p>
      </div>
      <div class="serving-selector">
        <label for="servings">Servings:</label>
        <select v-model="servings" id="servings" @change="updateServings" @click.stop>
          <option class="option-button" v-for="value in options" :key="value" :value="value">{{ value }}</option>
        </select>
      </div>
    </div>
    <div v-if="isExpanded" class="expanded-content">
      <div class="nutrition-info">
        <div class="nutrition-item">
        <img :src="getIcon('Calories')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Calories</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.calories }}mg</span>
      </div>

      <div class="nutrition-item">
        <img :src="getIcon('Carbohydrates')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Carbohydrates</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.totalCarbohydrate }}mg</span>
      </div>

      <div class="nutrition-item">
        <img :src="getIcon('Protein')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Protein</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.protein }}mg</span>
      </div>

      <div class="nutrition-item">
        <img :src="getIcon('Fats')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Fats</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.fat }}mg</span>
      </div>

      <div class="nutrition-item">
        <img :src="getIcon('Sodium')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Sodium</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.sodium }}mg</span>
      </div>

      <div class="nutrition-item">
        <img :src="getIcon('Cholesterol')" alt="icon" class="nutrition-icon"/>
        <span class="nutrition-key">Cholesterol</span>
        <span class="nutrition-value">{{ item.recipe.nutrition_info.cholesterol }}mg</span>
      </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
export default {
  name: 'SummaryCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemNumber: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      servings: this.item.portion,
      options: [0.25, 0.5, 0.75, 1, 2],
      isExpanded: false,
      nutritionIcons: {
        calories: '/assets/img/Calories-Icon.svg',
        carbohydrates: '/assets/img/Carbo-Icon.svg',
        protein: '/assets/img/Protein.svg',
        fats: '/assets/img/Olive-oil.svg',
        sodium: '/assets/img/Salt.svg',
        cholesterol: '/assets/img/Egg.svg'
      } 
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    getIcon(key) {
      // Use the key to get the correct icon from the nutritionIcons object
      return this.nutritionIcons[key.toLowerCase()] || '';
    },
    updateServings() {
      this.$emit('update-servings', {
        recipeId: this.item.recipe.id,
        portion: this.servings
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
*{
  font-family: 'Source Code Pro', monospace;
}
.summary-card {
  background-color: #FFFEF1;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  align-items: center;
}

.item-number {
  font-size: 18px;
  margin-right: 15px;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.item-details {
  flex-grow: 1;
}

.item-title {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.item-description {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #3a7a7a;
}

.item-info {
  margin: 0;
  font-size: 12px;
  color: #666;
  
}

.serving-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 15px;
}

.serving-selector label {
  margin-bottom: 5px;
  font-size: 12px;
}

.serving-selector select {
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid;
  font-size: 14px;
}

.option-button {
  background-color: white;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 14px;
}

.expanded-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}
.more-details {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #666;

}
.item-info {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}
.nutrition-info h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.nutrition-info ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #666;

}
.nutrition-info li {
  font-size: 14px;
  margin-bottom: 5px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.expanded {
  background-color: #f0f0f0;
}

.nutrition-key {
  flex: 1;
  padding-right: 10px;
}

.nutrition-value {
  flex: 1;
  text-align: right;
  padding-left: 10px;
}
</style>