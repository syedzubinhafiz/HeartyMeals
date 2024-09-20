export default class IngredientData {
    constructor(id,name,imgSrc,quantity,unit,cookingMethod) {
        this.id = id
        this.name = name
        this.imgSrc = imgSrc ?? "assets/img/potato.svg"
        this.quantity = quantity ?? 0
        this.unit = unit ?? "g"
        this.cookingMethod = cookingMethod ?? null
    }
    clone() {
        console.log(this)
        return new IngredientData(this.id,this.name,this.imgSrc, this.quantity, this.unit, this.cookingMethod)
    }
    toJson() {
        return {
            "componentId": this.id,
            "amount" : this.quantity,
            "unit": this.unit
        }
    }
    static importFromJson(jsonData) {
        return new IngredientData(jsonData.id,jsonData.name,null)
    }
    static fromApi(apiData) {
        let ingredientData = new IngredientData(apiData.component_id,apiData.name,null)
        ingredientData.unit = apiData.unit
        ingredientData.quantity = apiData.amount
        return ingredientData
    }
}