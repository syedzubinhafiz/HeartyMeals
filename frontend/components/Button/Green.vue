<template>
    <button class="py-2 px-4 rounded-lg shadow-md bg-custom-button-green text-white w-fit hover:bg-custom-button-green"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "ButtonGreen",
});

// buttons use @click.prevent for onclick stuff
</script>