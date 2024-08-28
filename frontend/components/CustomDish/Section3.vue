<template>
	<div class="flex flex-col w-full h-full grow p-2">
		<div class="flex justify-center items-center p-2">
			<div class="py-20 px-10 border border-black rounded-lg">
				<p>TODO: image insertion component</p>
			</div>
			
		</div>
		
		<div class="flex h-full">
			<div class="w-1/2 p-2 space-y-2">
				<H3>Recipe Corner</H3>
				<CustomDishIngredientList :columns="1" :ingredientList="modelValue.ingredientList" :includeInput="true" class="overflow-y-auto"  style="max-height:30vh"/>
			</div>
			<div class="w-1/2 p-2 h-min-36 h-full">
				<H3>Additional Info</H3>
				<TextArea v-model="modelValue.description" class="w-full min-h-24 h-full"/>
			</div>
		</div>
	</div>
</template>
<script setup>
import CustomMealData from '../../classes/customMealData.js'

defineOptions({
	name: "CustomDishSection3",
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
</script>