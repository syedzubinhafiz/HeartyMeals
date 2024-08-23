<template>
    <div class="items-center flex flex-col">
    <Overlay level="1" class="p-5 space-y-4 z-10 rounded-xl shadow-xl">
        <H3 class="mx-10">Total Nutrition</H3>
        <NutrientBarDelta label="Calories" :valueBefore="1800" :valueAfter="1500" :maxValue="2000" colorBefore="#D7D1B4" colorAfter="#B8B396" icon="/assets/img/caloriesIcon.png"/>
        <NutrientBarDelta label="Carbohydrates" :valueBefore="1500" :valueAfter="1400" :maxValue="2000" colorBefore="#A2D3D6" colorAfter="#83BBBE"  icon="/assets/img/carbIcon.png"/>
        <NutrientBarDelta label="Protein" :valueBefore="1200" :valueAfter="1000" :maxValue="2000" colorBefore="#99D0A3" colorAfter="#87A98D"  icon="/assets/img/proteinIcon.png"/>
        <NutrientBarDelta label="Fats" :valueBefore="1000" :valueAfter="800" :maxValue="2000" colorBefore="#FCDEA3" colorAfter="#ECC474"  icon="/assets/img/fatsIcon.png"/>
        <NutrientBarDelta label="Sodium" :valueBefore="50" :valueAfter="40" :maxValue="100" colorBefore="#F6AA97" colorAfter="#EC7455"  icon="/assets/img/sodiumIcon.png"/>
        <NutrientBarDelta label="Cholesterols" :valueBefore="800" :valueAfter="400" :maxValue="2000" colorBefore="#F1C9AF" colorAfter="#BE9A83"  icon="/assets/img/cholesterolsIcon.png"/>
    </Overlay>
</div>
    
</template>
<script setup>

defineOptions({
  name: "NutrientWidgetDelta",
});
</script>