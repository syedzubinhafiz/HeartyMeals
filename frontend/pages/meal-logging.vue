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
                        <FoodCard 
                            v-for="(card, index) in breakfastList" 
                            :key="index" :cardInfo="card" 
                            class="mb-4" 
                            @removeMeal="removeMeal('breakfastList', index)"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Lunch" :itemsCount="lunchList.length" route="/lunch">
                    <div>
                        <FoodCard v-for="(card, index) in lunchList" :key="index" :cardInfo="card" class="mb-4"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Dinner" :itemsCount="dinnerList.length" route="/dinner">
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
                    <NutrientWidget v-model:maxNutrientData="maxNutrientData" v-model:nutrientData="nutrientData"/>
                </div>

            
            <img :src="backgroundImage" class="background-image" />
        </div>

        <div class=""></div>
  
        <div class="section flex flex-col justify-end fixed-footer ">
            <Footer />
        </div>
    </div>
</template>

  
<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import backgroundImage from '/assets/img/meal-logging-bg.png';
    import NutrientData from '../../classes/nutrientData.js'
  
    const currentDate = ref(new Date());
    
    
    const formattedDate = computed(() => {
        return currentDate.value.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        });
    });

    const previousDate = () => {
        const newDate = new Date(currentDate.value);
        newDate.setDate(newDate.getDate() - 1);
        currentDate.value = newDate;
    };
  
    const today = new Date();
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
    import defaultImage from 'assets/img/LandingPage/image4.jpeg';
    // const breakfastList = [
    //     {
    //         name: "Egg Sandwich",
    //         image: image4
    //     }
    // ];
    // const lunchList = [
    //     {
    //         name: "Egg Sandwich",
    //         image: image4
    //     }
    // ];
    // const dinnerList = [
    //     {
    //         name: "Egg Sandwich",
    //         image: image4
    //     }
    // ];
    // const otherList = [
    //     {
    //         name: "Egg Sandwich",
    //         image: image1
    //     },
    //     {
    //         name: "Salad",
    //         image: image2
    //     },
    //     {
    //         name: "Cucumber",
    //         image: image3
    //     }
    // ];

    const breakfastList = ref([]);
    const lunchList = ref([]);
    const dinnerList = ref([]);
    const otherList = ref([]);

    const maxNutrientData = ref(null)
    const nutrientData = ref(null)

    onMounted(async () => {
        await useApi("/dietary","GET")
        let recipes = await useFillData().fillRecipes()
        console.log(recipes)
        let mealLoggingRecipes = await useFillData().fillMealLogging()
        // let mealLoggingRecipes = {
        //     "Breakfast": [],
        //     "Lunch": [
        //         {
        //             "is_consumed": false,
        //             "id": "924e30a1-ff59-4f1b-9f58-2eedf4fbc776",
        //             "consumed_date_time": "2024-09-05T06:00:00.000Z",
        //             "type": "Lunch",
        //             "portion": 2,
        //             "created_at": "2024-09-04T07:18:27.016Z",
        //             "updated_at": null,
        //             "deleted_at": null
        //         }
        //     ],
        //     "Dinner": [],
        //     "Other": [
        //         {
        //             "is_consumed": false,
        //             "id": "924e30a1-ff59-4f1b-9f58-2eedf4fbc776",
        //             "consumed_date_time": "2024-09-05T06:00:00.000Z",
        //             "type": "Other",
        //             "portion": 1,
        //             "created_at": "2024-09-04T07:18:19.855Z",
        //             "updated_at": null,
        //             "deleted_at": null
        //         },
        //     ]
        // }
        console.log(mealLoggingRecipes)
        breakfastList.value = mealLoggingRecipes.value["Breakfast"]
        lunchList.value = mealLoggingRecipes.value["Lunch"]
        dinnerList.value = mealLoggingRecipes.value["Dinner"]
        otherList.value = mealLoggingRecipes.value["Other"]

        let currentDate = new Date()
        currentDate.setUTCHours(-8, 0, 0, 0)
        currentDate = currentDate.toISOString()

        let result = await useApi(`/user/budget?date=${currentDate}`,"GET")
        console.log(result)

        maxNutrientData.value = NutrientData.fromApi2(result.value[0])
        nutrientData.value = NutrientData.fromApi2(result.value[1])
    })

</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');
* {
    font-family: 'Overpass', sans-serif;
}

.scroll-container {
    overflow-y: scroll;
    padding-bottom: 10rem;
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
    color: #015B59; 
}

.mb-4 {
    margin-bottom: 1rem; 
}

.nutrient-widget-container {
    transform: scale(0.75); 
    transform-origin: top right; 
    position: relative; 
    right: 4vw; 
    height: 95%;
    bottom: 8vw;
}

@media (min-width: 680px) {
    .nutrient-widget-container {
        transform: scale(0.9); 
        right: 5vw; 
        height: 110%;
        bottom: 11vw;
    }
}

@media (min-width: 868px) {
    .nutrient-widget-container {
        transform: scale(1); 
        right: 6vw; 
        height: 111%;
        bottom: 12vw;
    }
}

@media (min-width: 1024px) {
    .nutrient-widget-container {
        transform: scale(1.1); 
        right: 10vw; 
        bottom: 12vw;
    }
}

@media (min-width: 1280px) {
    .nutrient-widget-container {
        transform: scale(1.15); 
        right: 10vw; 
        bottom: 12vw;
    }
}

.fixed-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000; 
    background-color: inherit; 
}

.background-image {
    position: absolute;
    right: 0;
    z-index: -1; /* Ensures the image is behind other content */
    height: 100%; /* Keeps the aspect ratio */
    opacity: 1; /* Adjusts visibility */
    object-fit: cover; /* Ensures it covers the area */
    bottom: -15vh;
    margin-bottom: 300px;
}

</style>
