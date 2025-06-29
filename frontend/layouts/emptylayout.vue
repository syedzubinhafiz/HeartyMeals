<!-- layout that defines the base structure for most of the pages on the website -->

<template>
	<!-- the background color of the page is defined here -->
	<div class="bg-custom-bg-brown">
		<slot />
	</div>
</template>
<script setup>

defineOptions({
	name: "emptylayout",
});
</script>