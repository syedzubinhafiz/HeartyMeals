<template>
    <textarea class="rounded-md bg-custom-overlay-light border border-gray-400" v-model="inputValue" :placeholder="placeholder"/>
</template>
<script setup>
 defineOptions({
	name: "TextArea",
});

const props = defineProps({
    modelValue: {
        default: ""
    },
	placeholder: {
		type: String,
		default: "insert text here",
	},
});

const emits = defineEmits(["update:modelValue"]);

const inputValue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emits("update:modelValue", value);
	},
});
</script>