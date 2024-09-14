import NutrientData from './nutrientData.js'
export default class MealData {
    constructor(name,imgSrc,servingSize,servings,nutrientData) {
        this.name = name
        this.imgSrc = imgSrc
        this.servingSize = servingSize
        this.servings = servings
        this.nutrientData = nutrientData
    }
    static fromApi(apiData) {
        return new MealData(apiData.name,"/assets/img/croissant.svg",apiData.serving_size,apiData.serving_size,NutrientData.fromApi(apiData.nutrition_info))

    }
}