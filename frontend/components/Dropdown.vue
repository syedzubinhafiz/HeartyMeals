<template>
	<div class="space-x-2">
		<label v-if="name!=''" :for="name">{{ name }}</label>
		<select :id="name" v-model="inputValue">
			<option v-for="optionIndex in Array(options.length).keys()" :value="computedOptionValues[optionIndex]">{{ options[optionIndex] }}</option>
		</select>
	</div>

</template>
<script setup>
defineOptions({
	name: "Dropdown",
});

// defineProps defines the variables that can be passed into the component
const props = defineProps({
    modelValue: {
        default: ""
    },
    name: {
		type: String,
		default: "",
	},
    options: {
		type: Array,
		default: ["1","2","3"],
	},
	optionValues: {
		type: Array,
		default: null,
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

const computedOptionValues = computed({
	get() {
		if(props.optionValues!=null) {
			return props.optionValues
		}
		else {
			return props.options
		}
	},
});
</script>