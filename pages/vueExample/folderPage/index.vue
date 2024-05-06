<template>
    <div class="flex flex-col items-center justify-center p-5 space-y-5">
        <div class="flex flex-col space-y-2 bg-white shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Folder page</h1>
            <hr>
            <NuxtLink to="/vueExample" class="px-2 py-1 rounded-sm shadow-sm bg-blue-400 text-white w-min hover:bg-blue-500">Back</NuxtLink>
        </div>

    </div>

</template>
<script setup>
defineOptions({
	name: "folderPage",
});


definePageMeta({
	layout: "baselayout"
});



</script>