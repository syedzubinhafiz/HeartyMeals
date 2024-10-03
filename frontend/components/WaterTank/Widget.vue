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
    <div v-if="showOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-[#F3EADA] p-10 rounded-xl shadow-xl w-96 h-64 flex flex-col justify-center items-center">
        <button @click="showOverlay = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-50" style="top: calc(50% - 120px); right: calc(50% - 180px);">
  &times;
</button>
        <p class="text-xl font-semibold mb-4 text-center">Enter the amount</p>
        <div class="flex items-center space-x-7">
          <input type="number" v-model="intakeAmount" class="border border-gray-300 rounded-xl shadow-xl p-2 text-center w-24" />
          <select v-model="intakeUnit" class="border border-gray-300 rounded-xl shadow-xl p-2">
            <option value="ml">ml</option>
            <option value="L">L</option>
          </select>
        </div>
        <button @click="logIntake" class="mt-4 bg-[#87A98D] text-white py-2 px-4 rounded flex items-center justify-center">
          <span>&#10003;</span>
          <p class="ml-2">Done</p>
        </button>
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
const intakeUnit = ref("ml");

function logIntake() {
  console.log(`Logged ${intakeAmount.value} ${intakeUnit.value}`);


  showOverlay.value = false;
}
</script>

<style scoped>
/* Add any additional custom styles here if necessary */
</style>
