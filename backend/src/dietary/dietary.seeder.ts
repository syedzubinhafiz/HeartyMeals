import { Connection } from "typeorm";
import { Dietary } from "./dietary.entity";

const DIETARY_LIST = [
    'Halal',
    'Non-Halal',
    'Vegan',
    'Vegetarian',
    'Nut-Free',
    'Ketogenic (Keto)',
    'Low-Carbohydrate',
    'Gluten-Free',
    'Dairy-Free',
    'Soy-Free',
    'Lactose-Free',
    'DASH (Dietary Approaches to Stop Hypertension)',
];


async function seedDietary(connection: Connection) {
    const dietaryRepo = connection.getRepository(Dietary);

    // Do not add ethnicity if they already exist
    const existingDietary = await dietaryRepo.find();
    const existingDietaryNames = new Set(existingDietary.map(dietary => dietary.name));

    // Exclude existing ethnicities
    const filteredDietary = DIETARY_LIST.filter(dietary => !existingDietaryNames.has(dietary));

    if (filteredDietary.length > 0) {
        // Add new ethnicities
        const dietaryEntities = filteredDietary.map(name => ({ name }));
        await dietaryRepo.save(dietaryEntities);
        console.log(`${filteredDietary.length} new dietaries have been seeded.`);
    } else {
        console.log('No new dietary to seed.');
    }
}


export default seedDietary;
