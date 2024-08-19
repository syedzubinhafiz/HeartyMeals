<template>
    <button class="py-2 px-4 rounded-lg shadow-md w-fit bg-custom-button-orange hover:bg-custom-button-orange-dark text-custom-text-orange"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "ButtonOrange",
});

// buttons use @click.prevent for onclick stuff
</script>