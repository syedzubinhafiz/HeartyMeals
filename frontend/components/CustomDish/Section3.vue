<template>
	<div class="flex-col w-full h-full grow">
		<div class="w-full flex p-2 space-x-4">
			<div class="w-1/2 flex flex-col space-y-2">
				<div class="flex justify-center items-center p-2">
					<div class="border border-black rounded-lg">
						<ImgDragbox v-model="modelValue.imgSrc"/>
					</div>
				</div>
			</div>
			<div class="w-1/2 flex flex-col space-y-2">
				<H3>Recommended Meal Time</H3>
				<div class="flex space-x-2 items-center justify-between">
					<div class="space-x-2">
						<label for="cbBreakfast">Breakfast</label>
						<input v-model="modelValue.breakfast" type="checkbox" id="cbBreakfast" class="translate-y-[2px]"/>
					</div>
					<div class="space-x-2">
						<label for="cbLunch">Lunch</label>
						<input v-model="modelValue.lunch" type="checkbox" id="cbLunch" class="translate-y-[2px]"/>
					</div>
					<div class="space-x-2">
						<label for="cbDinner">Dinner</label>
						<input v-model="modelValue.dinner"  type="checkbox" id="cbDinner" class="translate-y-[2px]"/>
					</div>
					<div class="space-x-2">
						<label for="cbSnack">Snack</label>
						<input v-model="modelValue.snack" type="checkbox" id="cbSnack" class="translate-y-[2px]"/>
					</div>

				</div>
				<div class="flex">
					<div class="w-1/2">
						<H3>Recipe Visibility</H3>
						<Dropdown v-model="modelValue.visibility" :options="['unlisted','private','public']"/>
						<H3>Preparation Time</H3>
						<div class="flex space-x-2">
							<Input v-model="modelValue.prepTime" type="number" placeholder="" class="w-2/5"/>
							<p>minutes</p>
						</div>
						
						<H3>Recipe Serving</H3>
						<Input v-model="modelValue.recipeServing" type="number" placeholder="" class="w-2/5"/>
					</div>
					<div class="w-1/2">
						<H3>Diet</H3>
						<Dropdown v-model="modelValue.dietaryID"/>
						<H3>Cuisine</H3>
						<Dropdown v-model="modelValue.cuisineID"/>
					</div>
				</div>

			</div>
		</div>
		<div class="w-full flex p-2 space-x-4">
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

const image = ref(null)
</script>