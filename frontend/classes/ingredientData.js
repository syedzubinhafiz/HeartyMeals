export default class IngredientData {
    constructor(name,imgSrc,unit) {
        this.name = name
        this.imgSrc = imgSrc
        this.unit = unit
    }
    clone() {
        return new IngredientData(this.name,this.imgSrc,this.unit)
    }
}