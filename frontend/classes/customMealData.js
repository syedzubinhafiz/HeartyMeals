import MealData from './mealData.js'
import NutrientData from './nutrientData.js'

export default class CustomMealData extends MealData {
    constructor(name,mealImg) {
        super(name,mealImg,1,1,new NutrientData(0,0,0,0,0,0))
        this.ingredientList = []
        this.seasoningList = []
        this.description = ""
    }

}