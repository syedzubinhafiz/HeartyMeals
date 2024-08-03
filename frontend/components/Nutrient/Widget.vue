<template>
    <Overlay level="1" class="p-5 space-y-4">
        <H3 class="mx-5">Today's Nutrient Budget</H3>
        <NutrientBar label="Calories" :value="1200" :maxValue="2000"/>
        <NutrientBar label="Carbohydrates" :value="1500" :maxValue="2000"/>
        <NutrientBar label="Protein" :value="1200" :maxValue="2000"/>
        <NutrientBar label="Fats" :value="1000" :maxValue="2000"/>
        <NutrientBar label="Sodium" :value="50" :maxValue="2000"/>
        <NutrientBar label="Cholesterols" :value="200" :maxValue="2000"/>
    </Overlay>
    
</template>
<script setup>
defineOptions({
	name: "NutrientWidget",
});

</script>