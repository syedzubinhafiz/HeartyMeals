<template>
	<div class="grid gap-8 h-fit" :style="`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`">
		<CustomDishIngredient v-for="(ingredient, i) in ingredientList" :ingredient="ingredientList[i]" :buttonStr="buttonStr" :buttonOnClick="buttonOnClick" :includeInput="includeInput" :includeDropdown="includeDropdown"/>
	</div>
</template>
<script setup>
defineOptions({
	name: "CustomDishIngredientList",
});

const props = defineProps({
	ingredientList: {
		default: []
	},
	columns: {
		default: 1
	},
	buttonStr: {
        type: String,
        default: null
    },
	buttonOnClick: {
        type: Function,
        default: () => {}
    },
	includeInput: {
        type: Boolean,
        default: false
    },
    includeDropdown: {
        type: Boolean,
        default: false
    }
})
</script>