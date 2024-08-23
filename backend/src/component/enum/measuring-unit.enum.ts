export enum MeasuringUnit{

    // Mass
    GRAM = 'g',
    KILOGRAM = 'kg',
    MILLIGRAM = 'mg',
    MICROGRAM = 'μg',
    POUND = 'lb',
    OUNCE = 'oz',

    //Volume 
    CUP = 'cup',
    TEASPOON = 'tsp',
    TABLESPOON = 'tbsp',
    FLUID_OUNCE	= 'fl oz',
    PINT = 'pt',
    QUART = 'qt',
    GALLON = 'gal',
    LITER = 'l',
    MILLILITER = 'ml',
    CENTILITER = 'cl',

    // Hand measurement
    PALM = 'palm (Only for protein)',
    FIST = 'fist (Only for vegetables)',
    THUMB_TIP = 'thumb tip (Only for fats)',
    THUMB_NAIL = 'thumb nail (Only for fats)',
    CUPPED_HAND = 'cupped hand (Only for carbs)',

};

export const conversionFactors = {
    // Mass
    [MeasuringUnit.GRAM]: 1,
    [MeasuringUnit.KILOGRAM]: 1000,
    [MeasuringUnit.MILLIGRAM]: 0.001,
    [MeasuringUnit.MICROGRAM]: 0.000001,
    [MeasuringUnit.POUND]: 453.592,
    [MeasuringUnit.OUNCE]: 28.3495,

    // Volume
    [MeasuringUnit.CUP]: 240,
    [MeasuringUnit.TEASPOON]: 4.92892,
    [MeasuringUnit.TABLESPOON]: 14.7868,
    [MeasuringUnit.FLUID_OUNCE]: 29.5735,
    [MeasuringUnit.PINT]: 473.176,
    [MeasuringUnit.QUART]: 946.353,
    [MeasuringUnit.GALLON]: 3785.41,
    [MeasuringUnit.LITER]: 1000,
    [MeasuringUnit.MILLILITER]: 1,
    [MeasuringUnit.CENTILITER]: 10,
};

export const handMeasurementsToGrams = {
    [MeasuringUnit.PALM]: 100, // Example: 100 grams of protein
    [MeasuringUnit.FIST]: 200, // Example: 200 grams of vegetables
    [MeasuringUnit.THUMB_TIP]: 5, // Example: 5 grams of fats
    [MeasuringUnit.THUMB_NAIL]: 5, // Example: 5 grams of fats
    [MeasuringUnit.CUPPED_HAND]: 150, // Example: 150 grams of carbs
};