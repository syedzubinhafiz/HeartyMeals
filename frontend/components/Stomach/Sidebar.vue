<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <div v-if="computedSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <div class="fixed top-0 right-0 w-96 bg-custom-overlay-brown h-full shadow-md z-50 p-5 pb-16 rounded-l-lg">
      <div class="flex justify-end w-full">
        <button @click="toggleSidebar" class="text-black">
          <i class="bi bi-x text-3xl"></i>
        </button>
      </div>
      <div class="flex flex-col items-center w-full h-full space-y-4">
        <H2>Stomach</H2>
        <hr>
        <div class="grow flex flex-col space-y-2 overflow-y-auto w-full">
          <P>meal 1</P>
          <P>meal 2</P>
          <P>meal 3</P>
        </div>
        <ButtonGreen>Summary</ButtonGreen>
      </div>
      

    </div>
  </div>
</template>
<script setup>
defineOptions({
  name: 'StomachSidebar',
});



const props = defineProps({
  modelValue: {
      type: Boolean,
      default: false
  },
})

const emits = defineEmits(["update:modelValue"]);

const computedSidebarOpen = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emits("update:modelValue", value);
	},
});

const toggleSidebar = () => {
  computedSidebarOpen.value = false;
};
</script>