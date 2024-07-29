<template>
    <div v-for="option in options">
        <input class="border w-min bg-transparent border-gray-500 " v-model="inputValue" type="radio" :id="option" :name="name" :value="option"></input>
        <label :for="option" class="px-1">{{ option }}</label><br>
    </div>
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
    name: {
		type: String,
		default: "name",
	},
    options: {
		type: Array,
		default: ["1","2","3"],
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