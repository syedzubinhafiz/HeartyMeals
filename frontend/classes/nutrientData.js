export default class NutrientData {
    constructor(calories,carbohydrtates,protein,fats,sodium,cholesterol) {
        this.calories = calories
        this.carbohydrtates = carbohydrtates
        this.protein = protein
        this.fats = fats
        this.sodium = sodium
        this.cholesterol = cholesterol
    }

    add(other) {
        return new NutrientData(this.calories+other.calories,this.carbohydrtates+other.carbohydrtates,
                this.protein+other.protein,this.fats+other.fats,
                this.sodium+other.sodium,this.cholesterol+other.cholesterol)
    }

    subtract(other) {
        return new NutrientData(this.calories-other.calories,this.carbohydrtates-other.carbohydrtates,
                this.protein-other.protein,this.fats-other.fats,
                this.sodium-other.sodium,this.cholesterol-other.cholesterol)
    }

    static fromApi(apiData) {
        return new NutrientData(apiData.calories,apiData.totalCarbohydrate,apiData.protein,apiData.fat,apiData.sodium,apiData.cholesterol)
    }

    static fromApi2(apiData) {
        return new NutrientData(apiData.calories,apiData.carbs,apiData.protein,apiData.fats,apiData.sodium,apiData.cholesterol)
    }
}