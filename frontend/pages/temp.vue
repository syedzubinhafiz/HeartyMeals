<template>
    <div class="absolute w-screen z-40">
        <Header/>
    </div>
    <div ref="scrollContainer" class="scrollContainer relative">
        <!-- section 1 -->
        <div class="section relative h-screen">
            <!-- <div class="h-96 absolute top-0 left-0 w-screen bg-custom-bg-green"/> -->
            <!-- <div class="w-full h-96 relative bg-custom-bg-green bg-heart-image">
                <div class="absolute inset-x-0 bottom-0 overflow-hidden text-custom-bg-brown">
                    <svg class="w-full h-48" viewBox="0 0 1440 250" xmlns="http://www.w3.org/2000/svg" >
                        <path fill="currentColor" d="M-300,0 Q720,520 1940,0 L1940,320 L-400,320 Z"></path>
                    </svg>
                </div>
            </div> -->

            <!-- Content in the center of the green section -->
            <div class="relative">
    <div class="w-full h-96 relative bg-header-image flex flex-col items-center justify-start text-white" style="padding-top: 400px;">
        <h1 class="text-7xl mb-6 font-semibold">Welcome back, Bruno Mars</h1>
        <p class="text-3xl mb-10">What do you want to do today?</p>
        <div class="flex space-x-12">
            <!-- Button 1 -->
            <button class="rounded-lg shadow-lg bg-custom-button-orange py-4 px-8 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text text-2xl font-bold uppercase">
                <img src="/assets/img/recipe-icon.png" alt="Recipe Library" class="w-8 h-8 mr-4" /> Recipe Library
            </button>
            <!-- Button 2 -->
            <button class="rounded-lg shadow-lg bg-custom-button-orange py-4 px-8 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text text-2xl font-bold uppercase">
                <img src="/assets/img/logging-icon.png" alt="Meal Logging" class="w-8 h-8 mr-4" /> Meal Logging
            </button>
            <!-- Button 3 -->
            <button class="rounded-lg shadow-lg bg-custom-button-orange py-4 px-8 hover:bg-custom-button-orange-dark flex items-center text-custom-button-text text-2xl font-bold uppercase">
                <img src="/assets/img/planning-icon.png" alt="Meal Planning" class="w-8 h-8 mr-4" /> Meal Planning
            </button>
        </div>
    </div>
    <div class="flex items-center justify-center py-0">
        <p class="text-center text-lg font-semibold italic text-custom-text-orange">
            Every day may not be good, but there's something good in every day. Focus on the good, no matter how small.
        </p>
    </div>
</div>
</div>

        <!-- section 2 -->
        <div class="section flex items-center justify-center h-screen">
            <!-- <div class="shadow-sm bg-custom-overlay-brown h-40 w-64 rounded-lg flex flex-col items-center justify-center space-y-2">
                <p class="font-medium text-md">Nuxt JS Guide</p>
                <button class="rounded-sm shadow-sm bg-custom-button-green py-1 px-2 text-white hover:bg-custom-button-green" @click.prevent="onClickButton">Button</button>
            </div> -->
            <div class="flex-1 h-25">
            <WaterTankWidget/>
            </div>
            <div class="flex-1 h-31">
            <NutrientWidget />
            </div>
        </div>

        <!-- section 3 -->
        <div class="section relative z-10 text-center py-16 h-screen flex flex-col justify-center items-center">
            <img :src="backgroundImage" alt="Background" class="absolute w-full z-0" style="height: 80%">
             <div class="w-full mx-auto relative z-20 px-4 flex flex-col justify-center items-center" style="height: 70%;">
                <h2 class="text-white text-xl font-semibold mb-8 mt-5">Recommended For You</h2>
                <div class="flex justify-between min-w-max pb-4">
                    <div/>
                    <MealCard v-for="(card, index) in cardData" :key="index" :cardInfo="card" />
                    <div/>
                </div>
            </div>
        </div>

        <!-- section 4 -->
        <div class="section h-screen flex flex-col justify-end">
            <div class="flex flex-col items-center justify-center h-full">
                <RecipeOfTheDay recipeName="Nasi Ayam"/>
            </div>
            <Footer/>
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
    layout: "emptylayout",
    // middleware: "login-check",
});

const onClickButton = async () => {
    navigateTo("/vueExample");
}

import image1 from 'assets/img/LandingPage/image1.jpeg';
import image2 from 'assets/img/LandingPage/image2.jpeg';
import image3 from 'assets/img/LandingPage/image3.jpeg';
import image4 from 'assets/img/LandingPage/image4.jpeg';

// Import the local background image
import backgroundImage from '/assets/img/LandingPage/landingpage3-bg.png';

const cardData = [
{
    title: "Best Healthy Restaurants in Manila",
    description: "Explore Manila healthily with this travel guide updated to 2024.",
    image: image1
},
{
    title: "Best Healthy Restaurants in Manila",
    description: "Explore Manila healthily with this travel guide updated to 2024.",
    image: image2
},
{
    title: "Best Healthy Restaurants in Manila",
    description: "Explore Manila healthily with this travel guide updated to 2024, with over 10 restaurants marked all around Manila!",
    image: image3
},
{
    title: "Best Healthy Restaurants in Manila",
    description: "Explore Manila healthily with this travel guide updated to 2024.",
    image: image4
}
];

// Create a reactive style object
const backgroundStyle = ref({
background: `url(${backgroundImage}) no-repeat center center`,
// backgroundSize: 'cover',
height: '980px' // Adjust the height as needed
});

const scrollContainer = ref(null);

onMounted(() => {
const sections = document.querySelectorAll('.section');
let currentSection = 0;

const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentSection = index;
    }
};

const handleWheel = (event) => {
    if (event.deltaY > 0) {
    scrollToSection(currentSection + 1);
    } else {
    scrollToSection(currentSection - 1);
    }
};

scrollContainer.value.addEventListener('wheel', handleWheel);
});

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
.bg-header-image {
    background-image: url('@/assets/img/topcurve.svg');
    background-size: 150% auto;
    background-repeat: no-repeat;
    background-position: center top;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-attachment: fixed;

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

.meal-cards-container {
height: 800px; /* Adjust this value based on your non-expanded card height */
position: relative;
}
.background-wrapper {
position: absolute;
margin-top: 10px;
height: 70vh;
width: 100vw;
}

.background-image {
width: 100%;
height: 100%;
/* object-fit: cover;
object-position: center bottom ; */
}

.overflow-x-auto {
overflow-x: auto;
-webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
display: none;
}

@media (max-width: 640px) {
.flex.justify-start {
    justify-content: flex-start;
}
}

.flex.justify-start{
    justify-content: flex-start;
}


.flex.justify-start{
    justify-content: flex-start;
}


/* full page scrolling */
html {
scroll-behavior: smooth;
}

.scrollContainer {
scroll-snap-type: y mandatory;
overflow-y: scroll;
height: 100vh;
}

.section {
scroll-snap-align: start;
height: 100vh;
width: 100%;
}
</style>


