<template>
    <div class="flex flex-col">
        <div class="flex flex-row justify-between">
            <div class="flex flex-row">
                <img :src="icon" alt="icon" class="w-5 h-5 mr-2"/>
                <P>{{label}}</P>
            </div>
            <P :style="{color: getBarColor()}">{{value}}/{{maxValue}}mg</P>
        </div>
        <div class="bg-blue-200 rounded-md h-2 w-full shadow-md">
            <div class="rounded-md h-2 shadow-sm" :style="`background-color: ${getBarColor()};width: ${Math.max(0, Math.min(100, props.value / props.maxValue * 100))}%`"/>
        </div>
    </div>
    
</template>
<script setup>
defineOptions({
	name: "NutrientBar",
});

const props = defineProps({
    label: {
		type: String,
		default: "label",
	},
    value: {
		type: Number,
		default: 500,
	},
    maxValue: {
		type: Number,
		default: 2000,
	},
    icon: {
		type: String,
		default: "",
	},
})
// Function to return a distinct color based on the label
const getBarColor = () => {
    const colorMap = {
        // "Calories": "#B8B396", 
        "Carbohydrates": "#83BBBE", 
        "Protein": "#87A98D", 
        "Fats": "#ECC474", 
        "Sodium": "#EC7455", 
        "Cholesterols": "#BE9A83", 
    };
    return colorMap[props.label] || "#000000"; // Default to black if label not found
};
</script>