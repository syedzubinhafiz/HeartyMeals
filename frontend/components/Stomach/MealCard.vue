<template>
    <div level="2" class="flex flex-row items-center p-2 space-x-4">
        <!-- <div class="w-16 h-16"/> -->
         <img src="../../public/assets/img/croissant.svg" class="h-24 w-24 rounded-lg shadow-md"/>
         <div class="flex flex-col grow">
            <H3>meal name</H3>
            <P>Serving Size:</P>
            <p class="text-xs">Calories: Protein:</p>
            <p class="text-xs">Fat: Fibre: Sodium:</p>
            <p class="text-xs">Cholesterol:</p>
         </div>
         <div class="flex flex-row ml-5 space-x-2">
            <P>servings:</P>
            <Dropdown :options="[0.25,0.5,0.75,1,2,3,4]" v-model="servings"/>
         </div>
    </div>
</template>
<script setup>
defineOptions({
  name: 'StomachMeal',
});

const servings = ref(1)
</script>