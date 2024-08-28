<template>
	<div class="flex-col w-full h-full grow">
		<div class="w-full flex p-2 space-x-4">
			<div class="w-1/2 flex flex-col space-y-2">
				<div class="flex justify-center items-center p-2">
					<div class="py-20 px-10 border border-black rounded-lg">
						<p>TODO: image insertion component</p>
					</div>
				</div>
			</div>
			<div class="w-1/2 flex flex-col space-y-2">
				<div class="w-full p-2 h-36 mb-10">
					<H3>Additional Info</H3>
					<TextArea v-model="modelValue.description" class="w-full h-36"/>
				</div>
			</div>
		</div>
		<div class="w-full flex p-2 space-x-4">
			<div class="w-3/5 flex flex-col space-y-2">
				<H2>Ingredients</H2>
				<CustomDishIngredientList :columns="1" :ingredientList="modelValue.ingredientList" buttonStr="-" :buttonOnClick="onRemoveIngredient" :includeInput="true" :includeDropdown="true" class="overflow-y-auto" style="max-height:30vh"/>
			</div>
			<div class="w-2/5 flex flex-col space-y-2">
				<H2>Seasoning</H2>
				<CustomDishIngredientList :columns="1" :ingredientList="modelValue.seasoningList" buttonStr="-" :buttonOnClick="onRemoveSeasoning" :includeDropdown="true" class="overflow-y-auto" style="max-height:30vh"/>
			</div>
		</div>
	</div>
</template>
<script setup>
import CustomMealData from '../../classes/customMealData.js'


defineOptions({
	name: "CustomDishSection4",
});

const props = defineProps({
	modelValue: {
		type: CustomMealData,
		default: new CustomMealData("Default Meal","assets/img/croissant.svg")
	},
	ingredientList: {
		default: []
	},
	seasoningList: {
		default: []
	}
})

const onRemoveIngredient = (ingredient) => {
	props.modelValue.ingredientList = props.modelValue.ingredientList.filter(item => item !== ingredient)
}

const onRemoveSeasoning = (seasoning) => {
	props.modelValue.seasoningList = props.modelValue.seasoningList.filter(item => item !== seasoning)
}
</script>