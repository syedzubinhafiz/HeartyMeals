<template>
  <div class="flex items-center justify-center h-screen">
    <div class="relative text-center w-64">
      <div class="relative z-10 flex flex-col space-y-5 items-center translate-y-12">
        <P>{{ label }}</P>
        <P>{{ formatFluidDisplay() }}</P>
        <button @click="openOverlay" class="mt-4 bg-[#FFA17A] text-[#993300] py-2 px-3 rounded-xl text-sm flex justify-center items-center">
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
          <input type="number" v-model="waterConsumed" min="0" step="0.01" placeholder="Enter amount"/>
          <SingleSelectionDropdown
          :items= "measuring_units_dropdown_option"
          defaultText="ml"
          buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
          dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-y:scroll; height:100px;"
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
    default: "Water Intake Today",
  },
  maxValue: {
    type: Number,
    default: 2000,
  },
  icon: {
    type: String,
    default: ""
  }
});

// Dropdown options for measuring units
const measuring_units_dropdown_option = ref([
  { label: 'Milliliters (mL)', value: 'ml' },
  { label: 'Liters (L)', value: 'l' },
  { label: 'Cups', value: 'cup' },
  { label: 'Fluid Ounces (fl oz)', value: 'fl oz' }
]);

// User-friendly display formatting
const formatFluidDisplay = () => {
  const consumed = Math.max(maxValue.value - remainingAmount.value, 0)
  const remaining = Math.max(remainingAmount.value, 0)
  const goal = maxValue.value
  
  if (remaining <= 0) {
    return `${consumed}/${goal} mL - Goal Achieved! 🎉`
  }
  return `${consumed}/${goal} mL (${remaining} remaining)`
}

const bgFile = computed(() => {
  const consumed = Math.max(maxValue.value - remainingAmount.value, 0)
  const percentage = Math.round(Math.min(1, Math.max(consumed / props.maxValue, 0)) * 10);
  return `water${percentage}.png`;
});

const showOverlay = ref(false);
const intakeAmount = ref(0);
const intakeUnit = ref("mL");
const waterConsumed = ref(0);
const maxValue = ref(props.maxValue)
const popupRef = ref(null)
const selectedUnit = ref('ml')
const consumedAmount = ref(0)
const remainingAmount = ref(props.maxValue)

const openOverlay = () => {
  window.addEventListener('click', handleOutsideClick);
  setTimeout(()=>{showOverlay.value = true;},300) 
}

const handleOutsideClick = (event) => {
  if (popupRef.value && !popupRef.value.contains(event.target) && showOverlay.value) {
    setTimeout(()=>{
      showOverlay.value = false;
      window.removeEventListener('click', handleOutsideClick);
    },300)
  }
};

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});

onMounted(async () => {
  await useApi("/dietary","GET")
  await fetchFluidLogging();  // Fetch data when component mounts
});

async function fetchFluidLogging() {
  try {
    let currentDate = new Date();
    currentDate = useDate().getFormattedDateShort();
    const response = await useApi(`/fluid-logging/get?dateTime=${currentDate}&timeZone=Asia/Kuala_Lumpur`, "GET");
    console.log('Fluid logging response:', response)
    
    if (response.value && typeof response.value.remaining_fluid === 'number') {
      remainingAmount.value = Math.max(response.value.remaining_fluid, 0)
      consumedAmount.value = Math.max(maxValue.value - remainingAmount.value, 0)
    } else {
      // Default to no consumption if data is invalid
      remainingAmount.value = maxValue.value
      consumedAmount.value = 0
      console.warn('Invalid fluid logging data received:', response.value)
    }

  } catch (error) {
    console.error('Error fetching fluid logging data:', error);
    // Default to no consumption on error
    remainingAmount.value = maxValue.value
    consumedAmount.value = 0
  }
}

// Update selected unit when user changes dropdown
function updateSelectedUnit(unit) {
  selectedUnit.value = unit.value;
}

async function logIntake() {
  if (!waterConsumed.value || waterConsumed.value <= 0) {
    useToast().error("Please enter a valid amount");
    return;
  }

  console.log(`Consumed ${waterConsumed.value} ${selectedUnit.value}`);
  
  let currentDate = new Date();
  currentDate = useDate().getFormattedDateShort()
  showOverlay.value = false;

  try {
    const result = await useApi("/fluid-logging/update","POST",{
      "loggingDateTime": currentDate,
      "timeZone": "Asia/Kuala_Lumpur", 
      "waterIntake": waterConsumed.value,
      "fluidUnit": selectedUnit.value
    });
    
    console.log('Log intake result:', result);
    
    if(result.isError) {
      useToast().error("Fluid logging failed!")
    } else {
      useToast().success("Water intake logged successfully!")
      waterConsumed.value = 0; // Reset input
      await fetchFluidLogging() // Refresh data
    }
  } catch (error) {
    console.error('Error logging fluid intake:', error);
    useToast().error("Failed to log water intake");
  }
}

function closeOverlay() {
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
