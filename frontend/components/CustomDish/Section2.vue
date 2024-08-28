<template>
	<div class="flex w-full h-full grow p-2 space-x-4">
		<div class="w-2/3 flex flex-col space-y-2">
			<SearchBar v-model="searchVal" :dataList="seasoningNameList"/>
			<H2>{{ searchVal.length>0 ? "Search" : "Recent Searches" }}</H2>
			<CustomDishIngredientList :columns="2" :ingredientList="filteredSeasoningList" buttonStr="+" :buttonOnClick="onAdd" :includeDropdown="true" class="overflow-y-auto"  style="max-height:50vh"/>
		</div>
		<div class="w-1/3 flex flex-col space-y-2">
			<H2>Selected Seasoning</H2>
			<CustomDishIngredientList :columns="1" :ingredientList="modelValue.seasoningList" buttonStr="-" :buttonOnClick="onRemove" :includeDropdown="true" class="overflow-y-auto" style="max-height:50vh"/>
		</div>

	</div>
</template>
<script setup>
import CustomMealData from '../../classes/customMealData.js'

defineOptions({
	name: "CustomDishSection2",
});

const props = defineProps({
	modelValue: {
		type: CustomMealData,
		default: new CustomMealData("Default Meal","assets/img/croissant.svg")
	},
	seasoningList: {
		default: []
	}
})

const onAdd = (ingredient) => {
	props.modelValue.seasoningList.push(ingredient.clone())
}

const onRemove = (ingredient) => {
	props.modelValue.seasoningList = props.modelValue.seasoningList.filter(item => item !== ingredient)
}

const searchVal = ref("")


const seasoningNameList = computed({
	get() {
		return props.seasoningList.map((ingredient) => {return ingredient.name})
	}
})

const filteredSeasoningList = computed({
	get() {
		return props.seasoningList.filter((item) => {
			let search = searchVal.value.toLowerCase()
			let name = item.name.toLowerCase()
			let splitNames = name.split(" ")
			let i = splitNames.length - 1
			let currentName = splitNames[i].toLowerCase()
			if(search.length <= currentName.length && search === currentName.slice(0, search.length)) {
				return true
			}
			i -= 1
			while(i>=0) {
				currentName = splitNames[i].toLowerCase() + " " + currentName
				if(search.length <= currentName.length && search === currentName.slice(0, search.length)) {
					return true
				}
				i -= 1
			}
			return false
		});
	}
})
</script>