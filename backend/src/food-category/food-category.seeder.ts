import { Connection } from "typeorm";
import { FoodCategory } from "./foodCategory.entity";

const FOOD_CATEGORY_LIST = [
    // Existing categories
    'Peanut',
    'Dairy product',
    'Red meat',
    'Soy bean',
    'Shellfish',
    'Seafood',
    'Pork',

    // Additional categories for mock data
    'Protein',
    'Vegetables',
    'Grains',
    'Fats',
    'Nuts',
    'Dairy',
    'Herbs',
    'Spices',
    'Condiments',
    'Fruits',
    'Legumes',
    'Beverages'
];


async function seedFoodCategory(connection: Connection) {
    const foodCategoryRepo = connection.getRepository(FoodCategory);

    // Do not add ethnicity if they already exist
    const existingFoodCategory = await foodCategoryRepo.find();
    const existingFoodCategoryNames = new Set(existingFoodCategory.map(foodCategory => foodCategory.type));

    // Exclude existing ethnicities
    const filteredFoodCategory = FOOD_CATEGORY_LIST.filter(foodCategory => !existingFoodCategoryNames.has(foodCategory));

    if (filteredFoodCategory.length > 0) {
        // Add new ethnicities
        const foodCategoryEntities = filteredFoodCategory.map(type => ({ type }));
        await foodCategoryRepo.save(foodCategoryEntities);
        console.log(`${filteredFoodCategory.length} new food categories have been seeded.`);
    } else {
        console.log('No new food category to seed.');
    }
}


export default seedFoodCategory;
