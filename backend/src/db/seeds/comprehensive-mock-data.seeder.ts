import { DataSource } from 'typeorm';
import { User } from '../../user/user.entity';
import { Component } from '../../component/component.entity';
import { Recipe } from '../../recipe/recipe.entity';
import { RecipeComponent } from '../../recipe-component/recipe-component.entity';
import { MealLogging } from '../../meal-logging/meal-logging.entity';
import { FluidLogging } from '../../fluid-logging/fluid-logging.entity';
import { EducationalContent } from '../../educational/educational.entity';
import { Country } from '../../country/country.entity';
import { Dietary } from '../../dietary/dietary.entity';
import { Ethnicity } from '../../ethnicity/ethnicity.entity';
import { Cuisine } from '../../cuisine/cuisine.entity';
import { FoodCategory } from '../../food-category/foodCategory.entity';
import { UserRole } from '../../user/enum/user-role.enum';
import { Gender } from '../../user/enum/gender.enum';
import { ComponentType } from '../../component/enum/type.enum';
import { MeasuringUnit } from '../../component/enum/measuring-unit.enum';
import { CholesterolLevel } from '../../user/enum/cholesterol.enum';
import { Visibility } from '../../recipe/enum/visibility.enum';
import { MealType } from '../../meal-logging/enum/meal-type.enum';
import { FluidUnit } from '../../fluid-logging/enum/fluid-unit-enum';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import seedFoodCategory from '../../food-category/food-category.seeder';
import seedCuisine from '../../cuisine/cuisine.seeder';
import { ImageService, PixabayImage } from './image.service';
import { StorageService } from "src/storage/storage.service";
import { FileUploadDTO } from "src/storage/dto/file-upload-dto";
import { FileFormatDTO } from "src/storage/dto/file-format-dto";
import { StorageType } from "src/storage/enum/storage.enum";
import * as dotenv from 'dotenv';

dotenv.config();

export class ComprehensiveMockDataSeeder {
  private imageService: ImageService;
  private storageService: StorageService;

  constructor(
    private dataSource: DataSource,
    storageService: StorageService,
  ) {
    this.imageService = new ImageService();
    this.storageService = storageService;
  }

  async seed() {
    console.log('🌱 Starting comprehensive mock data seeding...');

    // Get repositories
    const userRepo = this.dataSource.getRepository(User);
    const componentRepo = this.dataSource.getRepository(Component);
    const recipeRepo = this.dataSource.getRepository(Recipe);
    const recipeComponentRepo = this.dataSource.getRepository(RecipeComponent);
    const mealLoggingRepo = this.dataSource.getRepository(MealLogging);
    const fluidLoggingRepo = this.dataSource.getRepository(FluidLogging);
    const educationalRepo = this.dataSource.getRepository(EducationalContent);
    const countryRepo = this.dataSource.getRepository(Country);
    const dietaryRepo = this.dataSource.getRepository(Dietary);
    const ethnicityRepo = this.dataSource.getRepository(Ethnicity);
    const cuisineRepo = this.dataSource.getRepository(Cuisine);
    const foodCategoryRepo = this.dataSource.getRepository(FoodCategory);

    // FIRST: Seed food categories if they don't exist
    console.log('🏷️ Seeding food categories...');
    await seedFoodCategory(this.dataSource);

    // 🍴 Seed cuisines
    console.log('🍴 Seeding cuisines...');
    await seedCuisine(this.dataSource);

    // Get existing lookup data AFTER seeding categories and cuisines
    const countries = await countryRepo.find();
    const dietaries = await dietaryRepo.find();
    const ethnicities = await ethnicityRepo.find();
    const cuisines = await cuisineRepo.find();
    const foodCategories = await foodCategoryRepo.find();

    console.log(`📊 Found ${foodCategories.length} food categories:`, foodCategories.map(fc => fc.type));

    // 1. Create Demo Users
    console.log('👥 Creating demo users...');
    const demoUsers = await this.createDemoUsers(userRepo, countries, dietaries, ethnicities);

    // 2. Create Food Components
    console.log('🥗 Creating food components...');
    const components = await this.createFoodComponents(componentRepo, foodCategories);

    // 2.1 Fetch Images for Food Components
    console.log('📸 Fetching images for Malaysian ingredients using Pixabay API (6,000 requests/hour)');
    await this.fetchAndUpdateComponentImages(componentRepo, components);

    // 3. Create Recipes
    console.log('🍽️ Creating recipes...');
    const recipes = await this.createRecipes(recipeRepo, demoUsers, cuisines, dietaries, components);

    // 3.1 Fetch Images for Recipes
    console.log('📸 Fetching images for Malaysian recipes using Pixabay API');
    await this.fetchAndUpdateRecipeImages(recipeRepo, recipes);

    // 3.1 Create Recipe Components (Link ingredients to recipes)
    console.log('🔗 Creating recipe components...');
    await this.createRecipeComponents(recipeComponentRepo, recipes, components);

    // 4. Create Meal Logging Data
    console.log('📊 Creating meal logging data...');
    await this.createMealLoggingData(mealLoggingRepo, demoUsers, recipes);

    // 5. Create Fluid Logging Data
    console.log('💧 Creating fluid logging data...');
    await this.createFluidLoggingData(fluidLoggingRepo, demoUsers);

    // 6. Create Educational Content
    console.log('📚 Creating educational content...');
    const educationalContent = await this.createEducationalContent(educationalRepo);
    
    // 6.1 Fetch Images for Educational Content
    console.log('📸 Fetching and storing images for educational content...');
    await this.fetchAndStoreEducationalImages(educationalRepo, educationalContent);

    console.log('✅ Mock data seeding completed successfully!');
  }

  private async createDemoUsers(userRepo: any, countries: Country[], dietaries: Dietary[], ethnicities: Ethnicity[]): Promise<User[]> {
    const users: User[] = [];
    
    // Admin Account
    const admin = userRepo.create({
      user_id: uuidv4(),
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@heartymeals.com',
      password: await bcrypt.hash('Admin123!', 10),
      gender: Gender.MALE,
      user_role: UserRole.ADMIN,
      age: 35,
      height: 175,
      weight: 70,
      country: countries[0],
      dietary: dietaries[0],
      ethnicity: ethnicities[0],
      nyha_level: 1,
      medical_info: { conditions: ['Administrative User'] },
      user_nutrition_setting: {
        carbs_percentage: 0.5,
        protein_percentage: 0.3,
        fat_percentage: 0.2,
        cholesterol_level: CholesterolLevel.NORMAL,
        activity_level: 3
      },
      daily_budget: {
        calories: 2000,
        carbs: 250,
        protein: 150,
        fat: 44,
        sodium: 2300,
        cholesterol: 300,
        water_intake: 2000
      }
    });
    users.push(admin);

    // Dietitian Account
    const dietitian = userRepo.create({
      user_id: uuidv4(),
      first_name: 'Dr. Sarah',
      last_name: 'Nutrition',
      email: 'dietitian@heartymeals.com',
      password: await bcrypt.hash('Dietitian123!', 10),
      gender: Gender.FEMALE,
      user_role: UserRole.DIETITIAN,
      age: 42,
      height: 165,
      weight: 60,
      country: countries[0],
      dietary: dietaries[0],
      ethnicity: ethnicities[1] || ethnicities[0],
      nyha_level: 1,
      medical_info: { profession: 'Registered Dietitian' },
      user_nutrition_setting: {
        carbs_percentage: 0.5,
        protein_percentage: 0.3,
        fat_percentage: 0.2,
        cholesterol_level: CholesterolLevel.NORMAL,
        activity_level: 4
      },
      daily_budget: {
        calories: 1800,
        carbs: 225,
        protein: 135,
        fat: 40,
        sodium: 2300,
        cholesterol: 300,
        water_intake: 2200
      }
    });
    users.push(dietitian);

    // Patient Users with Diverse Profiles
    const patientProfiles = [
      {
        name: { first: 'John', last: 'Heart' },
        email: 'patient1@demo.com',
        age: 65,
        gender: Gender.MALE,
        height: 180,
        weight: 85,
        nyha_level: 2,
        medical_info: { conditions: ['Heart Failure', 'Hypertension'], restrictions: ['Low Sodium'] },
        activity_level: 2,
        daily_budget: { calories: 1800, carbs: 180, protein: 120, fat: 50, sodium: 1500, cholesterol: 200, water_intake: 2000 }
      },
      {
        name: { first: 'Maria', last: 'Garcia' },
        email: 'patient2@demo.com',
        age: 58,
        gender: Gender.FEMALE,
        height: 160,
        weight: 70,
        nyha_level: 1,
        medical_info: { conditions: ['Heart Disease', 'Diabetes'], restrictions: ['Low Sugar', 'Low Sodium'] },
        activity_level: 3,
        daily_budget: { calories: 1600, carbs: 150, protein: 100, fat: 40, sodium: 1200, cholesterol: 180, water_intake: 1800 }
      },
      {
        name: { first: 'David', last: 'Green' },
        email: 'patient3@demo.com',
        age: 45,
        gender: Gender.MALE,
        height: 175,
        weight: 78,
        nyha_level: 1,
        medical_info: { conditions: ['CAD'], restrictions: ['Vegetarian'] },
        activity_level: 4,
        daily_budget: { calories: 2000, carbs: 250, protein: 120, fat: 55, sodium: 2000, cholesterol: 250, water_intake: 2200 }
      },
      {
        name: { first: 'Eleanor', last: 'Smith' },
        email: 'patient4@demo.com',
        age: 72,
        gender: Gender.FEMALE,
        height: 155,
        weight: 62,
        nyha_level: 3,
        medical_info: { conditions: ['Advanced Heart Failure'], restrictions: ['Low Sodium', 'Fluid Restriction'] },
        activity_level: 1,
        daily_budget: { calories: 1400, carbs: 140, protein: 90, fat: 35, sodium: 1000, cholesterol: 150, water_intake: 1500 }
      },
      {
        name: { first: 'Michael', last: 'Active' },
        email: 'patient5@demo.com',
        age: 35,
        gender: Gender.MALE,
        height: 185,
        weight: 90,
        nyha_level: 1,
        medical_info: { conditions: ['Cardiomyopathy'], restrictions: ['Athletic Diet'] },
        activity_level: 5,
        daily_budget: { calories: 2400, carbs: 300, protein: 180, fat: 67, sodium: 2000, cholesterol: 300, water_intake: 2800 }
      }
    ];

    for (const profile of patientProfiles) {
      const patient = userRepo.create({
        user_id: uuidv4(),
        first_name: profile.name.first,
        last_name: profile.name.last,
        email: profile.email,
        password: await bcrypt.hash('Patient123!', 10),
        gender: profile.gender,
        user_role: UserRole.PATIENT,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        country: countries[Math.floor(Math.random() * countries.length)],
        dietary: dietaries[Math.floor(Math.random() * dietaries.length)],
        ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
        nyha_level: profile.nyha_level,
        medical_info: profile.medical_info,
        user_nutrition_setting: {
          carbs_percentage: 0.5,
          protein_percentage: 0.3,
          fat_percentage: 0.2,
          cholesterol_level: CholesterolLevel.NORMAL,
          activity_level: profile.activity_level
        },
        daily_budget: profile.daily_budget
      });
      users.push(patient);
    }

    return await userRepo.save(users);
  }

  private async createFoodComponents(componentRepo: any, foodCategories: FoodCategory[]): Promise<Component[]> {
    const components: Component[] = [];

    // Malaysian heart-healthy food components with accurate nutrition data
    const componentData = [
      // Malaysian Proteins
      {
        name: 'Tempeh (Fermented Soybean)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 195, protein: 19.9, carbs: 7.6, fat: 11.4, sodium: 14, cholesterol: 0 },
        category: 'Protein'
      },
      {
        name: 'Fresh Ikan Kembung (Indian Mackerel)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 158, protein: 25.8, carbs: 0, fat: 5.4, sodium: 83, cholesterol: 70 },
        category: 'Protein'
      },
      {
        name: 'Ikan Bilis (Dried Anchovies)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 336, protein: 62.8, carbs: 0, fat: 8.3, sodium: 3668, cholesterol: 147 },
        category: 'Protein'
      },
      {
        name: 'Lean Chicken Thigh (Skinless)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 165, protein: 22.5, carbs: 0, fat: 7.8, sodium: 84, cholesterol: 81 },
        category: 'Protein'
      },
      {
        name: 'Fresh Prawns (Medium)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 85, protein: 20.1, carbs: 0, fat: 0.5, sodium: 270, cholesterol: 161 },
        category: 'Protein'
      },
      {
        name: 'Red Kidney Beans',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, sodium: 2, cholesterol: 0 },
        category: 'Protein'
      },

      // Malaysian Vegetables
      {
        name: 'Kangkung (Water Spinach)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 30, protein: 3.2, carbs: 4.7, fat: 0.7, sodium: 65, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Sayur Manis (Choy Sum)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2, sodium: 65, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Long Beans (Kacang Panjang)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 47, protein: 2.8, carbs: 8.4, fat: 0.4, sodium: 4, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Ladies Finger (Okra)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, sodium: 7, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Paku Pakis (Fern Shoot)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 34, protein: 4.6, carbs: 5.5, fat: 0.4, sodium: 1, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Petai (Stink Bean)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 142, protein: 6.5, carbs: 25.0, fat: 0.5, sodium: 30, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Terung (Asian Eggplant)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 25, protein: 0.98, carbs: 5.9, fat: 0.18, sodium: 2, cholesterol: 0 },
        category: 'Vegetables'
      },

      // Malaysian Grains and Carbs
      {
        name: 'Brown Rice (Local Variety)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, sodium: 5, cholesterol: 0 },
        category: 'Grains'
      },
      {
        name: 'Rice Vermicelli (Beehoon)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 109, protein: 0.9, carbs: 25.2, fat: 0.1, sodium: 2, cholesterol: 0 },
        category: 'Grains'
      },
      {
        name: 'Whole Grain Chapati Flour',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 340, protein: 12.1, carbs: 69.4, fat: 2.7, sodium: 2, cholesterol: 0 },
        category: 'Grains'
      },

      // Malaysian Healthy Fats
      {
        name: 'Reduced Fat Coconut Milk',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 154, protein: 1.6, carbs: 2.8, fat: 15.1, sodium: 13, cholesterol: 0 },
        category: 'Fats'
      },
      {
        name: 'Coconut Oil (Virgin)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.TABLESPOON,
        amount: 1,
        nutrition: { calories: 117, protein: 0, carbs: 0, fat: 13.6, sodium: 0, cholesterol: 0 },
        category: 'Fats'
      },
      {
        name: 'Peanuts (Raw)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, sodium: 18, cholesterol: 0 },
        category: 'Nuts'
      },
      {
        name: 'Cashew Nuts',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.9, sodium: 12, cholesterol: 0 },
        category: 'Nuts'
      },

      // Malaysian Spices and Herbs
      {
        name: 'Fresh Turmeric (Kunyit)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 3.1, protein: 0.09, carbs: 0.64, fat: 0.03, sodium: 0.4, cholesterol: 0 },
        category: 'Spices'
      },
      {
        name: 'Fresh Ginger (Halia)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 0.8, protein: 0.02, carbs: 0.18, fat: 0.01, sodium: 0.1, cholesterol: 0 },
        category: 'Spices'
      },
      {
        name: 'Fresh Galangal (Lengkuas)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 0.7, protein: 0.09, carbs: 0.15, fat: 0.01, sodium: 0.1, cholesterol: 0 },
        category: 'Spices'
      },
      {
        name: 'Lemongrass (Serai)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 0.99, protein: 0.13, carbs: 0.25, fat: 0.005, sodium: 0.1, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Kaffir Lime Leaves (Daun Limau Purut)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 1,
        nutrition: { calories: 0.1, protein: 0.01, carbs: 0.02, fat: 0.001, sodium: 0, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Vietnamese Mint (Daun Kesom)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 0.4, protein: 0.04, carbs: 0.08, fat: 0.007, sodium: 0.2, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Curry Leaves (Daun Kari)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 10,
        nutrition: { calories: 1.1, protein: 0.1, carbs: 0.19, fat: 0.01, sodium: 0.6, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Tamarind Paste (Asam Jawa)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TABLESPOON,
        amount: 1,
        nutrition: { calories: 17, protein: 0.19, carbs: 4.46, fat: 0.03, sodium: 1.7, cholesterol: 0 },
        category: 'Condiments'
      },
      {
        name: 'Low-Sodium Belacan (Shrimp Paste)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TEASPOON,
        amount: 1,
        nutrition: { calories: 8, protein: 1.4, carbs: 0.3, fat: 0.1, sodium: 680, cholesterol: 15 },
        category: 'Condiments'
      },
      {
        name: 'Kerisik (Toasted Coconut)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TABLESPOON,
        amount: 1,
        nutrition: { calories: 45, protein: 0.4, carbs: 1.8, fat: 4.3, sodium: 2, cholesterol: 0 },
        category: 'Condiments'
      },
      {
        name: 'Gula Melaka (Palm Sugar)',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TEASPOON,
        amount: 1,
        nutrition: { calories: 15, protein: 0, carbs: 4, fat: 0, sodium: 1, cholesterol: 0 },
        category: 'Condiments'
      }
    ];

    // Ensure we have at least 100 components for the demo dataset by cloning variants of the base items
    const originalComponentDataLength = componentData.length;
    let variantIndex = 0;
    while (componentData.length < 100) {
      const base = componentData[variantIndex % originalComponentDataLength];
      componentData.push({
        ...base,
        name: `${base.name} (Premium Grade)`
      });
      variantIndex++;
    }

    for (const compData of componentData) {
      // More flexible category matching
      const category = foodCategories.find(cat => 
        cat.type.toLowerCase() === compData.category.toLowerCase() ||
        cat.type.toLowerCase().includes(compData.category.toLowerCase()) ||
        compData.category.toLowerCase().includes(cat.type.toLowerCase())
      ) || foodCategories[0];
      
      if (!category) {
        console.warn(`⚠️ No matching food category found for: ${compData.category}. Available categories:`, foodCategories.map(fc => fc.type));
      }
      
      const component = componentRepo.create({
        id: uuidv4(),
        name: compData.name,
        component_type: compData.type,
        unit: compData.unit,
        amount: compData.amount,
        nutrition_info: {
          calories: compData.nutrition.calories,
          protein: compData.nutrition.protein,
          totalCarbohydrate: compData.nutrition.carbs,
          fat: compData.nutrition.fat,
          sodium: compData.nutrition.sodium,
          cholesterol: compData.nutrition.cholesterol
        },
        storage_links: {
          thumbnail: 'f4b20835-cb31-4893-9463-b9c89a5eaa3a',
          content: {}
        },
        foodCategory: category
      });
      
      components.push(component);
    }

    console.log(`✅ Created ${components.length} food components`);

    return await componentRepo.save(components);
  }

  private async createRecipes(recipeRepo: any, users: User[], cuisines: Cuisine[], dietaries: Dietary[], components: Component[]): Promise<Recipe[]> {
    const recipes: Recipe[] = [];

    const getCategoryIds = (categoryNames: string[]) => {
      const matchedCategories = components
        .map(c => c.foodCategory)
        .filter((category, index, self) => 
          category && categoryNames.includes(category.type) && 
          self.findIndex(c => c?.id === category.id) === index
        );
      return matchedCategories.map(category => category.id);
    };

    // Heart-healthy Malaysian recipes with realistic data
    const recipeData = [
      {
        name: 'Heart-Healthy Nasi Ulam (Herb Rice)',
        description: 'Traditional Malaysian herb rice with fresh local herbs, reduced-fat coconut, and toasted ikan bilis',
        preparation_time: '40 minutes',
        instructions: [
          'Cook brown rice with reduced coconut milk and pandan leaves',
          'Finely chop fresh herbs: daun kesom, curry leaves, Vietnamese mint, and turmeric leaves',
          'Dry-roast ikan bilis with minimal oil until crispy',
          'Toast desiccated coconut until light golden',
          'Mix cooled rice with chopped herbs, coconut, and ikan bilis',
          'Season lightly with lime juice and a pinch of salt',
          'Garnish with sliced chilies and serve at room temperature'
        ],
        serving_size: 4,
        nutrition_info: { calories: 285, protein: 12, totalCarbohydrate: 45, fat: 8, sodium: 320, cholesterol: 15 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Grains', 'Herbs', 'Protein'],
        cuisine_type: 'Malay'
      },
      {
        name: 'Steamed Ikan with Ginger & Soy (Heart-Healthy)',
        description: 'Fresh fish steamed with ginger, minimal soy sauce, and fresh herbs',
        preparation_time: '25 minutes',
        instructions: [
          'Clean and score fresh fish, place on heatproof plate',
          'Top with julienned ginger and spring onions',
          'Steam for 12-15 minutes until fish flakes easily',
          'Heat 1 tsp oil in pan, add garlic until fragrant',
          'Add reduced-sodium soy sauce and a touch of sesame oil',
          'Pour hot sauce over steamed fish',
          'Garnish with cilantro and serve immediately'
        ],
        serving_size: 2,
        nutrition_info: { calories: 195, protein: 28, totalCarbohydrate: 3, fat: 7, sodium: 380, cholesterol: 70 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Herbs'],
        cuisine_type: 'Chinese-Malaysian'
      },
      {
        name: 'Malaysian Tempeh Sambal (Low-Sodium)',
        description: 'Fermented tempeh with aromatic sambal paste, reduced in sodium and oil',
        preparation_time: '30 minutes',
        instructions: [
          'Cut tempeh into bite-sized pieces, steam for 10 minutes',
          'Make sambal paste: blend chilies, shallots, galangal, and turmeric with minimal water',
          'Dry-fry tempeh pieces until golden, set aside',
          'Stir-fry sambal paste with 1 tsp oil until fragrant',
          'Add tempeh back to pan with coconut milk and palm sugar',
          'Simmer until sauce thickens, finish with lime juice',
          'Garnish with sliced chilies and fresh herbs'
        ],
        serving_size: 3,
        nutrition_info: { calories: 220, protein: 18, totalCarbohydrate: 12, fat: 12, sodium: 280, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'Malay'
      },
      {
        name: 'Sayur Manis with Garlic (Heart-Healthy)',
        description: 'Sweet leaf vegetables stir-fried with minimal oil and fresh garlic',
        preparation_time: '15 minutes',
        instructions: [
          'Wash and trim sayur manis, separating leaves and tender stems',
          'Heat 1 tsp oil in wok over high heat',
          'Add minced garlic, stir-fry until fragrant (30 seconds)',
          'Add sayur manis stems first, stir-fry for 1 minute',
          'Add leaves, toss quickly until just wilted',
          'Season with a small pinch of salt and white pepper',
          'Serve immediately while vegetables are bright green'
        ],
        serving_size: 4,
        nutrition_info: { calories: 35, protein: 2.5, totalCarbohydrate: 4, fat: 1.5, sodium: 120, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Vegetables'],
        cuisine_type: 'Chinese-Malaysian'
      },
      {
        name: 'Malaysian Fish Curry (Heart-Healthy)',
        description: 'Aromatic fish curry with reduced coconut milk and fresh herbs',
        preparation_time: '35 minutes',
        instructions: [
          'Make curry paste with chilies, shallots, galangal, and turmeric',
          'Cube fresh fish and marinate with turmeric and salt',
          'Fry curry paste until oil separates',
          'Add reduced-fat coconut milk and bring to gentle simmer',
          'Add fish, okra, and tomatoes',
          'Simmer for 10 minutes, finish with curry leaves and lime juice'
        ],
        serving_size: 5,
        nutrition_info: { calories: 195, protein: 24, totalCarbohydrate: 8, fat: 8, sodium: 350, cholesterol: 65 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'Indian-Malaysian'
      }
    ];

    for (const recipeItem of recipeData) {
      const creator = users.find(u => u.user_role === UserRole.ADMIN) || users[0];
      const cuisine = cuisines.find(c => c.name === recipeItem.cuisine_type) || cuisines[0];
      const dietary = dietaries[Math.floor(Math.random() * dietaries.length)];

      const recipe = recipeRepo.create({
        id: uuidv4(),
        name: recipeItem.name,
        description: recipeItem.description,
        preparation_time: recipeItem.preparation_time,
        instruction: recipeItem.instructions,
        serving_size: recipeItem.serving_size,
        nutrition_info: recipeItem.nutrition_info,
        recommended_meal_time: recipeItem.recommended_meal_time,
        is_approved: true,
        visibility: recipeItem.visibility,
        storage_links: {
          thumbnail: 'f4b20835-cb31-4893-9463-b9c89a5eaa3a',
          content: {}
        },
        related_food_categories: getCategoryIds(recipeItem.related_food_categories),
        user: null,
        cuisine: cuisine,
        dietary: dietary
      });

      recipes.push(recipe);
    }

    return await recipeRepo.save(recipes);
  }

  private async createRecipeComponents(recipeComponentRepo: any, recipes: Recipe[], components: Component[]): Promise<void> {
    const recipeComponents: RecipeComponent[] = [];

    // Helper function to find component by name
    const findComponent = (name: string) => components.find(c => c.name.includes(name));

    // Recipe ingredients mapping for Malaysian recipes (using exact component names)
    const recipeIngredientsMap = {
      'Heart-Healthy Nasi Ulam (Herb Rice)': [
        { component: 'Brown Rice (Local Variety)', amount: 300 },
        { component: 'Reduced Fat Coconut Milk', amount: 100 },
        { component: 'Ikan Bilis (Dried Anchovies)', amount: 30 },
        { component: 'Kerisik (Toasted Coconut)', amount: 40 },
        { component: 'Vietnamese Mint (Daun Kesom)', amount: 20 },
        { component: 'Curry Leaves (Daun Kari)', amount: 10 },
        { component: 'Fresh Turmeric (Kunyit)', amount: 3 },
        { component: 'Tamarind Paste (Asam Jawa)', amount: 15 },
        { component: 'Gula Melaka (Palm Sugar)', amount: 2 }
      ],
      'Steamed Ikan with Ginger & Soy (Heart-Healthy)': [
        { component: 'Fresh Ikan Kembung (Indian Mackerel)', amount: 400 },
        { component: 'Fresh Ginger (Halia)', amount: 25 },
        { component: 'Sayur Manis (Choy Sum)', amount: 30 },
        { component: 'Fresh Turmeric (Kunyit)', amount: 10 },
        { component: 'Low-Sodium Belacan (Shrimp Paste)', amount: 5 },
        { component: 'Coconut Oil (Virgin)', amount: 1 },
        { component: 'Curry Leaves (Daun Kari)', amount: 15 }
      ],
      'Malaysian Tempeh Sambal (Low-Sodium)': [
        { component: 'Tempeh (Fermented Soybean)', amount: 250 },
        { component: 'Terung (Asian Eggplant)', amount: 100 },
        { component: 'Long Beans (Kacang Panjang)', amount: 50 },
        { component: 'Fresh Galangal (Lengkuas)', amount: 15 },
        { component: 'Fresh Turmeric (Kunyit)', amount: 5 },
        { component: 'Reduced Fat Coconut Milk', amount: 80 },
        { component: 'Gula Melaka (Palm Sugar)', amount: 8 },
        { component: 'Tamarind Paste (Asam Jawa)', amount: 10 },
        { component: 'Coconut Oil (Virgin)', amount: 1 }
      ],
      'Sayur Manis with Garlic (Heart-Healthy)': [
        { component: 'Sayur Manis (Choy Sum)', amount: 300 },
        { component: 'Fresh Ginger (Halia)', amount: 15 },
        { component: 'Coconut Oil (Virgin)', amount: 1 },
        { component: 'Fresh Turmeric (Kunyit)', amount: 3 },
        { component: 'Vietnamese Mint (Daun Kesom)', amount: 10 }
      ],
      'Malaysian Fish Curry (Heart-Healthy)': [
        { component: 'Fresh Ikan Kembung (Indian Mackerel)', amount: 500 },
        { component: 'Ladies Finger (Okra)', amount: 150 },
        { component: 'Kangkung (Water Spinach)', amount: 100 },
        { component: 'Fresh Galangal (Lengkuas)', amount: 20 },
        { component: 'Fresh Turmeric (Kunyit)', amount: 5 },
        { component: 'Reduced Fat Coconut Milk', amount: 200 },
        { component: 'Curry Leaves (Daun Kari)', amount: 15 },
        { component: 'Tamarind Paste (Asam Jawa)', amount: 20 },
        { component: 'Low-Sodium Belacan (Shrimp Paste)', amount: 3 }
      ]
    };

    // Create recipe components for each recipe
    for (const recipe of recipes) {
      const ingredients = recipeIngredientsMap[recipe.name];
      if (ingredients) {
        for (const ingredient of ingredients) {
          // Find the component by partial name match
          const component = components.find(c => 
            c.name.toLowerCase().includes(ingredient.component.toLowerCase()) ||
            ingredient.component.toLowerCase().includes(c.name.toLowerCase())
          );
          
          if (component) {
            const recipeComponent = recipeComponentRepo.create({
              component_id: component.id,
              recipe_id: recipe.id,
              amount: ingredient.amount,
              component: component,
              recipe: recipe
            });
            recipeComponents.push(recipeComponent);
          } else {
            console.log(`⚠️ Component not found: ${ingredient.component} for recipe: ${recipe.name}`);
          }
        }
      }
    }

    await recipeComponentRepo.save(recipeComponents);
    console.log(`✅ Created ${recipeComponents.length} recipe component relationships`);
  }

  private async createMealLoggingData(mealLoggingRepo: any, users: User[], recipes: Recipe[]): Promise<void> {
    const mealLogs: MealLogging[] = [];
    const patientUsers = users.filter(u => u.user_role === UserRole.PATIENT);

    // Create 3 weeks of meal logging data for each patient (excluding today)
    for (const user of patientUsers) {
      for (let day = 1; day < 21; day++) { // Start from day 1 to exclude today
        const logDate = new Date();
        logDate.setDate(logDate.getDate() - day);

        // Breakfast
        const breakfastRecipes = recipes.filter(r => r.recommended_meal_time && r.recommended_meal_time['breakfast']);
        const breakfastRecipe = breakfastRecipes.length > 0 ? breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)] : recipes[0];
        const breakfast = mealLoggingRepo.create({
          id: uuidv4(),
          user: user,
          recipe: breakfastRecipe,
          type: MealType.BREAKFAST,
          consumed_date_time: new Date(logDate.getTime() + 8 * 60 * 60 * 1000), // 8 AM
          portion: 1,
          is_consumed: Math.random() > 0.1 // 90% consumed
        });
        mealLogs.push(breakfast);

        // Lunch
        const lunchRecipes = recipes.filter(r => r.recommended_meal_time && r.recommended_meal_time['lunch']);
        const lunchRecipe = lunchRecipes.length > 0 ? lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)] : recipes[1];
        const lunch = mealLoggingRepo.create({
          id: uuidv4(),
          user: user,
          recipe: lunchRecipe,
          type: MealType.LUNCH,
          consumed_date_time: new Date(logDate.getTime() + 13 * 60 * 60 * 1000), // 1 PM
          portion: 1,
          is_consumed: Math.random() > 0.15 // 85% consumed
        });
        mealLogs.push(lunch);

        // Dinner
        const dinnerRecipes = recipes.filter(r => r.recommended_meal_time && r.recommended_meal_time['dinner']);
        const dinnerRecipe = dinnerRecipes.length > 0 ? dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)] : recipes[2];
        const dinner = mealLoggingRepo.create({
          id: uuidv4(),
          user: user,
          recipe: dinnerRecipe,
          type: MealType.DINNER,
          consumed_date_time: new Date(logDate.getTime() + 19 * 60 * 60 * 1000), // 7 PM
          portion: 1,
          is_consumed: Math.random() > 0.05 // 95% consumed
        });
        mealLogs.push(dinner);

        // Occasional snack
        if (Math.random() > 0.6) {
          const snackRecipes = recipes.filter(r => r.recommended_meal_time && r.recommended_meal_time['snack']);
          const snackRecipe = snackRecipes.length > 0 ? snackRecipes[Math.floor(Math.random() * snackRecipes.length)] : recipes[0];
          const snack = mealLoggingRepo.create({
            id: uuidv4(),
            user: user,
            recipe: snackRecipe,
            type: MealType.OTHER,
            consumed_date_time: new Date(logDate.getTime() + 15 * 60 * 60 * 1000), // 3 PM
            portion: 0.5,
            is_consumed: Math.random() > 0.2 // 80% consumed
          });
          mealLogs.push(snack);
        }
      }
    }

    await mealLoggingRepo.save(mealLogs);
    console.log(`✅ Created ${mealLogs.length} meal logging entries`);
  }

  private async createFluidLoggingData(fluidLoggingRepo: any, users: User[]): Promise<void> {
    const fluidLogs: FluidLogging[] = [];
    const patientUsers = users.filter(u => u.user_role === UserRole.PATIENT);

    for (const user of patientUsers) {
      for (let day = 0; day < 21; day++) {
        const logDate = new Date();
        logDate.setDate(logDate.getDate() - day);
        logDate.setHours(0, 0, 0, 0); // Set to beginning of day

        const dailyGoal = (user as any).daily_budget?.water_intake || 2000;
        
        // Create realistic daily water intake (between 60-90% of goal)
        const intakePercentage = 0.6 + Math.random() * 0.3; // 60% to 90%
        const totalConsumed = Math.floor(dailyGoal * intakePercentage);
        const remainingFluid = Math.max(dailyGoal - totalConsumed, 0);

        // Create logging history that matches backend expectations
        const loggingHistory: any[] = [
          {
            date: logDate.toISOString(),
            remaining_fluid: dailyGoal
          }
        ];

        // Add realistic intake entries throughout the day
        const intakeEntries = [
          { hour: 7, amount: Math.floor(totalConsumed * 0.2) }, // Morning
          { hour: 10, amount: Math.floor(totalConsumed * 0.15) }, // Mid-morning
          { hour: 13, amount: Math.floor(totalConsumed * 0.25) }, // Lunch
          { hour: 16, amount: Math.floor(totalConsumed * 0.2) }, // Afternoon
          { hour: 19, amount: Math.floor(totalConsumed * 0.2) } // Evening
        ];

        let runningTotal = dailyGoal;
        for (const entry of intakeEntries) {
          if (entry.amount > 0 && Math.random() > 0.1) { // 90% chance of logging
            runningTotal -= entry.amount;
            const entryDate = new Date(logDate);
            entryDate.setHours(entry.hour, Math.floor(Math.random() * 60), 0, 0);
            
            loggingHistory.push({
              date: entryDate.toISOString(),
              remaining_fluid: Math.max(runningTotal, 0)
            });
          }
        }

        const fluidLog = fluidLoggingRepo.create({
          id: uuidv4(),
          user: user,
          logging_date: logDate,
          remaining_fluid: remainingFluid,
          logging_history: loggingHistory
        });

        fluidLogs.push(fluidLog);
      }
    }

    await fluidLoggingRepo.save(fluidLogs);
    console.log(`✅ Created ${fluidLogs.length} fluid logging entries with realistic intake patterns`);
  }

  private async createEducationalContent(educationalRepo: any): Promise<EducationalContent[]> {
    // Check if educational content already exists
    const existingContent = await educationalRepo.count();
    if (existingContent > 0) {
      console.log(`📚 Educational content already exists (${existingContent} items), skipping creation`);
      return await educationalRepo.find();
    }

    const educationalContent = [
      {
        title: 'Understanding Heart-Healthy Nutrition',
        summary: 'Learn about the fundamentals of nutrition for heart health, including limiting sodium and choosing healthy fats.',
        content: 'Learn about the fundamentals of nutrition for heart health, including the importance of limiting sodium, choosing healthy fats, and incorporating fiber-rich foods into your diet. A heart-healthy diet focuses on whole foods, lean proteins, and plenty of vegetables and fruits. Understanding nutrition labels and making informed food choices is essential for managing cardiovascular health.',
        thumbnail: 'https://pixabay.com/get/gc13a33a5315b62268f8753c329348daa810776d8076c8d12abb5b56b87d63d8f4488e2a0113de39b63cac51aae2c46d6641d5b521bb9e22022e572535e2be287_640.jpg'
      },
      {
        title: 'Managing Sodium Intake',
        summary: 'Discover practical tips for reducing sodium in your diet while maintaining flavor and reading nutrition labels.',
        content: 'Discover practical tips for reducing sodium in your diet while maintaining flavor. Learn to read nutrition labels and identify hidden sources of sodium in processed foods. High sodium intake can contribute to high blood pressure and increase the risk of heart disease. By choosing fresh ingredients and using herbs and spices instead of salt, you can create delicious, heart-healthy meals.',
        thumbnail: 'https://pixabay.com/get/g2b7f8cb6b37b34ecd3dd7b91f9f2b51d3ba7c34b5bb4df2e4c8b3b11a4b2765e98925c1029deb52b5d0618d8b56b2a9da66f97a1e73cd19c7e55a58ad9e9bf47f_640.jpg'
      },
      {
        title: 'The Mediterranean Diet for Heart Health',
        summary: 'Explore the benefits of the Mediterranean diet pattern, rich in olive oil, fish, vegetables, and whole grains.',
        content: 'Explore the benefits of the Mediterranean diet pattern, rich in olive oil, fish, vegetables, and whole grains, and how it can support cardiovascular health. This dietary approach emphasizes whole foods, healthy fats, and moderate portions. Research shows that following a Mediterranean-style diet can reduce the risk of heart disease and improve overall cardiovascular health.',
        thumbnail: 'https://pixabay.com/get/gfaf996e67d62657eadc227d709c583fa36b566675ba30c9d176d543ec0e2980ee617d3c81f62aa4a04dfa664f1af0bc81a110aa5232c3cda10239c5a40343474_640.jpg'
      },
      {
        title: 'Exercise and Your Heart',
        summary: 'Learn about safe and effective exercise routines for people with heart conditions and monitoring heart rate.',
        content: 'Learn about safe and effective exercise routines for people with heart conditions. Understand the importance of gradual progression and monitoring your heart rate. Regular physical activity strengthens the heart muscle and improves circulation. Start slowly and gradually increase intensity under medical supervision to ensure safety and effectiveness.',
        thumbnail: 'https://pixabay.com/get/ge0993e0ffb3beceaea637a42ae65cfeefda18facb927f004cf963ce2d960d0f804eeb49adb2a2b60cfc0e818c84f75007f3f9a44d9e32ffd9815e7580ea4fe8a_640.jpg'
      },
      {
        title: 'Meal Planning for Heart Health',
        summary: 'Master the art of meal planning to ensure consistent, heart-healthy nutrition with weekly templates and shopping tips.',
        content: 'Master the art of meal planning to ensure consistent, heart-healthy nutrition. Includes weekly planning templates and grocery shopping tips. Effective meal planning helps you maintain a consistent heart-healthy diet while saving time and money. Plan balanced meals that include lean proteins, whole grains, and plenty of vegetables to support your cardiovascular health goals.',
        thumbnail: 'https://pixabay.com/get/g849e8af84de652b18d81f47e2a2e53b8de645b9df7b2e4e3c4e5b44f73b58b5e3b3b4e75b2b3d4e1b9c7a8e2f5c4b7a6e9d8c5b2a1e7f4b3a6c9d2e5f8b1a4c7e_640.jpg'
      }
    ];

    const contents: EducationalContent[] = [];
    for (const item of educationalContent) {
      const educational = educationalRepo.create({
        id: uuidv4(),
        title: item.title,
        summary: item.summary,
        content: [item.content], // store as array to fit text[] type
        visibility: Visibility.PUBLIC,
        storage_links: {
          thumbnail: null,
          content: {}
        }
      });
      contents.push(educational);
    }

    const savedContents = await educationalRepo.save(contents);
    console.log(`✅ Created ${savedContents.length} educational content items`);
    return savedContents;
  }

  /**
   * Fetch and update component images using Pixabay API
   */
  private async fetchAndUpdateComponentImages(componentRepo: any, components: Component[]): Promise<void> {
    console.log(`🖼️  Fetching images for ${components.length} Malaysian ingredients...`);

    const componentImages = await this.imageService.batchFetchImages(
      components,
      async (component) => {
        // Clean up the ingredient name for better search results
        const cleanName = component.name
          .replace(/\(.*?\)/g, '') // Remove text in parentheses like "(Fermented Soybean)"
          .replace(/Heart-Healthy/gi, '') // Remove heart-healthy prefix
          .trim();
        
        return await this.imageService.getIngredientImage(cleanName);
      },
      10, // Larger batch size - Pixabay allows 6,000 requests/hour
      500 // Shorter delay between batches
    );

    // Update components with image URLs
    const updatedComponents: Component[] = [];
    
    for (const component of components) {
      const image = componentImages.get(component);
      if (image) {
        const existingLinks = component.storage_links as any || {};
        const newStorageLinks = {
          thumbnail: image.url,
          content: existingLinks.content || {},
          image: image.url,
          image_small: image.smallUrl,
          attribution: image.attribution,
          photographer: image.photographer,
          photographer_profile: image.photographerProfile
        };
        component.storage_links = newStorageLinks as any;
        updatedComponents.push(component);

        // Note: Pixabay doesn't require download tracking like Unsplash
      }
    }

    if (updatedComponents.length > 0) {
      await componentRepo.save(updatedComponents);
      console.log(`✅ Updated ${updatedComponents.length} components with images`);
    }
  }

  /**
   * Fetch and update recipe images using Pixabay API
   */
  private async fetchAndUpdateRecipeImages(recipeRepo: any, recipes: Recipe[]): Promise<void> {
    console.log(`🖼️  Fetching images for ${recipes.length} Malaysian recipes...`);

    const recipeImages = await this.imageService.batchFetchImages(
      recipes,
      async (recipe) => {
        return await this.imageService.getRecipeImage(recipe.name);
      },
      10, // Larger batch size - Pixabay allows 6,000 requests/hour
      500 // Shorter delay between batches
    );

    // Update recipes with image URLs
    const updatedRecipes: Recipe[] = [];
    
    for (const recipe of recipes) {
      const image = recipeImages.get(recipe);
      if (image) {
        const existingLinks = recipe.storage_links as any || {};
        const newStorageLinks = {
          thumbnail: image.url,
          content: existingLinks.content || {},
          image: image.url,
          image_small: image.smallUrl,
          attribution: image.attribution,
          photographer: image.photographer,
          photographer_profile: image.photographerProfile
        };
        (recipe.storage_links as any) = newStorageLinks;
        updatedRecipes.push(recipe);

        // Note: Pixabay doesn't require download tracking like Unsplash
      }
    }

    if (updatedRecipes.length > 0) {
      await recipeRepo.save(updatedRecipes);
      console.log(`✅ Updated ${updatedRecipes.length} recipes with images`);
    }
  }

  /**
   * Fetch and update educational content images using Pixabay API
   */
  private async fetchAndStoreEducationalImages(educationalRepo: any, educationalContent: EducationalContent[]): Promise<void> {
    console.log(`🖼️  Fetching and storing images for ${educationalContent.length} educational content items...`);

    // Define search terms for each educational content type
    const searchTermsMap = {
      'Understanding Heart-Healthy Nutrition': 'heart healthy nutrition food',
      'Managing Sodium Intake': 'low sodium diet food',
      'The Mediterranean Diet for Heart Health': 'mediterranean diet healthy',
      'Exercise and Your Heart': 'cardio exercise heart health',
      'Meal Planning for Heart Health': 'meal planning healthy diet'
    };

    const educationalImages = await this.imageService.batchFetchImages(
      educationalContent,
      async (content) => {
        const searchTerm = searchTermsMap[content.title] || 'healthy lifestyle nutrition';
        return await this.imageService.getEducationalImage(searchTerm);
      },
      5, // Smaller batch size
      1000 // Longer delay between batches
    );

    // Update educational content with image URLs
    for (const content of educationalContent) {
        const image = educationalImages.get(content);
        if (image) {
          try {
            await this.dataSource.transaction(async transactionalEntityManager => {
                // 1. Download image from Pixabay URL
                console.log(`⬇️  Downloading image for "${content.title}"...`);
                const imageBuffer = await this.imageService.downloadImageAsBuffer(image.url);
    
                // 2. Prepare for upload
                const fileExtension = image.url.split('.').pop()?.split('?')[0] || 'jpg';
                const fileName = `${content.id}.${fileExtension}`;
                const fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    
                // 3. Save to DB via StorageService
                console.log(`💾  Saving image for "${content.title}" to database...`);
                const savedStorage = await this.storageService.saveFileToDb({
                    fileName,
                    fileType: fileType as StorageType,
                    buffer: imageBuffer
                }, transactionalEntityManager);
    
                // 4. Update entity with new storage_id
                const newStorageLinks = {
                    thumbnail: savedStorage.storage_id, // This is the storage_id
                    content: {},
                    attribution: image.attribution,
                    photographer: image.photographer,
                    photographer_profile: image.photographerProfile
                };
    
                content.storage_links = newStorageLinks as any;
                await transactionalEntityManager.save(EducationalContent, content);
                console.log(`✅ Stored image for "${content.title}" with storage ID: ${savedStorage.storage_id}`);
            });
          } catch (error) {
            console.error(`❌ Failed to process and store image for "${content.title}":`, error.message);
          }
        }
      }
  }
}