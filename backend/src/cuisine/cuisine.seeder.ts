import { Connection } from "typeorm";
import { Cuisine } from "./cuisine.entity";
import { Country } from "../country/country.entity";

// A curated list of common cuisine types. Extend this list as needed.
const CUISINE_LIST = [
  'American',
  'Mediterranean',
  'Italian',
  'Asian',
  'Modern',
  'Mexican',
  'Indian',
  'Chinese',
  'Japanese',
  'French',
];

/**
 * Seed the Cuisine table with a set of default cuisines.
 * Cuisines that already exist (matched by name) will be skipped.
 */
async function seedCuisine(connection: Connection) {
  const cuisineRepo = connection.getRepository(Cuisine);
  const countryRepo = connection.getRepository(Country);

  // Pick reference countries for mapping (defaults to first if specific not found)
  const allCountries = await countryRepo.find();
  if (allCountries.length === 0) {
    console.warn('⚠️  No countries found; skipping cuisine seeding.');
    return;
  }

  const countryMap: Record<string,string> = {
    American: 'USA',
    Italian: 'ITA',
    Mediterranean: 'GRC',
    Asian: 'CHN',
    Mexican: 'MEX',
    Indian: 'IND',
    Chinese: 'CHN',
    Japanese: 'JPN',
    French: 'FRA',
    Modern: allCountries[0].id, // fallback
  };

  // Helper to resolve country id or fallback to first
  const resolveCountryId = (cuisine: string): string => {
    const mapped = countryMap[cuisine];
    const found = mapped && allCountries.find(c => c.id === mapped);
    return found ? found.id : allCountries[0].id;
  };

  // Fetch existing cuisines to avoid duplicates
  const existingCuisines = await cuisineRepo.find();
  const existingCuisineNames = new Set(existingCuisines.map(c => c.name));

  // Prepare new cuisines with country linkage
  const cuisinesToInsert = CUISINE_LIST
    .filter(name => !existingCuisineNames.has(name))
    .map(name => ({ name, country_id: resolveCountryId(name) }));

  if (cuisinesToInsert.length > 0) {
    await cuisineRepo.save(cuisinesToInsert);
    console.log(`🍴 Seeded ${cuisinesToInsert.length} new cuisines.`);
  } else {
    console.log('🍴 No new cuisines to seed.');
  }
}

export default seedCuisine; 