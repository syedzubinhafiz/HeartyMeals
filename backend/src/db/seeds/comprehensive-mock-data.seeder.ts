import { DataSource } from 'typeorm';
import { User } from '../../user/user.entity';
import { Component } from '../../component/component.entity';
import { Recipe } from '../../recipe/recipe.entity';
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

export class ComprehensiveMockDataSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('🌱 Starting comprehensive mock data seeding...');

    // Get repositories
    const userRepo = this.dataSource.getRepository(User);
    const componentRepo = this.dataSource.getRepository(Component);
    const recipeRepo = this.dataSource.getRepository(Recipe);
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

    // 3. Create Recipes
    console.log('🍽️ Creating recipes...');
    const recipes = await this.createRecipes(recipeRepo, demoUsers, cuisines, dietaries, components);

    // 4. Create Meal Logging Data
    console.log('📊 Creating meal logging data...');
    await this.createMealLoggingData(mealLoggingRepo, demoUsers, recipes);

    // 5. Create Fluid Logging Data
    console.log('💧 Creating fluid logging data...');
    await this.createFluidLoggingData(fluidLoggingRepo, demoUsers);

    // 6. Create Educational Content
    console.log('📚 Creating educational content...');
    await this.createEducationalContent(educationalRepo);

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

    // Comprehensive food components with accurate nutrition data
    const componentData = [
      // Proteins
      {
        name: 'Skinless Chicken Breast',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, sodium: 74, cholesterol: 85 },
        category: 'Protein'
      },
      {
        name: 'Atlantic Salmon',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 208, protein: 22.1, carbs: 0, fat: 12.4, sodium: 52, cholesterol: 59 },
        category: 'Protein'
      },
      {
        name: 'Lean Ground Turkey',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 189, protein: 27.4, carbs: 0, fat: 8.3, sodium: 98, cholesterol: 98 },
        category: 'Protein'
      },
      {
        name: 'Tofu (Firm)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 144, protein: 17.3, carbs: 2.8, fat: 8.7, sodium: 7, cholesterol: 0 },
        category: 'Protein'
      },
      {
        name: 'Black Beans',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 341, protein: 21.6, carbs: 62.4, fat: 1.4, sodium: 5, cholesterol: 0 },
        category: 'Protein'
      },

      // Vegetables
      {
        name: 'Fresh Spinach',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, sodium: 79, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Broccoli',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, sodium: 33, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Sweet Potato',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, sodium: 54, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Bell Peppers',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 31, protein: 1, carbs: 7.3, fat: 0.3, sodium: 4, cholesterol: 0 },
        category: 'Vegetables'
      },
      {
        name: 'Zucchini',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, sodium: 8, cholesterol: 0 },
        category: 'Vegetables'
      },

      // Whole Grains
      {
        name: 'Brown Rice',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, sodium: 5, cholesterol: 0 },
        category: 'Grains'
      },
      {
        name: 'Quinoa',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, sodium: 7, cholesterol: 0 },
        category: 'Grains'
      },
      {
        name: 'Whole Wheat Pasta',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 124, protein: 5, carbs: 25.1, fat: 1.1, sodium: 6, cholesterol: 0 },
        category: 'Grains'
      },
      {
        name: 'Oats',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4, sodium: 49, cholesterol: 0 },
        category: 'Grains'
      },

      // Healthy Fats
      {
        name: 'Avocado',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, sodium: 7, cholesterol: 0 },
        category: 'Fats'
      },
      {
        name: 'Extra Virgin Olive Oil',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.TABLESPOON,
        amount: 1,
        nutrition: { calories: 119, protein: 0, carbs: 0, fat: 13.5, sodium: 0, cholesterol: 0 },
        category: 'Fats'
      },
      {
        name: 'Almonds',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, sodium: 1, cholesterol: 0 },
        category: 'Nuts'
      },
      {
        name: 'Walnuts',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, sodium: 2, cholesterol: 0 },
        category: 'Nuts'
      },

      // Dairy Alternatives
      {
        name: 'Greek Yogurt (Low-fat)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.GRAM,
        amount: 100,
        nutrition: { calories: 97, protein: 18.2, carbs: 3.6, fat: 1.7, sodium: 36, cholesterol: 10 },
        category: 'Dairy'
      },
      {
        name: 'Almond Milk (Unsweetened)',
        type: ComponentType.INGREDIENT,
        unit: MeasuringUnit.CUP,
        amount: 1,
        nutrition: { calories: 37, protein: 1.5, carbs: 1.4, fat: 3.2, sodium: 189, cholesterol: 0 },
        category: 'Dairy'
      },

      // Seasonings and Herbs
      {
        name: 'Fresh Garlic',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 1,
        nutrition: { calories: 1.5, protein: 0.1, carbs: 0.3, fat: 0, sodium: 0.2, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Fresh Basil',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.GRAM,
        amount: 1,
        nutrition: { calories: 0.2, protein: 0, carbs: 0, fat: 0, sodium: 0, cholesterol: 0 },
        category: 'Herbs'
      },
      {
        name: 'Turmeric',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TEASPOON,
        amount: 1,
        nutrition: { calories: 8, protein: 0.3, carbs: 1.4, fat: 0.2, sodium: 1, cholesterol: 0 },
        category: 'Spices'
      },
      {
        name: 'Black Pepper',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TEASPOON,
        amount: 1,
        nutrition: { calories: 6, protein: 0.2, carbs: 1.4, fat: 0.1, sodium: 1, cholesterol: 0 },
        category: 'Spices'
      },
      {
        name: 'Lemon Juice',
        type: ComponentType.SEASONING,
        unit: MeasuringUnit.TABLESPOON,
        amount: 1,
        nutrition: { calories: 4, protein: 0.1, carbs: 1.3, fat: 0, sodium: 0, cholesterol: 0 },
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
        name: `${base.name} Variant ${variantIndex + 1}`
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

    // Get food categories to map names to UUIDs
    const foodCategoryRepo = this.dataSource.getRepository(FoodCategory);
    const foodCategories = await foodCategoryRepo.find();
    
    const getCategoryIds = (categoryNames: string[]) => {
      return categoryNames.map(name => {
        const category = foodCategories.find(fc => fc.type === name);
        return category ? category.id : null;
      }).filter(id => id !== null);
    };

    // Heart-healthy recipes with realistic data
    const recipeData = [
      {
        name: 'Mediterranean Grilled Salmon',
        description: 'Heart-healthy grilled salmon with olive oil, herbs, and vegetables',
        preparation_time: '25 minutes',
        instructions: [
          'Preheat grill to medium-high heat',
          'Season salmon with herbs, garlic, and olive oil',
          'Grill salmon for 4-5 minutes per side',
          'Serve with grilled vegetables and quinoa'
        ],
        serving_size: 4,
        nutrition_info: { calories: 320, protein: 28, totalCarbohydrate: 12, fat: 18, sodium: 180, cholesterol: 65 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'Mediterranean'
      },
      {
        name: 'Quinoa Buddha Bowl',
        description: 'Nutritious vegetarian bowl with quinoa, roasted vegetables, and tahini dressing',
        preparation_time: '30 minutes',
        instructions: [
          'Cook quinoa according to package directions',
          'Roast sweet potatoes and broccoli at 400°F for 20 minutes',
          'Prepare tahini dressing with lemon and herbs',
          'Assemble bowl with quinoa, vegetables, and dressing'
        ],
        serving_size: 2,
        nutrition_info: { calories: 380, protein: 12, totalCarbohydrate: 58, fat: 14, sodium: 220, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Grains', 'Vegetables'],
        cuisine_type: 'Modern'
      },
      {
        name: 'Heart-Healthy Oatmeal',
        description: 'Fiber-rich breakfast oatmeal with nuts and berries',
        preparation_time: '10 minutes',
        instructions: [
          'Combine oats with almond milk in a pot',
          'Cook on medium heat for 5 minutes, stirring occasionally',
          'Add cinnamon and a touch of honey',
          'Top with fresh berries and chopped almonds'
        ],
        serving_size: 1,
        nutrition_info: { calories: 280, protein: 8, totalCarbohydrate: 45, fat: 9, sodium: 95, cholesterol: 0 },
        recommended_meal_time: { breakfast: true, lunch: false, dinner: false, snack: true },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Grains', 'Nuts'],
        cuisine_type: 'American'
      },
      {
        name: 'Herb-Crusted Chicken Breast',
        description: 'Lean protein with herb seasoning and roasted vegetables',
        preparation_time: '35 minutes',
        instructions: [
          'Preheat oven to 375°F',
          'Season chicken with herbs and garlic',
          'Bake chicken for 25-30 minutes until cooked through',
          'Serve with steamed broccoli and brown rice'
        ],
        serving_size: 4,
        nutrition_info: { calories: 290, protein: 32, totalCarbohydrate: 18, fat: 8, sodium: 160, cholesterol: 85 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'American'
      },
      {
        name: 'Vegetable Stir-Fry with Tofu',
        description: 'Colorful vegetable stir-fry with protein-rich tofu',
        preparation_time: '20 minutes',
        instructions: [
          'Press tofu and cut into cubes',
          'Heat oil in wok or large skillet',
          'Stir-fry tofu until golden, then remove',
          'Stir-fry vegetables until crisp-tender',
          'Return tofu to pan with low-sodium sauce'
        ],
        serving_size: 3,
        nutrition_info: { calories: 240, protein: 15, totalCarbohydrate: 22, fat: 12, sodium: 380, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'Asian'
      },
      {
        name: 'Lentil and Vegetable Soup',
        description: 'Hearty, fiber-rich soup with lentils and mixed vegetables',
        preparation_time: '40 minutes',
        instructions: [
          'Sauté onions, carrots, and celery in olive oil',
          'Add garlic and cook for 1 minute',
          'Add lentils, vegetables, and low-sodium broth',
          'Simmer for 25-30 minutes until lentils are tender',
          'Season with herbs and serve hot'
        ],
        serving_size: 6,
        nutrition_info: { calories: 180, protein: 12, totalCarbohydrate: 32, fat: 2, sodium: 220, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'Mediterranean'
      },
      {
        name: 'Baked Sweet Potato with Black Beans',
        description: 'Nutritious sweet potato topped with seasoned black beans',
        preparation_time: '45 minutes',
        instructions: [
          'Bake sweet potatoes at 400°F for 35-40 minutes',
          'Heat black beans with cumin and garlic',
          'Cut open sweet potatoes and fluff flesh',
          'Top with black beans, salsa, and cilantro',
          'Serve with a dollop of Greek yogurt'
        ],
        serving_size: 4,
        nutrition_info: { calories: 220, protein: 8, totalCarbohydrate: 45, fat: 1, sodium: 240, cholesterol: 0 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Protein', 'Vegetables'],
        cuisine_type: 'American'
      },
      {
        name: 'Green Smoothie Bowl',
        description: 'Nutrient-packed breakfast bowl with spinach, fruits, and nuts',
        preparation_time: '10 minutes',
        instructions: [
          'Blend frozen banana, spinach, and almond milk',
          'Pour into bowl and top with fresh berries',
          'Add sliced almonds and chia seeds',
          'Drizzle with honey if desired',
          'Serve immediately'
        ],
        serving_size: 1,
        nutrition_info: { calories: 260, protein: 6, totalCarbohydrate: 42, fat: 9, sodium: 85, cholesterol: 0 },
        recommended_meal_time: { breakfast: true, lunch: false, dinner: false, snack: true },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Fruits', 'Vegetables'],
        cuisine_type: 'Modern'
      },
      {
        name: 'Whole Grain Pasta Primavera',
        description: 'Light pasta dish with seasonal vegetables and herbs',
        preparation_time: '25 minutes',
        instructions: [
          'Cook whole grain pasta according to package directions',
          'Sauté mixed vegetables in olive oil',
          'Add garlic, herbs, and a splash of pasta water',
          'Toss pasta with vegetables and fresh basil',
          'Serve with a sprinkle of Parmesan cheese'
        ],
        serving_size: 4,
        nutrition_info: { calories: 280, protein: 10, totalCarbohydrate: 52, fat: 6, sodium: 180, cholesterol: 5 },
        recommended_meal_time: { breakfast: false, lunch: true, dinner: true, snack: false },
        visibility: Visibility.PUBLIC,
        related_food_categories: ['Grains', 'Vegetables'],
        cuisine_type: 'Italian'
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

  private async createMealLoggingData(mealLoggingRepo: any, users: User[], recipes: Recipe[]): Promise<void> {
    const mealLogs: MealLogging[] = [];
    const patientUsers = users.filter(u => u.user_role === UserRole.PATIENT);

    // Create 3 weeks of meal logging data for each patient
    for (const user of patientUsers) {
      for (let day = 0; day < 21; day++) {
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

  private async createEducationalContent(educationalRepo: any): Promise<void> {
    const educationalContent = [
      {
        title: 'Understanding Heart-Healthy Nutrition',
        content: 'Learn about the fundamentals of nutrition for heart health, including the importance of limiting sodium, choosing healthy fats, and incorporating fiber-rich foods into your diet.',
        category: 'Nutrition',
        author: 'Heart Health Team'
      },
      {
        title: 'Managing Sodium Intake',
        content: 'Discover practical tips for reducing sodium in your diet while maintaining flavor. Learn to read nutrition labels and identify hidden sources of sodium in processed foods.',
        category: 'Nutrition',
        author: 'Registered Dietitian'
      },
      {
        title: 'The Mediterranean Diet for Heart Health',
        content: 'Explore the benefits of the Mediterranean diet pattern, rich in olive oil, fish, vegetables, and whole grains, and how it can support cardiovascular health.',
        category: 'Diet Plans',
        author: 'Nutrition Specialist'
      },
      {
        title: 'Exercise and Your Heart',
        content: 'Learn about safe and effective exercise routines for people with heart conditions. Understand the importance of gradual progression and monitoring your heart rate.',
        category: 'Exercise',
        author: 'Cardiac Rehabilitation Team'
      },
      {
        title: 'Meal Planning for Heart Health',
        content: 'Master the art of meal planning to ensure consistent, heart-healthy nutrition. Includes weekly planning templates and grocery shopping tips.',
        category: 'Meal Planning',
        author: 'Clinical Nutritionist'
      }
    ];

    const contents: EducationalContent[] = [];
    for (const item of educationalContent) {
      const educational = educationalRepo.create({
        id: uuidv4(),
        title: item.title,
        summary: item.title, // simple summary same as title for demo
        content: [item.content], // store as array to fit text[] type
        visibility: Visibility.PUBLIC,
        storage_links: {
          thumbnail: 'f4b20835-cb31-4893-9463-b9c89a5eaa3a',
          content: {}
        }
      });
      contents.push(educational);
    }

    await educationalRepo.save(contents);
  }
} 