<template>
    <div class="flex flex-col">
        <div class="flex flex-row justify-between space-x-3">
            <div class="flex flex-row">
                <img :src="icon" alt="icon" class="w-5 h-5 mr-2"/>
                <P>{{label}}</P>
            </div>
            <P :style="{color: colorAfter}">{{roundedValBefore}}/{{roundedMaxVal}}mg</P>
        </div>
        <div class="rounded-md h-2 w-full shadow-md" :style="`background-color: ${bgColor}`">
            <div class="rounded-md h-2 shadow-sm" :style="`background-color: ${colorBefore};width: ${Math.max(0, Math.min(100, (props.valueBefore && props.maxValue) ? (props.valueBefore / props.maxValue * 100) : 0))}%`">
                <div class="rounded-md h-2 shadow-sm" :style="`background-color: ${colorAfter};width: ${Math.max(0, Math.min(100, (props.valueAfter && props.valueBefore) ? (props.valueAfter / props.valueBefore * 100) : 0))}%`"/>
            </div>
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
    valueBefore: {
		type: Number,
		default: 700,
	},
    valueAfter: {
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
    colorBefore: {
		type: String,
		default: "#555555",
	},
    colorAfter: {
		type: String,
		default: "#000000",
	},
    bgColor: {
		type: String,
		default: "#AAAAAA",
	},
})

const roundedValBefore = computed(() => {
    return Math.round(props.valueBefore);
});
const roundedMaxVal = computed(() => {
    return Math.round(props.maxValue);
});

</script>