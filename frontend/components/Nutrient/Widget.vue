<template>
    <div class="items-center flex flex-col">
      <div class="rounded-t-full bg-custom-overlay-brown p-4 h-fit w-fit translate-y-20 shadow-md">
          <AngleBar label="Calories" :value="1400" :maxValue="2100" barColor="#B8B396" uncoveredBarColor="#E6E4D8" bgColor="bg-custom-overlay-brown" :componentSize="150" />
      </div>

    <Overlay level="1" class="p-5 space-y-4 z-10 rounded-xl shadow-xl">
        <H3 class="mx-10">Today's Nutrient Budget</H3>
        <NutrientBar label="Carbohydrates" :value="1500" :maxValue="2000" icon="/assets/img/carbIcon.png"/>
        <NutrientBar label="Protein" :value="1200" :maxValue="2000" icon="/assets/img/proteinIcon.png"/>
        <NutrientBar label="Fats" :value="1000" :maxValue="2000" icon="/assets/img/fatsIcon.png"/>
        <NutrientBar label="Sodium" :value="50" :maxValue="2000" icon="/assets/img/sodiumIcon.png"/>
        <NutrientBar label="Cholesterols" :value="200" :maxValue="2000" icon="/assets/img/cholesterolsIcon.png"/>
    </Overlay>
</div>
    
</template>
<script setup>
import AngleBar from './AngleBar.vue';

defineOptions({
  name: "NutrientWidget",
});
</script>