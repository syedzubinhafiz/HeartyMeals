<template>
    <div class="flex items-center justify-center h-96">
        <di class="shadow-sm bg-white h-40 w-64 rounded-lg flex flex-col items-center justify-center space-y-2">
            <p class="font-medium text-md">Nuxt JS Guide</p>
            <button class="rounded-sm shadow-sm bg-blue-400 py-1 px-2 text-white hover:bg-blue-500" @click.prevent="onClickButton">Button</button>
        </di>
    </div>
</template>
<script setup>
// defines the name of the page
defineOptions({
	name: "HomePage",
});

// this defines the layout that the page uses
// the page will be wrapped around the selected layout, which are defined in the layouts folder
definePageMeta({
	layout: "baselayout"
});

const onClickButton = async () => {
    navigateTo("/vueExample");
}

</script>