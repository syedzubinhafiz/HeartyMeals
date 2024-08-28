export default class IngredientData {
    constructor(name,imgSrc,quantity,unit,cookingMethod) {
        this.name = name
        this.imgSrc = imgSrc
        this.quantity = 0
        this.unit = unit ?? "grams"
        this.cookingMethod = cookingMethod ?? null
    }
    clone() {
        return new IngredientData(this.name,this.imgSrc,this.unit, this.cookingMethod)
    }
}