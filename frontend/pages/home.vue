<template>
    <div class="absolute w-screen z-40">
        <Header/>
    </div>
    <div ref="scrollContainer" class="scrollContainer relative">
        <!-- section 1 -->
        <div class="section1-container">
            <div class="section1-content">
                <h1 class="section1-heading">Welcome back, {{userName}}</h1>
                <p class="section1-subheading">What do you want to do today?</p>

                <div class="section1-buttons">
                    <NuxtLink to="/recipe-library">
                        <button class="custom-button">
                            <img src="/assets/img/recipe-icon.png" alt="Recipe Library" /> Recipe Library
                        </button>
                    </NuxtLink>

                    <NuxtLink to="/meal-logging">
                        <button class="custom-button">
                            <img src="/assets/img/logging-icon.png" alt="Meal Logging" /> Meal Logging
                        </button>
                    </NuxtLink>

                    <NuxtLink to="/meal-planning">
                        <button class="custom-button">
                            <img src="/assets/img/planning-icon.png" alt="Meal Planning" /> Meal Planning
                        </button>
                    </NuxtLink>
                </div>
                
            </div>
            <div class="section1-quote">
                <p class="quote-text">
                    Every day may not be good, but there's something good in every day. Focus on the good, no matter how small.
                </p>
            </div>
        </div>

        <!-- section 2 -->
        <div class="section flex items-center justify-center">
            <div>
                <img src="~/assets/img/main-landing-page-2-top-background.svg" style="transform: scale(0.8);"></img>
                <div class="section-text">Today's Budget</div>
            </div>
            <div class="section-2-container-grid">
                <div class="section-2-container-left-grid">
                    <WaterDroplet :maxVolume="maxVolume" :remainingVolume="remainingVolume"/>
                </div>
                <div class="section-2-container-right-grid">
                    <NutritionWidgetCurve :nutrients="nutrients"/>
                </div>
            </div>
        </div>

        <!-- section 3 -->
        <div class="section section-3">
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
        <div class="section section-4">
            <RecipeOfTheDay 
            :recipeName="recipeName"
            :recipeDescription="recipeDescription"
            :recipeImage="recipeImage"
            :recipeId="recipeId"
            :recipeNutrition="recipeNutrition"
            />
        </div>
        <Footer/>
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
    middleware: "auth",
});

const { $axios } = useNuxtApp();

const scrollContainer = ref(null);

// scrolling behaviour
onMounted(async() => {
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
    await getRecipeOfTheDay();
    await getUserInfo();
    await getFluidData();
    await getUserBudget();
    await getEducationalContent();


});

import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toast-notification';
import WaterDroplet from '~/components/WaterTank/WaterDroplet.vue';
import NutritionWidgetCurve from '~/components/Nutrient/NutritionWidgetCurve.vue';
import MealCard from '~/components/MealCard.vue';
import backgroundImage from '/assets/img/LandingPage/landingpage3-bg.png';

/**
 * Section 1 code
 * 
 */

 const userName = ref("");

 const getUserInfo = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await $axios.get('/user/info', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            userName.value = response.data.first_name;
        }
        else {
            console.log(response);
        }
    }
    catch (e) {
        useToast().error("Failed to get user information");
    }
 }


/**
 * Section 2 code
 */

 // water budget
const maxVolume = ref(0);
const remainingVolume = ref(0);

// use api to get data
const getFluidData = async () => {
    try {
        const today_date = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            return formattedDate;
        };
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const token = localStorage.getItem('accessToken');
        const response = await $axios.get(`/fluid-logging/get?dateTime=${today_date()}&timeZone=${timeZone}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            maxVolume.value = response.data.logging_history[0].remaining_fluid;
            remainingVolume.value = parseFloat((response.data.logging_history[response.data.logging_history.length - 1].remaining_fluid).toFixed(2));
        }
        else {
            console.log(response);
        }
    }
    catch (e) {
        useToast().error("Failed to load fluid intake data")
    }
}

// user daily budget, user remaining budget, and user after meal  budget
const nutrients = ref([
    {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    },
    {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    },
    {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
      cholesterol: 0
    }
  ]);

  const getUserBudget = async () => {
    try {
        const today_date = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        };
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const token = localStorage.getItem('accessToken');
        const response = await $axios.get(`/user/budget?startDate=${today_date()}&timeZone=${timeZone}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            // maxVolume.value = response.data.logging_history[0].remaining_fluid;
            // remainingVolume.value = parseFloat((response.data.logging_history[response.data.logging_history.length - 1].remaining_fluid).toFixed(2));
            const userNutrition = response.data[today_date()];
            for (let i = 0; i < 2; i++) {
                if (i === 0) {
                    nutrients.value[0].calories = userNutrition[i].calories;
                    nutrients.value[0].carbs = userNutrition[i].carbs;
                    nutrients.value[0].protein = userNutrition[i].protein;
                    nutrients.value[0].fat = userNutrition[i].fat;
                    nutrients.value[0].sodium = userNutrition[i].sodium;
                    nutrients.value[0].cholesterol = userNutrition[i].cholesterol;
                }
                else {
                    nutrients.value[2].calories = userNutrition[i].calories;
                    nutrients.value[2].carbs = userNutrition[i].carbs;
                    nutrients.value[2].protein = userNutrition[i].protein;
                    nutrients.value[2].fat = userNutrition[i].fat;
                    nutrients.value[2].sodium = userNutrition[i].sodium;
                    nutrients.value[2].cholesterol = userNutrition[i].cholesterol;
                }
            }
        }
        else {
            console.log(response);
        }
    }
    catch (e) {
        useToast().error("Failed to load user budget")
    }
}

/**
 * Section 3 code
 */

const cardData = ref([]);

const getEducationalContent = async () => {
    // get educational content
    try {
        const response = await $axios.get(`/education/get/random`);
        if (response.status === 200){
            const educationalContent = response.data;

            for (let i = 0; i < educationalContent.length; i++) {
                cardData.value.push({
                    id: educationalContent[i].id,
                    title: educationalContent[i].title,
                    description: educationalContent[i].summary,
                    image: educationalContent[i].storage_links.thumbnail
                });
            }
        } else {
            console.log(response);
        }
    } catch (e) {
        useToast().error("Failed to get educational content")
    }
}

/**
 * Section 4 code
 */

const recipeName = ref("");
const recipeDescription = ref("");
const recipeImage = ref("");
const recipeId = ref("");
const recipeNutrition = ref({
    calories: 0,
    fat: 0,
    sodium: 0,
    protein: 0,
    carbohydrates: 0,
    cholesterol: 0
});

const getRecipeOfTheDay = async () => {
    // get recipe of the day
    try {
        const response = await $axios.get(`/recipe/recipe-of-the-day`);
        if (response.status === 200){
            // set recipe of the day
            recipeName.value = response.data.name;
            recipeDescription.value = response.data.description;
            recipeImage.value = response.data.storage_links.thumbnail;
            recipeId.value = response.data.id;

            recipeNutrition.value.calories = (response.data.nutrition_info.calories).toFixed(2);
            recipeNutrition.value.fat = (response.data.nutrition_info.fat).toFixed(2);
            recipeNutrition.value.sodium = (response.data.nutrition_info.sodium).toFixed(2);
            recipeNutrition.value.cholesterol = (response.data.nutrition_info.cholesterol).toFixed(2);
            recipeNutrition.value.protein = (response.data.nutrition_info.protein).toFixed(2);
            recipeNutrition.value.carbohydrates = (response.data.nutrition_info.totalCarbohydrate).toFixed(2);
        } else {
            console.log(response);
        }
    } catch (e) {
        useToast().error("Failed to get recipe of the day")
    }
}

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
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* Section 1 Styles */
.section1-container {
    position: relative;
    height: 100vh;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.section1-content {
    width: 100%;
    min-height: 110vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-image: url('@/assets/img/topcurve.svg');
    background-size: 120% auto;
    background-repeat: no-repeat;
    background-position: center top;
    background-attachment: fixed;
    padding-bottom: 20vh;
    color: white;
}

@media (max-width: 1400px) {
    .section1-content {
        padding-bottom: 15vh;
        min-height: 94vh;
        width: 100%;
    }
}

@media (max-width: 1200px) {
    .section1-content {
        padding-bottom: 20vh;
        min-height: 75vh;
    }
}
@media (max-width: 1000px) {
    .section1-content {
        padding-bottom: 20vh;
        min-height: 70vh;
    }
}
@media (max-width: 800px) {
    .section1-content {
        padding-bottom: 35vh;
        min-height:70vh;
    }
}

@media (max-width: 468px) {
    .section1-content {
        padding-bottom: 45vh;
    }
}

.section1-heading {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

@media (min-width: 1024px) {
    .section1-heading {
        font-size: 4rem;
        margin-bottom: 2rem;
    }
}

.section1-subheading {
    font-size: 1.125rem;
    margin-bottom: 2.5rem;
}

@media (min-width: 1024px) {
    .section1-subheading {
        font-size: 3rem;
        margin-bottom: 2.5rem;
    }
}

.section1-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .section1-buttons {
        gap: 1.5rem;
    }
}

@media (min-width: 1024px) {
    .section1-buttons {
        gap: 3rem;
    }
}

.section1-quote {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10%;
}

@media (min-width: 768px) {
    .section1-quote {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
        padding-bottom: 1rem;
    }
}

@media (min-width: 1024px) {
    .section1-quote {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
        padding-bottom: 1rem;
    }
}

.quote-text {
    text-align: center;
    font-size: 150%;
    font-style: italic;
    color: #000000;
    font-weight: 600;
}

@media (min-width: 768px) {
    .quote-text {
        font-size: 1.25rem;
    }
}

/* Button Styles */
.custom-button {
    border-radius: 0.5rem; 
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
    background-color: #FFA17A; 
    padding: 0.5rem 0.25rem; 
    display: flex;
    align-items: center;
    color: #993300; 
    font-size: 1rem; 
    font-weight: bold; 
    text-transform: uppercase; 
    margin-bottom: 0.75rem; 
    transition: background-color 0.2s ease-in-out;
}

.custom-button:hover {
    background-color: #e5946b; 
}

@media (min-width: 468px) {
    .custom-button {
        padding: 0.3rem 0.5rem; 
        font-size: 0.6rem; 
    }
}

@media (min-width: 768px) {
    .custom-button {
        padding: 0.3rem 0.5rem; 
        font-size: 0.9rem; 
    }
}

@media (min-width: 1024px) {
    .custom-button {
        padding: 0.75rem 1.5rem; 
        font-size: 1.15rem; 
    }
}

.custom-button img {
    width: 1.5rem; 
    height: 1.5rem; 
    margin-right: 0.5rem; 
}

@media (min-width: 468px) {
    .custom-button img {
        width: 1rem; 
        height: 1rem; 
        margin-right: 0.5rem; 
    }
}

@media (min-width: 768px) {
    .custom-button img {
        width: 1.5rem; 
        height: 1.5rem; 
        margin-right: 1rem; 
    }
}

@media (min-width: 1024px) {
    .custom-button img {
        width: 2rem; 
        height: 2rem; 
        margin-right: 0.9rem; 
    }
}

.section-text {
    position: absolute;
    top: 112%; /* Adjust the distance from the top */
    left: 50%;
    transform: translateX(-50%); /* Center the text horizontally */
    font-size: 200%; /* Adjust the text size */
    font-weight: bold; /* Make the text bold */
}

.section-2-container-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "left right";
    width: 100%;
    height: 70%;
}

.section-2-container-left-grid {
    grid-area: left;
}

/deep/ .svg-container{
    transform: scale(0.85);
}

.section-2-container-right-grid {
    grid-area: right;
}

/deep/ .budget-container{
    transform: scale(0.85);
}

.section-3 {
    position: relative; /* Establishes a positioning context */
    z-index: 10; /* Places this element above others */
    height: 100vh; /* Full height of the viewport */
    display: flex; /* Enables flexbox layout */
    flex-direction: column; /* Stacks children vertically */
    justify-content: center; /* Centers items vertically */
    align-items: center; /* Centers items horizontally */
    text-align: center; /* Centers text within the element */
    }


.section-4 {
    width: 80%;
    height: 80%;
    display: flex;
    position: relative;
    margin: auto;
}
</style>


