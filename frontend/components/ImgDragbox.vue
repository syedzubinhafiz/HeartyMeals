<template>
    <div
      class="w-full max-w-sm"
      @dragover.prevent
      @dragenter.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <label
        for="file-upload"
        class="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
        :class="{ 'border-custom-bg-lightgreen': dragOver }"
      >
        <input
          id="file-upload"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleFileChange"
        />
        <div v-if="!image">
          <p class="mb-2 text-sm text-gray-500">Drag & drop an image here</p>
          <p class="text-xs text-gray-500">or click to select an image</p>
        </div>
        <img v-else :src="image" alt="Selected image" class="object-cover w-full h-full rounded-lg"/>
      </label>
    </div>
  </template>
  
<script setup>

defineOptions({
name: 'ImgDragbox',
});
const dragOver = ref(false);

const props = defineProps({
    modelValue: {
        default: null
    }
})


const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleDrop = (event) => {
dragOver.value = false;
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
const emits = defineEmits(["update:modelValue"]);


const image = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emits("update:modelValue", value);
	},
});
</script>