<template>
    <input class="border w-min" v-model="inputValue" :type="type" :placeholder="placeholder"></input>
</template>
<script setup>
defineOptions({
	name: "Input",
});

// defineProps defines the variables that can be passed into the component
const props = defineProps({
    modelValue: {
        default: ""
    },
	type: {
		type: String,
		default: "",
	},
    placeholder: {
		type: String,
		default: "insert text here",
	},
});

// defineEmits defines a list of functions that can run from the component
// for example update:modelValue updates the variable outside the component whenever the internal value of inputValue changes
const emits = defineEmits(["update:modelValue"]);

// computed variable based on the props passed into the component. Has a get and set function
const inputValue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emits("update:modelValue", value);
	},
});
</script>