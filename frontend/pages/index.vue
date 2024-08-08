<template>
    <div class="relative">
        <div class="w-full h-96 relative bg-custom-bg-green bg-heart-image">
            <div class="absolute inset-x-0 bottom-0 overflow-hidden text-custom-bg-brown">
                <svg class="w-full h-48" viewBox="0 0 1440 250" xmlns="http://www.w3.org/2000/svg" >
                    <path fill="currentColor" d="M-300,0 Q720,520 1940,0 L1940,320 L-400,320 Z"></path>
                </svg>
            </div>
        </div>

        <!-- Content in the center of the green section -->
        <div class="absolute top-0 w-full h-96 flex flex-col items-center justify-center text-white">
            <h1 class="text-4xl mb-4">Welcome back, Bruno Mars</h1>
            <p class="text-lg mb-6">What do you want to do today?</p>
            <div class="flex space-x-5">
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/recipe-icon.png" alt="Recipe Library" class="w-6 h-6 mr-2" /> Recipe Library
                </button>
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/logging-icon.png" alt="Meal Logging" class="w-6 h-6 mr-2" /> Meal Logging
                </button>
                <button class="rounded-lg shadow-lg bg-custom-button-orange py-2 px-4 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text">
                    <img src="/assets/img/planning-icon.png" alt="Meal Planning" class="w-6 h-6 mr-2" /> Meal Planning
                </button>
            </div>
        </div>
    </div>

    <div class="flex items-center justify-center py-9 bg-custom-overlay-brown">
        <p class="text-center text-lg font-semibold italic text-custom-text-orange">
            Every day may not be good, but there's something good in every day. Focus on the good, no matter how small.
        </p>
    </div>
    
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

/* Custom button text color */
.text-custom-button-text {
    color: #993300;
}

/* Other styles */
.bg-custom-bg-green {
    background-color: #015B59;
}

/* Smaller background image */
.bg-heart-image {
    background-image: url('@/assets/img/HeartGreen.png');
    background-size: 50%; /* Adjust this value to make the background image smaller or larger */
    background-repeat: no-repeat;
    background-position: center;
}

.bg-custom-button-orange {
    background-color: #FFA17A;
}

.hover\:bg-custom-button-orange-dark:hover {
    background-color: #e5946b; /* A slightly darker shade */
}

.text-custom-text-orange {
    color: #000000;
}

.bg-custom-overlay-brown {
    background-color: #DAC2A8;
}
</style>
