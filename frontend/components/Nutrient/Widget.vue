<template>
    <div class="items-center flex flex-col">
      <div class="rounded-t-full bg-custom-overlay-brown p-4 h-fit w-fit translate-y-20 shadow-md">
          <AngleBar label="Calories" :value="nutrientData?.calories" :maxValue="2100" barColor="#B8B396" uncoveredBarColor="#E6E4D8" bgColor="bg-custom-overlay-brown" :componentSize="150" />
      </div>

    <Overlay level="1" class="p-5 space-y-4 z-10 rounded-xl shadow-xl">
        <H3 class="mx-10">Today's Nutrient Budget</H3>
        <NutrientBar label="Carbohydrates" :value="nutrientData?.carbohydrtates" :maxValue="2000" color="#83BBBE" bgColor="#E2F3F4" icon="/assets/img/carbIcon.png"/>
        <NutrientBar label="Protein" :value="nutrientData?.protein" :maxValue="2000" color="#87A98D" bgColor="#E8F0E9" icon="/assets/img/proteinIcon.png"/>
        <NutrientBar label="Fats" :value="nutrientData?.fats" :maxValue="2000" color="#ECC474" bgColor="#FBF1CD" icon="/assets/img/fatsIcon.png"/>
        <NutrientBar label="Sodium" :value="nutrientData?.sodium" :maxValue="2000" color="#EC7455" bgColor="#F9E1DA" icon="/assets/img/sodiumIcon.png"/>
        <NutrientBar label="Cholesterols" :value="nutrientData?.cholesterol" :maxValue="2000" color="#BE9A83" bgColor="#FFE5D4" icon="/assets/img/cholesterolsIcon.png"/>
    </Overlay>
</div>
    
</template>
<script setup>
import AngleBar from './AngleBar.vue';
import NutrientData from '../../classes/nutrientData.js'
defineOptions({
  name: "NutrientWidget",
});

const props = defineProps({
    nutrientData: {
		type: NutrientData,
		default: new NutrientData(1400,1500,1200,1000,50,200)
	},
});
</script>