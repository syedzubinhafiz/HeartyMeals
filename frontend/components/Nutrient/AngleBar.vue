<template>
    <div class="flex flex-col">
        <div class="relative overflow-hidden" :style="`width: ${componentSize}px; height: ${componentSize}px; border-radius: 50%;`">
            <div class="w-full h-full" :style="`border-radius: 50%; background: conic-gradient( from -45deg, ${barColor} 0deg ${angle}deg, ${uncoveredBarColor} ${angle}deg 180deg, transparent 180deg 360deg); transform: rotate(-45deg);`">
			</div>
            <div :class="'absolute flex flex-col items-center '+bgColor" :style="`top: 50%; left: 50%; padding-top: 10%; width: ${componentSize*0.8}px; height: ${componentSize*0.8}px; border-radius: 50%; transform: translate(-50%, -50%);`">
                <P>{{label}}</P>
                <P>{{Math.round(props.value || 0)}}/{{Math.round(props.maxValue || 0)}}cal</P>
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
    value: {
		type: Number,
		default: 2000,
	},
    maxValue: {
		type: Number,
		default: 2000,
	},
    barColor: {
		type: String,
		default: "#FF0000",
	},
    uncoveredBarColor: {
		type: String,
		default: "#FFBBBB",
	},
    bgColor: {
		type: String,
		default: "bg-white",
	},
    componentSize: {
		type: Number,
		default: 200,
	},
	unit: {
		type: String,
		default: "g",
	},
})

const angle = computed({
	get() {
		if (!props.value || !props.maxValue) return 0;
		return props.value/props.maxValue * 180
	},
});

</script>

<style scoped>
p{
	font-size: 75%;
	font-weight: 600;
}
</style>