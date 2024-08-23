<template>
    <div class="items-center flex flex-col">
    <Overlay level="1" class="space-y-4 z-10 rounded-xl shadow-xl">
        <H3 class="mx-10">Total Nutrition</H3>
        <NutrientBarDelta label="Calories" :valueBefore="nutrientData.calories" :valueAfter="netNutrientData.calories" :maxValue="2000" colorBefore="#D7D1B4" colorAfter="#B8B396" bgColor="#E9E5CD" icon="/assets/img/caloriesIcon.png"/>
        <NutrientBarDelta label="Carbohydrates" :valueBefore="nutrientData.carbohydrtates" :valueAfter="netNutrientData.carbohydrtates" :maxValue="2000" colorBefore="#A2D3D6" colorAfter="#83BBBE" bgColor="#E2F3F4"  icon="/assets/img/carbIcon.png"/>
        <NutrientBarDelta label="Protein" :valueBefore="nutrientData.protein" :valueAfter="netNutrientData.protein" :maxValue="2000" colorBefore="#99D0A3" colorAfter="#87A98D" bgColor="#E8F0E9"  icon="/assets/img/proteinIcon.png"/>
        <NutrientBarDelta label="Fats" :valueBefore="nutrientData.fats" :valueAfter="netNutrientData.fats" :maxValue="2000" colorBefore="#FCDEA3" colorAfter="#ECC474" bgColor="#FBF1CD"  icon="/assets/img/fatsIcon.png"/>
        <NutrientBarDelta label="Sodium" :valueBefore="nutrientData.sodium" :valueAfter="netNutrientData.sodium" :maxValue="100" colorBefore="#F6AA97" colorAfter="#EC7455" bgColor="#F9E1DA"  icon="/assets/img/sodiumIcon.png"/>
        <NutrientBarDelta label="Cholesterols" :valueBefore="nutrientData.cholesterol" :valueAfter="netNutrientData.cholesterol" :maxValue="2000" colorBefore="#F1C9AF" colorAfter="#BE9A83" bgColor="#FFE5D4"  icon="/assets/img/cholesterolsIcon.png"/>
    </Overlay>
</div>
    
</template>
<script setup>
import NutrientData from '../../classes/nutrientData.js'

defineOptions({
  name: "NutrientWidgetDelta",
});

const props = defineProps({
    nutrientData: {
		type: NutrientData,
		default: new NutrientData(1400,1500,1200,1000,50,600)
	},
    mealNutrientData: {
		type: NutrientData,
		default: new NutrientData(500,100,200,200,10,400)
	},
});

const netNutrientData = computed({
    get() {
        return props.nutrientData.subtract(props.mealNutrientData)
    }
})
</script>