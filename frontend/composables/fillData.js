
export const useFillData = () => {
    const fillIngredients = async () => {
        // get
        let data = await useApi("/component/ingredients?page=1&pageSize=100","GET")
        // if no data, fill
        if(data.value.data.length==0) {
            const foodCategoryList = await useApi("/food_category/get","GET")
            let results = ""
            results = await useApi("/component/add","POST",{
                "name": "beef",
                "amount": 100,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="RED MEAT")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 300,
                    "totalCarbohydrate": 100,
                    "protein": 100,
                    "fat": 100,
                    "sodium": 2,
                    "cholesterol": 50,
                }
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "potato",
                "amount": 200,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 100,
                    "totalCarbohydrate": 200,
                    "protein": 50,
                    "fat": 20,
                    "sodium": 0,
                    "cholesterol": 50,
                }
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "fish",
                "amount": 100,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SEAFOOD")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 200,
                    "totalCarbohydrate": 50,
                    "protein": 200,
                    "fat": 20,
                    "sodium": 2,
                    "cholesterol": 20,
                }
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "tomato",
                "amount": 120,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 100,
                    "totalCarbohydrate": 100,
                    "protein": 80,
                    "fat": 20,
                    "sodium": 0,
                    "cholesterol": 10,
                }
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "pork",
                "amount": 50,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="PORK")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 300,
                    "totalCarbohydrate": 100,
                    "protein": 200,
                    "fat": 120,
                    "sodium": 3,
                    "cholesterol": 50,
                }
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "plutonium",
                "amount": 170,
                "unit": "g",
                "componentType": "Ingredient",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="PEANUT")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {
                    "calories": 400,
                    "totalCarbohydrate": 100,
                    "protein": 100,
                    "fat": 100,
                    "sodium": 20,
                    "cholesterol": 50,
                }
            })
            console.log(results)
            data = await useApi("/component/ingredients?page=1&pageSize=100","GET")
        }
        return data
    }
    const fillSeasoning = async () => {
        // get
        let data = await useApi("/component/seasonings?page=1&pageSize=100","GET")
        // if no data, fill
        if(data.value.data.length==0) {
            const foodCategoryList = await useApi("/food_category/get","GET")
            let results = ""
            results = await useApi("/component/add","POST",{
                "name": "Salt",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "Pepper",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "Wasabi",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "MSG",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "Arsenic",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            results = await useApi("/component/add","POST",{
                "name": "Blackpepper",
                "amount": 1,
                "unit": "tbsp",
                "componentType": "Seasoning",
                "foodCategoryId": foodCategoryList.value.filter((value) => value.type.toUpperCase()=="SOY BEAN")[0].id,
                // "cuisineId": "bec8033b-d449-49c8-a2f2-c3c2c9d7bc38",
                "nutritionInformation" : {}
            })
            console.log(results)
            data = await useApi("/component/seasonings?page=1&pageSize=100","GET")
        }
        return data
    }
    const fillCuisines = async () => {
        // get
        let data = await useApi("/cuisine","GET")
        // if no data, fill
        if(data.value.length==0) {
            let results = ""
            results = await useApi("/cuisine","POST",{
                "name" : "Japanese",
                "countryId": "JPN"
            })
            console.log(results)
            results = await useApi("/cuisine","POST",{
                "name" : "American",
                "countryId": "USA"
            })
            console.log(results)
            results = await useApi("/cuisine","POST",{
                "name" : "Korean",
                "countryId": "KOR"
            })
            console.log(results)
            results = await useApi("/cuisine","POST",{
                "name" : "Taiwanese",
                "countryId": "TWN"
            })
            console.log(results)
            results = await useApi("/cuisine","POST",{
                "name" : "French",
                "countryId": "FRA"
            })
            console.log(results)
            results = await useApi("/cuisine","POST",{
                "name" : "Indian",
                "countryId": "IND"
            })
            console.log(results)
            data = await useApi("/cuisine","GET")
        }
        return data
    }
    const fillRecipes = async () => {
        // get
        let data = await useApi("/recipe/get","GET")
        console.log(data)
        // if no data, fill
        if(data.value.length==0) {
            const cuisines = await fillCuisines()
            const diets = await useApi("/dietary","GET")
            const ingredients = await fillIngredients()
            const seasoning = await fillSeasoning()
            let results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Baked Potato with Fish",
                    "description": "Wow so baked, very fishy",
                    "instruction": ["1) add potato","2) add fish","3) bake for 20 minutes"],
                    "servingSize": 2,
                    "preparationTime": `30 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : true,
                        "Lunch" : false,
                        "Dinner": false,
                        "Snack": true
                    },
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="USA")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="HALAL")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="POTATO")[0].id,
                        "amount" : 100,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="FISH")[0].id,
                        "amount" : 50,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Potato Tomato",
                    "description": "They rhyme!",
                    "instruction": ["1) add potato","2) add tomato","3) mix together"],
                    "servingSize": 1,
                    "preparationTime": `15 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : false,
                        "Lunch" : true,
                        "Dinner": false,
                        "Snack": true
                    },
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="FRA")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="VEGAN")[0].id,
                    "user_id":null
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="POTATO")[0].id,
                        "amount" : 200,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="TOMATO")[0].id,
                        "amount" : 200,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Fishy Pork",
                    "description": "Very meat",
                    "instruction": ["1) add fish","2) add pork","3) cook for 60 minutes"],
                    "servingSize": 1,
                    "preparationTime": `60 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : false,
                        "Lunch" : true,
                        "Dinner": true,
                        "Snack": false
                    },
                    "is_approved":true,
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="USA")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="NON-HALAL")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="PORK")[0].id,
                        "amount" : 150,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="FISH")[0].id,
                        "amount" : 100,
                        "unit": "g"
                    }
                ]
            })
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Nagasaki Roll",
                    "description": "Gives you superpowers",
                    "instruction": ["1) add beef","2) add plutonium","3) put into nuclear reactor for 90 minutes"],
                    "servingSize": 1,
                    "preparationTime": `120 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : true,
                        "Lunch" : true,
                        "Dinner": true,
                        "Snack": false
                    },
                    "is_approved":true,
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="JPN")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="NON-HALAL")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="BEEF")[0].id,
                        "amount" : 120,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="PLUTONIUM")[0].id,
                        "amount" : 20,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Potato with more Potato",
                    "description": "Potato with Potatos but also Potatos within Potatos",
                    "instruction": ["1) add baked potato","2) add fried potato","3) potato"],
                    "servingSize": 1,
                    "preparationTime": `30 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : false,
                        "Lunch" : false,
                        "Dinner": false,
                        "Snack": true
                    },
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="KOR")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="VEGAN")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="POTATO")[0].id,
                        "amount" : 100,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="TOMATO")[0].id,
                        "amount" : 50,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "Meal that has seasoning",
                    "description": "very seasoned",
                    "instruction": ["instruction"],
                    "servingSize": 1,
                    "preparationTime": `15 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : true,
                        "Lunch" : true,
                        "Dinner": true,
                        "Snack": false
                    },
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="KOR")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="HALAL")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="TOMATO")[0].id,
                        "amount" : 70,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="FISH")[0].id,
                        "amount" : 100,
                        "unit": "g"
                    },
                    {
                        "componentId": seasoning.value.data.filter((value) => value.name.toUpperCase()=="SALT")[0].id,
                        "amount" : 5,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            results = await useApi("/recipe/add","POST",{
                "recipe": {
                    "name": "askdsalkdsalkdalkds",
                    "description": "???",
                    "instruction": ["instruction"],
                    "servingSize": 1,
                    "preparationTime": `90 minutes`,
                    "mealTimeRecommendation": {
                        "Breakfast" : false,
                        "Lunch" : true,
                        "Dinner": true,
                        "Snack": false
                    },
                    "visibility": "Public",
                    "cuisineId": cuisines.value.filter((value) => value.country_id.toUpperCase()=="USA")[0].id,
                    "dietaryId": diets.value.filter((value) => value.name.toUpperCase()=="VEGAN")[0].id
                },
                "components": [
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="POTATO")[0].id,
                        "amount" : 120,
                        "unit": "g"
                    },
                    {
                        "componentId": ingredients.value.data.filter((value) => value.name.toUpperCase()=="TOMATO")[0].id,
                        "amount" : 50,
                        "unit": "g"
                    },
                    {
                        "componentId": seasoning.value.data.filter((value) => value.name.toUpperCase()=="ARSENIC")[0].id,
                        "amount" : 20,
                        "unit": "g"
                    }
                ]
            
            })
            console.log(results)
            data = await useApi("/recipe/get","GET")
        }
        return data
    }
    const createMeal = async (date,recipeId,mealType,portion=1) => {
        let result = await useApi("/meal-log-summary/calculate","POST",{
            "mealDate": date,
            "recipeIdPortions": [
                {
                    "recipeId": recipeId,
                    "portion": portion
                }
            ],
            "mealType": mealType
        })
        let nutritionAfter = result.value[2]
        result = await useApi("/meal-log-summary/add","POST",{
            "mealDate": date,
            "recipeIdPortions": [
                {
                    "recipeId": recipeId,
                    "portion": portion
                }
            ],
            "nutritionAfter": nutritionAfter,
            "mealType": mealType
          }
        )
        return result
    }
    const fillMealLogging = async() => {
        let currentDate = new Date()
        currentDate.setUTCHours(-8, 0, 0, 0)
        currentDate = currentDate.toISOString()
        // get
        let data = await useApi(`/meal-logging/get?date=${currentDate}`,"GET")
        // if no data, fill
        if(data.value.Breakfast.length==0 && data.value.Lunch.length==0 && data.value.Dinner.length==0 && data.value.Other.length==0) {
            const recipes = await fillRecipes()
            let recipe = null

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="BAKED POTATO WITH FISH")[0].id
<<<<<<< Updated upstream
            console.log(createMeal(currentDate,recipe,"Breakfast",2))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="FISHY PORK")[0].id
            console.log(createMeal(currentDate,recipe,"Lunch",2))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="POTATO WITH MORE POTATO")[0].id
            console.log(createMeal(currentDate,recipe,"Other",1))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="BAKED POTATO WITH FISH")[0].id
            console.log(createMeal(currentDate,recipe,"Other",1))
=======
            console.log(await createMeal(currentDate,recipe,"Breakfast",2))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="FISHY PORK")[0].id
            console.log(await createMeal(currentDate,recipe,"Lunch",2))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="POTATO WITH MORE POTATO")[0].id
            console.log(await createMeal(currentDate,recipe,"Other",1))

            recipe = await recipes.value.filter((value) => value.name.toUpperCase()=="BAKED POTATO WITH FISH")[0].id
            console.log(await createMeal(currentDate,recipe,"Other",1))
>>>>>>> Stashed changes

            data = await useApi(`/meal-logging/get?date=${currentDate}`,"GET")
        }

        return data
    }
    return {fillIngredients, fillSeasoning, fillCuisines, fillRecipes, fillMealLogging, createMeal}
}