<template>
    <div class="flex flex-col">
        <div class="flex flex-row justify-between space-x-3">
            <div class="flex flex-row">
                <img :src="icon" alt="icon" class="w-5 h-5 mr-2"/>
                <P>{{label}}</P>
            </div>
            <P :style="{color: color}">{{roundedValue?.toFixed(2) || 0}}/{{roundedMaxValue?.toFixed(2) || 0}}{{unit}}</P>
        </div>
        <div class="rounded-md h-2 w-full shadow-md" :style="`background-color: ${bgColor}`">
            <div class="rounded-md h-2 shadow-sm" :style="`background-color: ${color};width: ${Math.max(0, Math.min(100, (props.value && props.maxValue) ? (props.value / props.maxValue * 100) : 0))}%`"/>
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
    color: {
		type: String,
		default: "#000000",
	},
    bgColor: {
		type: String,
		default: "#AAAAAA",
	},
    unit: {
		type: String,
		default: "g",
	},
})

// one decimal point
const formattedValue = computed(() => {
    return props.value != null ? props.value.toFixed(1) : '0';
});

const formattedMaxValue = computed(() => {
    return props.maxValue != null ? props.maxValue.toFixed(1) : '0';
});

// whole number
const roundedValue = computed(() => {
    return props.value != null ? Math.round(props.value) : 0;
});

const roundedMaxValue = computed(() => {
    return props.maxValue != null ? Math.round(props.maxValue) : 0;
});
</script>