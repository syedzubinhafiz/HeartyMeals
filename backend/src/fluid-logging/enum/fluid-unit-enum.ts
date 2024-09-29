export enum FluidUnit{
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
};

export const conversionFactors = {
    // Volume
    [FluidUnit.CUP]: 240,
    [FluidUnit.TEASPOON]: 4.92892,
    [FluidUnit.TABLESPOON]: 14.7868,
    [FluidUnit.FLUID_OUNCE]: 29.5735,
    [FluidUnit.PINT]: 473.176,
    [FluidUnit.QUART]: 946.353,
    [FluidUnit.GALLON]: 3785.41,
    [FluidUnit.LITER]: 1000,
    [FluidUnit.MILLILITER]: 1,
    [FluidUnit.CENTILITER]: 10,
};
