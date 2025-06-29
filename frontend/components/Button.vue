<template>
    <button class="px-2 py-1 rounded-lg shadow-sm bg-custom-button-green text-white w-fit hover:bg-custom-button-green" @click="handleClick"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "Button",
});

const emit = defineEmits(['click']);

function handleClick(event) {
  emit('click', event);
}

// buttons use @click.prevent for onclick stuff
</script>