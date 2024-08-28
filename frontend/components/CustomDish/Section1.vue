<template>
	<div class="flex w-full h-full grow p-2 space-x-4">
		<div class="w-2/3 flex flex-col space-y-2">
			<SearchBar v-model="searchVal" :dataList="ingredientNameList"/>
			<H2>{{ searchVal.length>0 ? "Search" : "Recent Searches" }}</H2>
			<CustomDishIngredientList v-if="searchVal.length>0" :columns="2" :ingredientList="filteredIngredientList" buttonStr="+" :buttonOnClick="onAdd" :includeDropdown="true" class="overflow-y-auto"  style="max-height:50vh"/>
			<CustomDishIngredientList v-else-if="recentSearches.length>0" :columns="2" :ingredientList="recentSearches" buttonStr="+" :buttonOnClick="onAdd" :includeDropdown="true" class="overflow-y-auto"  style="max-height:50vh"/>
			<P v-else>No recent searches! Start searching to find ingredients</P>
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
	recentSearches.value = recentSearches.value.filter(item => item !== ingredient)
	recentSearches.value = [ingredient].concat(recentSearches.value)
}

const onRemove = (ingredient) => {
	props.modelValue.ingredientList = props.modelValue.ingredientList.filter(item => item !== ingredient)
}

const searchVal = ref("")


const ingredientNameList = computed({
	get() {
		return props.ingredientList.map((ingredient) => {return ingredient.name})
	}
})

const filteredIngredientList = computed({
	get() {
		return props.ingredientList.filter((item) => {
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

const recentSearches = ref([])


</script>