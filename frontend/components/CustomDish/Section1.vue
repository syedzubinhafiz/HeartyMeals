<template>
	<div class="flex w-full h-full grow p-2 space-x-4">
		<div class="w-2/3 flex flex-col space-y-2">
			<SearchBar/>
			<H2>Recent Searches</H2>
			<CustomDishIngredientList :columns="2" :ingredientList="ingredientList" buttonStr="+" :buttonOnClick="onAdd" :includeDropdown="true" class="overflow-y-auto"  style="max-height:50vh"/>
		</div>
		<div class="w-1/3 flex flex-col space-y-2">
			<H2>Selected Ingredients</H2>
			<CustomDishIngredientList :columns="1" :ingredientList="modelValue.ingredientList" buttonStr="-" :buttonOnClick="onRemove" :includeDropdown="true" class="overflow-y-auto" style="max-height:50vh"/>
		</div>

	</div>
</template>
<script setup>
import CustomMealData from '../../classes/customMealData.js'

defineOptions({
	name: "CustomDishSection1",
});

const props = defineProps({
	modelValue: {
		type: CustomMealData,
		default: new CustomMealData("Default Meal","assets/img/croissant.svg")
	},
	ingredientList: {
		default: []
	},
})

const onAdd = (ingredient) => {
	props.modelValue.ingredientList.push(ingredient.clone())
}

const onRemove = (ingredient) => {
	props.modelValue.ingredientList = props.modelValue.ingredientList.filter(item => item !== ingredient)
}
</script>