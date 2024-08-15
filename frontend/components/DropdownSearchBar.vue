<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <div class="m-0 p-0 space-x-2 border-gray-500 border w-fit" @click="() => {isFocused = true}">
        <Input type="text" class="border-none outline-none" readonly="readonly" v-model="selectedValue" placeholder="Select" @blur="() => {setFocusWithDelay(false)}"/>
        <i class="bi bi-chevron-down mr-2"></i>
        <div class="absolute z-50 p-2 bg-custom-overlay-light rounded-sm shadow-sm" v-if="isFocused">
            <i class="bi bi-search mr-2"></i>
            <Input type="text" class="border-none outline-none" v-model="inputValue" placeholder="Search..." @click="() => {searchSelected = true}" @blur="() => {searchSelected = false; setFocusWithDelay(false)}"/>
            <div v-for="item in filterData()" :key="getID(item)">
                <button :onClick="()=>setValue(item)">{{ getName(item) }}</button>
            </div>
            <div v-if="selectedValue && filterData().length==0">
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

const selectedValue = computed({
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
    searchSelected.value = false
    setFocusWithDelay(false)
}

// filter based on search term
 function filterData() {
   return props.dataList.filter((item) => {
        let search = inputValue.value.toLowerCase()
        let name = getName(item).toLowerCase()
        let splitNames = name.split(" ")
        let i = splitNames.length - 1
        let currentName = splitNames[i].toLowerCase()
        if(search.length <= currentName.length && search === currentName.slice(0, search.length)) {
            return true
        }
        i -= 1
        while(i>=0) {
            currentName += " " + splitNames[i].toLowerCase()
            if(search.length <= currentName.length && search === currentName.slice(0, search.length)) {
                return true
            }
            i -= 1
        }
        return false
        // getName(item).toLowerCase().includes(inputValue.value.toLowerCase())
   }
        
   );
 }

 const inputValue = ref("")
 // only show search terms when the search bar is selected
 const isFocused = ref(false);
const searchSelected = ref(false);
 // needed to ensure that setting the search term occurs before closing the selection window



const setFocusWithDelay = async (focused) => {
    setTimeout(()=>{
        if(searchSelected.value==false) {
            isFocused.value = focused
        }
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