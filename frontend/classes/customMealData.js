import MealData from './mealData.js'
import NutrientData from './nutrientData.js'

export default class CustomMealData extends MealData {
    constructor(name,imgSrc) {
        super(name,imgSrc,1,1,new NutrientData(0,0,0,0,0,0))
        this.ingredientList = []
        this.seasoningList = []
        this.instructions = ""
        this.description = ""

        this.breakfast = false
        this.lunch = false
        this.dinner = false
        this.snack = false
        this.visibility = "Unlisted"
        this.prepTime = 0
        this.recipeServing = 0
        this.dietaryID = ""
        this.cuisineID = ""
    }

    reset() {
        this.ingredientList = []
        this.seasoningList = []
        this.instructions = ""
        this.description = ""

        this.breakfast = false
        this.lunch = false
        this.dinner = false
        this.snack = false
        this.visibility = "Unlisted"
        this.prepTime = 0
        this.recipeServing = 0
        this.dietaryID = ""
        this.cuisineID = ""

        this.name = "Custom Dish"
        this.imgSrc = "assets/img/croissant.svg"
        this.servingSize = 1
        this.servings = 1
        this.nutrientData = new NutrientData(0,0,0,0,0,0)
    }

}