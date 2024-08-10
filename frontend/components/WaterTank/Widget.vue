<template>
  <div class="flex items-center justify-center h-screen">
    <div class="relative text-center w-64">
      <div class="relative z-10 flex flex-col space-y-5 items-center translate-y-12">
        <P>{{ label }}</P>
        <P>{{ value }}/{{ maxValue }}ml</P>
        <button class="mt-4 bg-[#FFA17A] text-[#993300] py-2 px-3 rounded text-sm flex justify-center items-center">
          <img src="../../assets/img/Water Droplet.png" alt="Water Base" class="w-4 h-4 mr-2" />
          <p>Log Intake</p>
        </button>
      </div>
      <img :src="`/assets/img/${bgFile}`" alt="Water Base" class="absolute inset-0 w-full h-auto m-auto" />
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

const bgFile = computed({
  get() {
    console.log(`water${Math.round(props.value/props.maxValue*10)}.png`)
    return `water${Math.round(props.value/props.maxValue*10)}.png`
  }
})
</script>

<style scoped>
/* Add any additional custom styles here if necessary */
</style>
