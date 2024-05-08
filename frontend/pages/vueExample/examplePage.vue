<template>
    <div class="flex flex-col items-center justify-center p-5 space-y-5">
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Example page</h1>
            <hr>
            <NuxtLink to="/vueExample" class="px-2 py-1 rounded-sm shadow-sm bg-custom-button-green text-white w-min hover:bg-custom-button-green">Back</NuxtLink>
        </div>

    </div>

</template>
<script setup>
defineOptions({
	name: "examplePage",
});


definePageMeta({
	layout: "baselayout"
});



</script>