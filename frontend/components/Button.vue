<template>
    <button class="px-2 py-1 rounded-lg shadow-sm bg-custom-button-green text-white w-fit hover:bg-custom-button-green"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "Button",
});

// buttons use @click.prevent for onclick stuff
</script>