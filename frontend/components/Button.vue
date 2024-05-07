<template>
    <button class="px-2 py-1 rounded-sm shadow-sm bg-blue-400 text-white w-fit hover:bg-blue-500"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "Button",
});

// buttons use @click.prevent for onclick stuff
</script>