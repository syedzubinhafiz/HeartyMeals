<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <div class="m-0 p-0 space-x-2 border-gray-500 border w-fit" @click="() => {isFocused = true}">
        <i class="bi bi-search ml-1"></i>
        <Input type="text" class="border-none outline-none" v-model="inputValue" placeholder="Search..." @blur="() => {setFocusWithDelay(false)}"/>
        <div class="absolute z-50 p-2 bg-custom-overlay-light rounded-sm shadow-sm" v-if="isFocused && inputValue.length>0">
            <div v-for="item in filterData()" :key="getID(item)">
                <button :onClick="()=>setValue(item)">{{ getName(item) }}</button>
            </div>
            <div v-if="inputValue && filterData().length==0">
                <p>No results found!</p>
            </div>
        </div>

    </div>

 </template>
 <script setup>
 defineOptions({
	name: "SearchBar",
});

// modelValue takes in the search term while dataList contains the list of searchable strings
 const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    },
	dataList: {
		type: Array,
		default: [],
	},
    modelValueID: {
        type: String,
        default: null
	},
});

// defineEmits defines a list of functions that can run from the component
const emits = defineEmits(["update:modelValue","update:modelValueID"]);

// computed variable based on the props passed into the component. Has a get and set function
const computedModelValue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emits("update:modelValue", value);
	},
});

const inputValue = computed({
	get() {
		return getName(computedModelValue.value);
	},
	set(value) {
        if(typeof computedModelValue.value === 'object' && computedModelValue.value !== null) {
            computedModelValue.value.name = value
            for(let data of props.dataList) {
                if(getName(data).toLowerCase()==value.toLowerCase()) {
                    computedModelValue.value.id = getID(data)
                    return
                }
            }
            computedModelValue.value.id = null
        }
        else {
            computedModelValue.value = value
        }
	},
});

// set input value to selected item
function setValue(value) {
    computedModelValue.value = value
}

// filter based on search term
 function filterData() {
   return props.dataList.filter((item) => 
        getName(item).toLowerCase().includes(inputValue.value.toLowerCase())
   );
 }

 // only show search terms when the search bar is selected
 const isFocused = ref(false);

 // needed to ensure that setting the search term occurs before closing the selection window
const setFocusWithDelay = async (focused) => {
    setTimeout(()=>{
        isFocused.value = focused
    },
    100)
}

const getName = (item) => {
    if(typeof item === 'object' && item !== null) {
        return item.name
    }
    else {
        return item
    }
}
const getID = (item) => {
    if(typeof item === 'object' && item !== null) {
        return item.id
    }
    else {
        return item
    }
}
 </script>