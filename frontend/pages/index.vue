<template>
    <div class="flex items-center justify-center">
        <RecipeOfTheDay recipeName="burger"/>
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