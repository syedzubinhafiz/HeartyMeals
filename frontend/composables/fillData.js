
export const useFillData = () => {
    const fillIngredients = async () => {
        // get
        const data = await useApi("/component/ingredients?page=1&pageSize=100","GET")
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
        }
        return data
    }
    const fillSeasoning = async () => {
        // get
        const data = await useApi("/component/seasonings?page=1&pageSize=100","GET")
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
        }
        return data
    }
    return {fillIngredients, fillSeasoning}
}