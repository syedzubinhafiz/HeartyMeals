<template>
    <div class="h-fit bg-custom-overlay-light rounded-md shadow-md p-2 flex flex-row space-x-1 items-center">
        <img :src="ingredient.imgSrc" class="h-8 w-8"/>
        <P>{{ ingredient.name }}</P>
        <div class="grow flex justify-end space-x-1 items-center">
            <Input v-if="includeInput" v-model="ingredient.cookingMethod" class="rounded-md" placeholder="insert cooking method"/>
            <Input v-if="includeDropdown" v-model="ingredient.quantity" type="number" class="w-14 rounded-md" placeholder=""/>
            <Dropdown v-if="includeDropdown" v-model="ingredient.unit" :options="['tbsp','grams','ml','items']" class="shadow-md rounded-md" color="bg-white"/>
            <ButtonTransparent v-if="buttonStr!=null" @click.prevent="() => buttonOnClick(ingredient)">{{ buttonStr }}</ButtonTransparent>
        </div>
        
    </div>
</template>
<script setup>
import IngredientData from '../../classes/ingredientData.js'

defineOptions({
	name: "CustomDishIngredient",
});

const props = defineProps({
    ingredient: {
        type: IngredientData,
        default: new IngredientData("Potato",'/assets/img/potato.svg')
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