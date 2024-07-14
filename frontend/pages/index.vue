<template>
    <div class="flex items-center justify-center h-96">
        <div class="shadow-sm bg-custom-overlay-brown h-40 w-64 rounded-lg flex flex-col items-center justify-center space-y-2">
            <p class="font-medium text-md">Nuxt JS Guide</p>
            <button class="rounded-sm shadow-sm bg-custom-button-green py-1 px-2 text-white hover:bg-custom-button-green" @click.prevent="onClickButton">Button</button>
        </div>
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
	layout: "baselayout",
    middleware: "login-check",
});

const onClickButton = async () => {
    navigateTo("/vueExample");
}
console.log(useUserInfo().getUserInfo().email)

</script>