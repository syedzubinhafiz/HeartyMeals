export default class IngredientData {
    constructor(name,imgSrc,quantity,unit,cookingMethod) {
        this.name = name
        this.imgSrc = imgSrc
        this.quantity = quantity ?? 0
        this.unit = unit ?? "grams"
        this.cookingMethod = cookingMethod ?? null
    }
    clone() {
        return new IngredientData(this.name,this.imgSrc, this.quantity, this.unit, this.cookingMethod)
    }
}