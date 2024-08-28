export default class IngredientData {
    constructor(name,imgSrc,unit,cookingMethod) {
        this.name = name
        this.imgSrc = imgSrc
        this.unit = unit ?? "grams"
        this.cookingMethod = cookingMethod ?? null
    }
    clone() {
        return new IngredientData(this.name,this.imgSrc,this.unit, this.cookingMethod)
    }
}