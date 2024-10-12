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
                            :key="index" 
                            :cardInfo="card" 
                            :isToday="isToday"  
                            class="mb-4" 
                            @removeMeal="removeMeal('breakfastList', index)"
                            @editMeal="openEditMealPopup(card)"
                            @selectMeal="setSelectedMeal"/>
                    </div>
                </Mealcardlist>
    
                <Mealcardlist title="Lunch" :itemsCount="lunchList.length" route="/lunch">
                    <div>
                        <FoodCard 
                            v-for="(card, index) in lunchList" 
                            :key="index" 
                            :cardInfo="card" 
                            :isToday="isToday"  
                            class="mb-4" 
                            @removeMeal="removeMeal('lunchList', index)"
                            @editMeal="openEditMealPopup(card)"
                            @selectMeal="setSelectedMeal"/>                    
                        </div>
                </Mealcardlist>
    
                <Mealcardlist title="Dinner" :itemsCount="dinnerList.length" route="/dinner">
                    <div>
                        <FoodCard 
                            v-for="(card, index) in dinnerList" 
                            :key="index" 
                            :cardInfo="card" 
                            :isToday="isToday"  
                            class="mb-4" 
                            @removeMeal="removeMeal('dinnerList', index)"
                            @editMeal="openEditMealPopup(card)"
                            @selectMeal="setSelectedMeal"/>                    
                        </div>
                </Mealcardlist>
    
                <Mealcardlist title="Other" :itemsCount="otherList.length" route="/other">
                    <div>
                        <FoodCard 
                            v-for="(card, index) in otherList" 
                            :key="index" 
                            :cardInfo="card" 
                            :isToday="isToday"  
                            class="mb-4" 
                            @removeMeal="removeMeal('otherList', index)"
                            @editMeal="openEditMealPopup(card)"
                            @selectMeal="setSelectedMeal"/>
                    </div>
                </Mealcardlist>
            </div>

                <div class="nutrient-widget-container section justify-end h-screen ">
                    <NutrientWidget v-model:maxNutrientData="maxNutrientData" v-model:nutrientData="nutrientData"/>
                </div>
            <img :src="backgroundImage" class="background-image" />
        </div>
  
        <div class="section flex flex-col justify-end fixed-footer ">
            <Footer />
        </div>

        <EditMealPopUp 
            v-if="showEditPopup" 
            :key="selectedMealData?.id" 
            :visible="showEditPopup" 
            :mealData="selectedMealData.value" 
            @close="toggleEditPopup" 
            @save="saveMealChanges"
        /> 
    </div>
</template>

  
<script setup>
    import { ref, computed, onMounted, watch, toRaw } from 'vue';
    import backgroundImage from '/assets/img/meal-logging-bg.png';
    import NutrientData from '../classes/nutrientData.js'
  
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
        const today = new Date();
        
        // Calculate the date 7 days ago from today
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        // If the new date is before the "oneWeekAgo" date, don't allow it to change
        if (newDate > oneWeekAgo) {
            newDate.setDate(newDate.getDate() - 1);
            currentDate.value = newDate;
        } else {
            alert("You can only view up to 7 days of history.");
        }
    };

    const fetchDataForCurrentDate = async () => {
        console.log(currentDate.value)

        let formattedCurrentDate = new Date(currentDate.value);
        console.log(formattedCurrentDate)
        
        let formattedISODate = formattedCurrentDate.toISOString();
        console.log(formattedISODate)

        
        //formattedCurrentDate.setUTCHours(formattedCurrentDate.getUTCHours() + 8);
        let formattedISODate8 = formattedCurrentDate.toISOString();
        console.log(formattedISODate8);


        let result = await useApi(`/user/budget?date=${formattedISODate8}`, "GET");
        console.log(result);

        maxNutrientData.value = NutrientData.fromApi2(result.value[0]);
        nutrientData.value = NutrientData.fromApi2(result.value[1]);

        let mealLoggingRecipes = await useFillData().fillMealLogging();
        console.log(mealLoggingRecipes)
        
        let meals = await useApi(`/meal-logging/get?date=${formattedISODate8}`, "GET");
        console.log(meals)
        breakfastList.value = meals.value["Breakfast"];
        lunchList.value = meals.value["Lunch"];
        dinnerList.value = meals.value["Dinner"];
        otherList.value = meals.value["Other"]; 
    };

    watch(currentDate, async () => {
        await fetchDataForCurrentDate();
    });

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
    
    const isToday = computed(() => {
        return (
        currentDate.value.getFullYear() === today.getFullYear() &&
        currentDate.value.getMonth() === today.getMonth() &&
        currentDate.value.getDate() === today.getDate()
        );
    });


    const showEditPopup = ref(false);
    const selectedMealData = ref(null);

    const setSelectedMeal = (mealData) => {
    selectedMealData.value = { ...mealData }; // Ensure a copy is created
    console.log("Selected Meal Data:", selectedMealData.value);
};

    const toggleEditPopup = () => {
        showEditPopup.value = !showEditPopup.value;
    };

    const openEditMealPopup = (mealInfo) => {
        console.log("Before assignment:", mealInfo);
        selectedMealData.value = mealInfo ? { ...mealInfo } : {}; // Ensure it's an object
        console.log("After assignment:", selectedMealData.value);
        showEditPopup.value = true;
        console.log("Popup visibility:", showEditPopup.value);

    };

    const saveMealChanges = async (updatedMealInfo) => {
        console.log("mealdate: ", selectedMealData.value.created_at);
        console.log("id", selectedMealData.value.id);    
        console.log("portion", updatedMealInfo.portionSize);
        console.log("mealtype", updatedMealInfo.mealType);

        let currentDate = new Date()
        currentDate.setUTCHours(-8, 0, 0, 0)
        currentDate = currentDate.toISOString()

  

        const portionSize = Number(updatedMealInfo.portionSize);
        const mealType = String(updatedMealInfo.mealType);
        
        // Make API call to update the meal in the backend
        const result = await useApi("/meal-logging/update", "POST", {
            "mealDate": currentDate,
            "mealLoggingId": selectedMealData.value.id,
            "portion": portionSize,
            "mealType": mealType
        });

        console.log("Update Meal API response:", result);

        if (result && !result.isError) {
            // Update was successful, close the popup
            showEditPopup.value = false;

            // Optionally, you could refresh the meal data here
            await fetchDataForCurrentDate();
        } else {
            // Handle the error, maybe show a toast notification
            console.error("Failed to update the meal:", result?.message || "Unknown error");
        }
    };

    const breakfastList = ref([]);
    const lunchList = ref([]);
    const dinnerList = ref([]);
    const otherList = ref([]);

    const maxNutrientData = ref(null)
    const nutrientData = ref(null)

    onMounted(async () => {  
        await useApi("/dietary","GET")
        let recipes = await useFillData().fillRecipes()
        let mealLoggingRecipes = await useFillData().fillMealLogging()
        await fetchDataForCurrentDate();   

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
        // console.log(mealLoggingRecipes)
        // breakfastList.value = mealLoggingRecipes.value["Breakfast"]
        // lunchList.value = mealLoggingRecipes.value["Lunch"]
        // dinnerList.value = mealLoggingRecipes.value["Dinner"]
        // otherList.value = mealLoggingRecipes.value["Other"]
        // let currentDate = new Date()
        // currentDate.setUTCHours(-8, 0, 0, 0)
        // currentDate = currentDate.toISOString()
        // let result = await useApi(`/user/budget?date=${currentDate}`,"GET")
        // maxNutrientData.value = NutrientData.fromApi2(result.value[0])
        // nutrientData.value = NutrientData.fromApi2(result.value[1])
        
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
