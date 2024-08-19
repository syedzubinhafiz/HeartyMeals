<template>
    <button class="px-2 py-1 w-fit bg-transparent hover:bg-transparent text-custom-text-orange"><slot/></button>
</template>
<script setup>
defineOptions({
	name: "Button",
});
</script>