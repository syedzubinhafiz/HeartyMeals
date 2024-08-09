<template>
    <button class="px-2 py-1 rounded-lg shadow-sm  w-fit bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "Button",
});

// buttons use @click.prevent for onclick stuff
</script>