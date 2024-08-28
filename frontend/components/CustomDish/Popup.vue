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
                <ButtonGreen @click.prevent="()=>{}" v-else>Done</ButtonGreen>
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
const customMeal = reactive(new CustomMealData("Mystery Dish","assets/img/croissant.svg"))
const ingredientList = reactive([new IngredientData("Potato","assets/img/potato.svg",0,"grams"),
    new IngredientData("Tomato","assets/img/potato.svg",0,"grams"),
    new IngredientData("Chicken","assets/img/potato.svg",0,"grams"),
    new IngredientData("Cauliflower","assets/img/potato.svg",0,"grams"),
    new IngredientData("Rice","assets/img/potato.svg",0,"grams"),
    new IngredientData("Plutonium","assets/img/potato.svg",0,"grams")])

const seasoningList = reactive([
    new IngredientData("Salt","assets/img/potato.svg",0,"tbsp"),
    new IngredientData("Pepper","assets/img/potato.svg",0,"tbsp"),
    new IngredientData("Blackpepper","assets/img/potato.svg",0,"tbsp"),
    new IngredientData("Arsenic","assets/img/potato.svg",0,"tbsp"),
    new IngredientData("Wasabi","assets/img/potato.svg",0,"tbsp"),
])
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
    currentSection.value += 1
    if(currentSection.value > MAX_SECTIONS) {
        // implement custom recipe adding here
        currentSection.value -= 1
    }
}
</script>