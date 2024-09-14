<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <div v-if="computedSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <div class="fixed top-0 right-0 bg-custom-overlay-brown h-full shadow-md z-50 p-5 pb-16 rounded-l-lg min-w-72">
      <div class="flex justify-end w-full">
        <button @click="toggleSidebar" class="text-black">
          <i class="bi bi-x text-3xl"></i>
        </button>
      </div>
      <div class="flex flex-col items-center w-full h-full space-y-4">
        <H2>Stomach</H2>
        <hr>
        <div class="grow flex flex-col space-y-2 overflow-y-auto w-full">
          <div v-for="(mealData, i) in modelValue" :key="mealData.name">
            <StomachMealCard  v-model="modelValue[i]"/>
          </div>
        </div>
        <nuxt-link :to="{ path: '/summary', query: { mealType: mealType } }">
                  <ButtonGreen>Summary</ButtonGreen>
        </nuxt-link>
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
    default: [1,2,3,4]
  },
  isSidebarOpen: {
      type: Boolean,
      default: false
  },
  mealType: {
    type: String,
    required: true
  },
})

const emits = defineEmits(["update:isSidebarOpen"]);

const computedSidebarOpen = computed({
	get() {
		return props.isSidebarOpen;
	},
	set(value) {
		emits("update:isSidebarOpen", value);
	},
});

const toggleSidebar = () => {
  computedSidebarOpen.value = false;
};
</script>