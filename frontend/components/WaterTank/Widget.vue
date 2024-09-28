<template>
  <div class="flex items-center justify-center h-screen">
    <div class="relative text-center w-64">
      <div class="relative z-10 flex flex-col space-y-5 items-center translate-y-12">
        <P>{{ label }}</P>
        <P>{{ value }}/{{ maxValue }}ml</P>
        <button @click="showOverlay = true" class="mt-4 bg-[#FFA17A] text-[#993300] py-2 px-3 rounded-xl text-sm flex justify-center items-center">
          <img src="../../assets/img/Water Droplet.png" alt="Water Base" class="w-4 h-4 mr-2" />
          <p>Log Intake</p>
        </button>
      </div>
      <img :src="`/assets/img/${bgFile}`" alt="Water Base" class="absolute inset-0 w-full h-auto m-auto" />
    </div>

    <!-- Overlay -->
    <div v-if="showOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" @click="closeOverlay">
      <div class="bg-[#F3EADA] p-10 rounded-xl shadow-xl w-96 h-64 justify-center items-center">
        <button @click="showOverlay = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-50" style="top: calc(50% - 120px); right: calc(50% - 180px);">
          &times;
        </button>
        <div class="overlay-container">

          <p class="text-xl font-semibold mb-4 text-center" style="grid-column: span 2;">Enter the amount</p>
          <input type="number" v-model="intakeAmount" min="0" step="0.01"/>
          <SingleSelectionDropdown
          :items= "measuring_units_dropdown_option"
          defaultText="unit"
          buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
          dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-x:auto; height:200px;"
          @item-selected="updateSelectedUnit($event)"
        
          />
          <div style="grid-column: span 2; display: flex; justify-content: center;">
            <button @click="logIntake" class="mt-4 bg-[#87A98D] text-white py-2 px-4 rounded flex items-center justify-center">
              <span>&#10003;</span>
              <p class="ml-2">Done</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleSelectionDropdown from '../Dropdown/SingleSelectionDropdown.vue';

defineOptions({
  name: "NutrientBar",
});

const props = defineProps({
  label: {
    type: String,
    default: "Remaining Water Intake",
  },
  value: {
    type: Number,
    default: 1500,
  },
  maxValue: {
    type: Number,
    default: 2000,
  },
  icon:{
    type: String,
    default:""
  }
});

const bgFile = computed(() => {
  return `water${Math.round(props.value/props.maxValue*10)}.png`;
});

const showOverlay = ref(false);
const intakeAmount = ref(0);
const intakeUnit = ref(null);

const measuring_units_dropdown_option = [
  { id: "ml", display: "ml" },
  { id: "l", display: "l" },
  { id: "fl oz", display: "fl oz" },
  { id: "cup", display: "cup" },
  { id: "pint", display: "pint" },
  { id: "quat", display: "quart" },
  { id: "gallon", display: "gallon" },
];

const updateSelectedUnit = (unit) => {
  intakeUnit.value = unit.id;
};

async function logIntake() {
  // const response = await $axios.post('/fluid-logging/update', {
  //   amount: intakeAmount.value,
  //   unit: intakeUnit.value,
  // });
  console.log(`Logged ${intakeAmount.value} ${intakeUnit.value}`);
  showOverlay.value = false;
}

function closeOverlay() {
  showOverlay.value = false;
}
</script>

<style scoped>
/* Add any additional custom styles here if necessary */

.overlay-container{
  padding: 5% 15%;
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 10%;
}

.overlay-container input{
  width: 100%;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #8B8585;
  border-radius: 5px;
}
</style>
