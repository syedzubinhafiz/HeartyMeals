<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex w-full h-full items-center justify-center" @click.self="closeOverlay">
        <Overlay :level="1" class="fixed z-50 min-w-96 min-h-96 p-4">
            <div class="flex space-x-5">
                <div class="flex flex-col space-y-2">
                    <H2>{{ meal.recipe.name }}</H2>
                    <img :src="`assets/img/croissant.svg`" alt="Meal Image" class="img" />
                </div>
                <div class="flex flex-col pt-2 space-y-2 m-2">
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/macroEnergy.svg" alt="icon" width="16" height="16">
                            <p>Calories</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.calories.toFixed(2)}}kcal</span>
                    </div>
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/macroCarb.svg" alt="icon" width="16" height="16">
                            <p>Carbohydrates</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.totalCarbohydrate.toFixed(2)}}g</span>
                    </div>
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/macroProtein.svg" alt="icon" width="16" height="16">
                            <p>Proteins</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.protein.toFixed(2)}}g</span>
                    </div>
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/macroFat.svg" alt="icon" width="10" height="10">
                            <p>Fats</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.fat.toFixed(2)}}g</span>
                    </div>
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/macroSodium.svg" alt="icon" width="16" height="16">
                            <p>Sodium</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.sodium.toFixed(2)}}g</span>
                    </div>
                    <div class="flex justify-between p-2 space-x-5">
                        <span class="flex space-x-1">
                            <img src="/assets/img/cholesterolsIcon.png" alt="icon" width="16" height="16">
                            <p>Cholesterol</p>
                        </span>
                        <span>{{+meal.recipe.nutrition_info.cholesterol.toFixed(2)}}g</span>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="grow p-2">
                    <CustomDishIngredientList :columns="1" :ingredientList="meal.components.ingredient.map((val)=>{return IngredientData.fromApi(val)})" class="w-full"/>
                </div>
                <div class="flex items-end min-h-full">
                    <ButtonGreen @click="onAddMeal">Add to Stomach</ButtonGreen>
                </div>
                
            </div>
            
        </Overlay>
    </div>

</template>
<script setup>
import IngredientData from '~/classes/ingredientData';
import MealData from '../../classes/mealData.js'

defineOptions({
	name: "AddMealsOverlay",
});

const emits = defineEmits(["closeOverlay"])

const props = defineProps({
    visible: {
        type: Boolean
    },
    meal: {
        type: Object
    }
})

const closeOverlay = () => {
    emits('closeOverlay');
}

const onAddMeal = async () => {
  const result = await useApi(`/recipe/get?recipeId=${props.meal.recipe.id}`,"GET")
  if(result.isError) {
    useToast().error("Meal adding failed!")
  }
  else {
    useToast().success(`Meal Added!`)
    console.log(result.value)
    if(useMealLogging().unsavedMealList.value==null) {
      useMealLogging().unsavedMealList.value = []
    }
    useMealLogging().unsavedMealList.value.push(MealData.fromApi(result.value.recipe))
    console.log(useMealLogging().unsavedMealList)
    closeOverlay()
  }
}
</script>