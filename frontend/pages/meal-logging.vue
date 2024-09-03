<template>
    <div class="relative w-screen z-40 bg-custom-bg">
        <Header />
  
        <div class="flex items-center justify-center py-8">
            <!-- Left arrow to decrease the date -->
            <button @click="previousDate" class="text-custom-bg-green px-2">
                <i class="bi bi-chevron-left"></i>
            </button>
  
            <!-- Display the formatted date -->
            <span class="text-xl font-semibold px-6">
                {{ formattedDate }}
            </span>
  
            <!-- Right arrow to increase the date -->
            <button @click="nextDate" class="text-custom-bg-green px-2">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
  
        <div class="flex justify-between h-screen relative">
            
            <div class="w-2/5 ml-20 mt-8 scroll-container" style="height: 100%;">
                <Mealcardlist title="Breakfast" :itemsCount="breakfastList.length" route="/breakfast">
                    <div>
                        <FoodCard v-for="(card, index) in breakfastList" :key="index" :cardInfo="card" class="mb-4"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Lunch" :itemsCount="2" route="/lunch">
                    <div>
                        <FoodCard v-for="(card, index) in LunchList" :key="index" :cardInfo="card" class="mb-4"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Dinner" :itemsCount="3" route="/dinner">
                    <div>
                        <FoodCard v-for="(card, index) in dinnerList" :key="index" :cardInfo="card" class="mb-4"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Other" :itemsCount="otherList.length" route="/other">
                    <div>
                        <FoodCard v-for="(card, index) in otherList" :key="index" :cardInfo="card" class="mb-4"/>
                    </div>
                </Mealcardlist>
            </div>


                <div class="nutrient-widget-container section justify-end h-screen ">
                    <NutrientWidget />
                </div>

            
            <img :src="backgroundImage" class="background-image" />
        </div>
  
        <div class="section flex flex-col justify-end fixed-footer ">
            <Footer />
        </div>
    </div>
</template>

  
<script setup>

    import { ref, computed } from 'vue';
    import backgroundImage from '/assets/img/meal-logging-bg.png';
  
    // Define the initial state of the date
    const currentDate = ref(new Date());
    
    // Compute the formatted date as dd-MMMM-yyyy
    const formattedDate = computed(() => {
        return currentDate.value.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        });
    });
  
    // Method to go to the previous date
    const previousDate = () => {
        const newDate = new Date(currentDate.value);
        newDate.setDate(newDate.getDate() - 1);
        currentDate.value = newDate;
    };
  
    const today = new Date();
    // Method to go to the next date (but not beyond the current date)
    const nextDate = () => {
    const newDate = new Date(currentDate.value);
        if (newDate.toDateString() === today.toDateString()) {
            alert("You can't log your meal for tomorrow, consider going to the meal planning page.");
        } else {
            newDate.setDate(newDate.getDate() + 1);
            currentDate.value = newDate;
        }
        };
    
    import image1 from 'assets/img/LandingPage/image1.jpeg';
    import image2 from 'assets/img/LandingPage/image2.jpeg';
    import image3 from 'assets/img/LandingPage/image3.jpeg';
    import image4 from 'assets/img/LandingPage/image4.jpeg';
    const breakfastList = [
        {
            name: "Egg Sandwich",
            image: image4
        }
    ];
    const LunchList = [
        {
            name: "Egg Sandwich",
            image: image4
        }
    ];
    const dinnerList = [
        {
            name: "Egg Sandwich",
            image: image4
        }
    ];
    const otherList = [
        {
            name: "Egg Sandwich",
            image: image1
        },
        {
            name: "Salad",
            image: image2
        },
        {
            name: "Cucumber",
            image: image3
        }
    ];
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
* {
    font-family: 'Overpass', sans-serif;
}

.scroll-container {
    overflow-y: scroll;
}

.bg-custom-bg {
    background-color: #DAC2A8;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    
}

.text-custom-bg-green {
    color: #015B59; /* Customize the color to your desired one */
}

.mb-4 {
    margin-bottom: 1rem; /* Adjust this value to increase/decrease the gap */
}

.nutrient-widget-container {
    transform: scale(0.75); /* Default to smaller size */
    transform-origin: top right; /* Adjust the origin if necessary */
    position: relative; /* Ensures the widget can be positioned within its container */
    right: 4vw; /* Adjust the right position dynamically */
    height: 95%;
    bottom: 8vw;
}

@media (min-width: 680px) {
    .nutrient-widget-container {
        transform: scale(0.9); /* Slightly larger for small screens */
        right: 5vw; /* Adjust the right position dynamically */
        height: 110%;
        bottom: 11vw;
    }
}

@media (min-width: 868px) {
    .nutrient-widget-container {
        transform: scale(1); /* Normal size for medium screens */
        right: 6vw; /* Adjust the right position dynamically */
        height: 111%;
        bottom: 12vw;
    }
}

@media (min-width: 1024px) {
    .nutrient-widget-container {
        transform: scale(1.1); /* Larger for large screens */
        right: 10vw; /* Adjust the right position dynamically */
        bottom: 12vw;
    }
}

@media (min-width: 1280px) {
    .nutrient-widget-container {
        transform: scale(1.15); /* Largest size for extra-large screens */
        right: 10vw; /* Adjust the right position dynamically */
        bottom: 12vw;
    }
}

.fixed-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000; /* Adjust the z-index as needed */
    background-color: inherit; /* Use the background color to match the page design */
}

.background-image {
    position: absolute;
    right: 0;
    z-index: -1; /* Ensures the image is behind other content */
    height: 110%; /* Keeps the aspect ratio */
    opacity: 1; /* Adjusts visibility */
    object-fit: cover; /* Ensures it covers the area */
    margin-bottom: 200px;
}

</style>
