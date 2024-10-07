<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <div v-if="computedPopupOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex w-full h-full items-center justify-center">
        <Overlay :level="1" class="fixed z-50 min-w-96 min-h-96 p-4">
            <div class="flex justify-end w-full">
                <button @click="togglePopup" class="text-black">
                    <i class="bi bi-x text-3xl"></i>
                </button>
            </div>
            <div class="flex justify-center px-24">
                <CustomDishProgressBar :progress="currentSection" :sections="['Select raw ingredients','Select seasoning','Set recipe','Summary']"/>
            </div>
            <div class="flex flex-col items-center grow">
                <CustomDishSection1 v-if="currentSection==0" v-model="customMeal" :ingredientList="ingredientList"/>
                <CustomDishSection2 v-if="currentSection==1" v-model="customMeal" :seasoningList="seasoningList"/>
                <CustomDishSection3 v-if="currentSection==2" v-model="customMeal" :ingredientList="ingredientList"/>
                <CustomDishSection4 v-if="currentSection==3" v-model="customMeal" :ingredientList="ingredientList" :seasoningList="seasoningList"/>
            </div>
            <div class="flex justify-between">
                <ButtonGreen @click.prevent="sectionBack" v-if="currentSection>0">← Back</ButtonGreen>
                <div v-else/>
                <ButtonGreen @click.prevent="sectionNext" v-if="currentSection<MAX_SECTIONS-1">→ Next</ButtonGreen>
                <ButtonGreen @click.prevent="addRecipe" v-else>Done</ButtonGreen>
            </div>
        </Overlay>
    </div>

</template>
<script setup>
import NutrientData from '../../classes/nutrientData.js'
import CustomMealData from '../../classes/customMealData.js'
import IngredientData from '../../classes/ingredientData.js'
defineOptions({
	name: "CustomDishPopup",
});

const props = defineProps({
  isPopupOpen: {
      type: Boolean,
      default: false
  },
})
// -----------------------
const customMeal = reactive(new CustomMealData("Custom Dish","assets/img/croissant.svg"))
const ingredientList = reactive([])
// reactive([new IngredientData("Potato","assets/img/potato.svg",0,"grams"),
//     new IngredientData("Tomato","assets/img/potato.svg",0,"grams"),
//     new IngredientData("Chicken","assets/img/potato.svg",0,"grams"),
//     new IngredientData("Cauliflower","assets/img/potato.svg",0,"grams"),
//     new IngredientData("Rice","assets/img/potato.svg",0,"grams"),
//     new IngredientData("Plutonium","assets/img/potato.svg",0,"grams")])
const seasoningList = reactive([])
// reactive([
//     new IngredientData("Salt","assets/img/potato.svg",0,"tbsp"),
//     new IngredientData("Pepper","assets/img/potato.svg",0,"tbsp"),
//     new IngredientData("Blackpepper","assets/img/potato.svg",0,"tbsp"),
//     new IngredientData("Arsenic","assets/img/potato.svg",0,"tbsp"),
//     new IngredientData("Wasabi","assets/img/potato.svg",0,"tbsp"),
// ])
// -----------------------

const emits = defineEmits(["update:isPopupOpen"]);

const computedPopupOpen = computed({
	get() {
		return props.isPopupOpen;
	},
	set(value) {
		emits("update:isPopupOpen", value);
	},
});

const togglePopup = () => {
  computedPopupOpen.value = false;
};

// -----------------------
const currentSection = ref(0)
const MAX_SECTIONS = 4
const sectionBack = () => {currentSection.value = Math.max(0,currentSection.value-1)}
const sectionNext = () => {
    let isValid = validateSection(currentSection.value)
    if(isValid && currentSection.value < MAX_SECTIONS) {
        currentSection.value += 1
    }
}

const validateSection = (section) => {
    if(section==0) {
        if(customMeal.ingredientList.length==0) {
            useToast().error("At least one Ingredient is required!")
            return false
        }
    }
    else if (section==1) {
        // uncomment if at least one seasoning is required

        // if(customMeal.seasoningList.length==0) {
        //     useToast().error("At least one Seasoning is required!")
        //     return false
        // }
    }
    else if (section==2) {
        if(!customMeal.breakfast && !customMeal.lunch && !customMeal.dinner && !customMeal.snack) {
            useToast().error("At least one Recommended meal time is required!")
            return false
        }
        else if(customMeal.name=="") {
            useToast().error("Custom meal name required!")
            return false
        }
        else if(customMeal.dietaryID=="") {
            useToast().error("Diet required!")
            return false
        }
        else if(customMeal.cuisineID=="") {
            useToast().error("Cuisine required!")
            return false
        }
        else if(customMeal.instructions=="") {
            useToast().error("Instructions required!")
            return false
        }
    }
    else if (section==3) {

    }
    return true
}


onMounted(async () => {
    await useApi("/dietary","GET")
    let ingredients = await useFillData().fillIngredients()
    console.log(ingredients)
    ingredients = ingredients.value.data.map((jsonData) => {return IngredientData.importFromJson(jsonData)})
    for(let ingredient of ingredients) {
        ingredientList.push(ingredient)
    }
    let seasonings = await useFillData().fillSeasoning()
    seasonings = seasonings.value.data.map((jsonData) => {return IngredientData.importFromJson(jsonData)})
    for(let seasoning of seasonings) {
        seasoningList.push(seasoning)
    }
})

const addRecipe = async () => {
    let result = await useApi("/recipe/add","POST",{
    "recipe": {
        "name": customMeal.name,
        "description": customMeal.description,
        "instruction": customMeal.instructions.split("\n"),
        "servingSize": customMeal.recipeServing,
        "preparationTime": `${customMeal.prepTime} minutes`,
        "mealTimeRecommendation": {
            "Breakfast" : customMeal.breakfast,
            "Lunch" : customMeal.lunch,
            "Dinner": customMeal.dinner,
            "Snack": customMeal.snack
        },
        "visibility": customMeal.visibility,
        "cuisineId": customMeal.cuisineID,
        "dietaryId": customMeal.dietaryID
    },
    "components": customMeal.ingredientList.map((ingredient)=>{return ingredient.toJson()})
        .concat(customMeal.seasoningList.map((seasoning)=>{return seasoning.toJson()})),
    "files": {
        "thumbnail": {
            "fileName": "beef.jpg",
            "fileType": "image/jpeg",
            "fileDataInBase64": await useSampleImages(1)
        },
        "content": []
    }
})

    if(result.isError) {
        useToast().error( `${result?.value?.data?.statusCode} ${result?.value?.data?.error}: ${result?.value?.data?.message}`)
    }
    else {
        useToast().success("Custom Recipe Added!")
        customMeal.reset()
        currentSection.value = 0
        togglePopup()
    }
    console.log(result)

}

</script>