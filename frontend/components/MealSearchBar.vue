<template>
    <div>
      <div :class="searchBarClass" @click="() => {isFocused = true}">

      <span class="search-icon">
      <img src="/assets/img/SearchIcon.svg" alt="Search Icon" />
      </span>
      <input type="text" placeholder="Enter Keywords" v-model="inputValue" :class="inputClass" @blur="() => {setFocusWithDelay(false)}"/>

      </div>
      <div class="absolute z-50 p-2 bg-custom-overlay-light rounded-xl shadow-sm" :style="`width: ${searchWidth}`" v-if="isFocused && inputValue.length>0">
          <div v-for="item in filterData()" :key="getID(item)" class="flex space-x-2 items-center border border-gray-500">
              <img src="/assets/img/potato.svg" alt="Meal Image" class="w-12 h-12 border border-gray-500" />

              <button :onClick="()=>setValue(item)" class="h-full w-full flex justify-start">{{ getName(item) }}</button>
          </div>
          <div v-if="inputValue && filterData().length==0">
              <p>No results found!</p>
          </div>
      </div>
    </div>
  </template>
  <script setup>
  defineOptions({
	name: "MealSearchBar",
});

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
  rounded: {
    type: Boolean,
    default: true,
  },
  searchWidth: {
    type: String,
    default: '800px', // Adjust this value to make the search bar longer
  }
})

const searchBarClass = computed({
  get() {
    return {
      'search-bar': true,
      'rounded-full': props.rounded, // Change the shape by toggling the 'rounded' prop
    };
  }
})

const inputClass = computed({
  get() {
    return 'search-input'; 
  }
})

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
    300)
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

  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    background-color: #f9f5e7; /* Light background color */
    padding: 10px 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    width: var(--searchWidth); /* Use a CSS variable for the width */
    width: 800px; /* Set the width directly or adjust with the prop */
  }
  
  .rounded-full {
    border-radius: 30px; /* Full rounded corners */
  }
  
  .search-input {
    border: none;
    background-color: transparent;
    outline: none;
    width: 100%;
    font-size: 16px;
    margin-left:25px;
    color: #6b7280; /* Gray text color */
  }
  
  .search-icon {
  position: absolute;
  margin-left: -5px; /* Move icon inside the input */
  color: #6b7280; /* Icon color */
  display: flex;
  align-items: center;
  pointer-events: none; /* Prevent clicking on the icon */
}

.search-icon img {
  width: 24px; /* Adjust size to be smaller */
  height: 24px; /* Adjust size to be smaller */
}
  </style>
  