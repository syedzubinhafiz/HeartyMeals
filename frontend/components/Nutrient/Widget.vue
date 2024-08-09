<template>
    <Overlay level="1" class="p-5 space-y-4">
        <AngleBar
        label="Calories"
        :value="1400"
        :maxValue="2100"
        barColor="#B8B396"
        uncoveredBarColor="#E6E4D8"
        bgColor="bg-white"
        :componentSize="100"
      />
        <H3 class="mx-5">Today's Nutrient Budget</H3>
        <!-- <NutrientBar label="Calories" :value="1200" :maxValue="2000"/> -->
        <NutrientBar label="Carbohydrates" :value="1500" :maxValue="2000"icon="assets/img/carbIcon.png"/>
        <NutrientBar label="Protein" :value="1200" :maxValue="2000"/>
        <NutrientBar label="Fats" :value="1000" :maxValue="2000"/>
        <NutrientBar label="Sodium" :value="50" :maxValue="2000"/>
        <NutrientBar label="Cholesterols" :value="200" :maxValue="2000"/>
    </Overlay>
    
</template>
<script setup>
import AngleBar from './AngleBar.vue';

defineOptions({
  name: "NutrientWidget",
});
</script>