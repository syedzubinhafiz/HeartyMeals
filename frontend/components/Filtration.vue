<template>
    <div>
        <ButtonOrange @click="showFiltration = !showFiltration">Filter</ButtonOrange>
        <Overlay :level="1" v-if="showFiltration" class="absolute z-20 flex flex-col space-y-2 p-2 mt-2">
            <div class="flex space-x-2">
                <p>Cuisine</p>
                <Dropdown v-model="cuisineInput" :options="cuisineNames" :optionsValues="cuisineIDs"/>
            </div>
            <div class="flex space-x-2">
                <p>Dietary</p>
                <Dropdown v-model="dietInput" :options="dietNames" :optionsValues="dietIDs"/>
            </div>
            <div class="flex space-x-2">
                <p>Meal Type</p>
                <Dropdown v-model="mealTypeInput" :options="mealTypeList" :optionsValues="mealTypeValues"/>
            </div>
            <div class="flex space-x-2">
                <p>Food Category</p>
                <Dropdown v-model="foodCategoryInput" :options="foodCategoryTypes" :optionsValues="foodCategoryIDs"/>
            </div>
        </Overlay>
    </div>


</template>
<script setup>
defineOptions({
	name: "Filtration",
});

const props = defineProps({
    cuisine: {
        default: "All"
    },
    diet: {
        default: "All"
    },
    mealType: {
        default: "All"
    },
    foodCategory: {
        default: "All"
    }
})
const emits = defineEmits(["update:cuisine","update:diet","update:mealType","update:foodCategory"]);

const cuisineInput = computed({
    get() {
        return props.cuisine
    },
    set(value) {
        emits("update:cuisine", value);
    }
})

const dietInput = computed({
    get() {
        return props.cuisine
    },
    set(value) {
        emits("update:diet", value);
    }
})


const mealTypeInput = computed({
    get() {
        return props.cuisine
    },
    set(value) {
        emits("update:mealType", value);
    }
})


const foodCategoryInput = computed({
    get() {
        return props.cuisine
    },
    set(value) {
        emits("update:foodCategory", value);
    }
})


const showFiltration = ref(false)

const cuisineList = ref([])
const cuisineNames = ref([])
const cuisineIDs = ref([])

const dietList = ref([])
const dietNames = ref([])
const dietIDs = ref([])

const mealTypeList = ref([])
const mealTypeValues = ref([])

const foodCategoryList = ref([])
const foodCategoryTypes = ref([])
const foodCategoryIDs = ref([])
onMounted(async () => {
    await useApi("/dietary","GET")
    cuisineList.value = (await useFillData().fillCuisines()).value
    cuisineNames.value = ["All"].concat(cuisineList.value.map((val)=>{return val.name}))
    cuisineIDs.value = [null].concat(cuisineList.value.map((val)=>{return val.id}))

    dietList.value = (await useApi('/dietary','GET')).value
    dietNames.value = ["All"].concat(dietList.value.map((val)=>{return val.name}))
    dietIDs.value = [null].concat(dietList.value.map((val)=>{return val.id}))

    mealTypeList.value = ["All","Breakfast","Lunch","Dinner","Snack"]
    mealTypeValues.value = [null,"Breakfast","Lunch","Dinner","Snack"]

    foodCategoryList.value = (await useApi('/food_category/get','GET')).value
    foodCategoryTypes.value = ["All"].concat(foodCategoryList.value.map((val)=>{return val.type}))
    foodCategoryIDs.value = [null].concat(foodCategoryList.value.map((val)=>{return val.id}))

})
</script>