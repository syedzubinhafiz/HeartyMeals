<template>
    <div class="budget-container">
        <svg width="592" height="747" viewBox="0 0 592 747" fill="none" xmlns="http://www.w3.org/2000/svg">

            <g filter="url(#filter0_d_5105_2538)">
            <path d="M17 240C17 206.863 43.8629 180 77 180H515C548.137 180 575 206.863 575 240V666C575 699.137 548.137 726 515 726H77C43.8629 726 17 699.137 17 666V240Z" fill="#F3EADA"/>
            <path d="M523 214.5C523 188.039 517.271 161.836 506.139 137.389C495.008 112.942 478.692 90.729 458.124 72.018C437.556 53.307 413.138 38.4646 386.264 28.3383C359.391 18.2119 330.588 13 301.5 13C272.412 13 243.609 18.212 216.736 28.3383C189.862 38.4646 165.444 53.307 144.876 72.018C124.308 90.729 107.992 112.942 96.8607 137.389C85.7293 161.836 80 188.039 80 214.5L523 214.5Z" fill="#F3EADA"/>
            </g>
            
            <!-- <g filter="url(#filter1_d_5105_2538)"> -->
            <!-- Calories background -->
            <!-- <path id="caloriesBar" d="M466.238 179.5C473.838 179.5 480.089 173.313 479.123 165.774C474.993 133.55 456.416 103.245 426.254 80.1515C391.841 53.8026 345.167 39 296.5 39C247.833 39 201.159 53.8026 166.746 80.1515C136.584 103.245 118.007 133.55 113.877 165.774C112.911 173.313 119.162 179.5 126.762 179.5V179.5C134.363 179.5 140.422 173.304 141.556 165.789C145.574 139.163 161.211 114.194 186.209 95.0538C215.46 72.6572 255.133 60.075 296.5 60.075C337.867 60.075 377.54 72.6572 406.791 95.0538C431.789 114.194 447.426 139.163 451.444 165.789C452.578 173.304 458.637 179.5 466.238 179.5V179.5Z" fill="#E9E5CD"/>
            </g> -->

            <!-- Calories fill -->
            <!-- Dynamic fill based on the value prop -->
            <!-- <g filter="url(#filter1_d_5105_2538)">
            <path
                :d="progressPath"
                :fill="fillColor"
            />
            </g> -->
            
            <defs>
            <filter id="filter0_d_5105_2538" x="0.799999" y="0.799999" width="590.4" height="745.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="8.1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5105_2538"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5105_2538" result="shape"/>
            </filter>
            <filter id="filter1_d_5105_2538" x="98.5783" y="27.8" width="395.843" height="170.9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow_5105_2538"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="8.1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5105_2538"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5105_2538" result="shape"/>
            </filter>
            </defs>
        </svg>

        <div class="budget-curve-overlay">
            <div class="calories-container">
                <div class="rounded-t-full bg-custom-overlay-brown p-4 h-fit w-fit translate-y-20" style="transform: scale(1.75);">
                    <AngleBar label="Calories" :value="remainingCalories" :maxValue="maxCalories" barColor="#B8B396" uncoveredBarColor="#E6E4D8" bgColor="bg-custom-overlay-brown" :componentSize="150" />
                </div>
                <span class="calories-title">Calories</span>
                <span class="calories-value">{{ remainingCalories }}/{{ maxCalories }}cal</span>
            </div>
            <span class="budget-title">Today's Nutrition Budget</span>
        </div>
        <div class="budget-bar-overlay">
                <NutritionBar
                v-for="(nutrient, index) in nutrientsList"
                :key="index"
                :icon="nutrient.icon"
                :label="nutrient.label"
                :totalValue="nutrient.totalValue"
                :currentValue="nutrient.currentValue"
                :afterMealValue="nutrient.afterMealValue"
                :unit="nutrient.unit"
                :maxColor="nutrient.maxColor"
                :currentColor="nutrient.currentColor"
                :afterMealColor="nutrient.afterMealColor"
                :fontColor="nutrient.fontColor"
                :progressBarContainerStyle="'margin-top: 3%; margin-bottom: 3%;'"
            />
        </div>
    </div>
</template>

<script setup>
import AngleBar from './AngleBar.vue';
import NutritionBar from './NutritionBar.vue';

    // const props = defineProps({
    //     nutrients: {
    //         type: Array,
    //         required: true,
    //     },
    // });

    // const nutrientsList = [
    //     {
    //         icon: "/assets/img/carbIcon.png",
    //         label: 'Carbohydrates',
    //         totalValue: 0,
    //         currentValue: 0,
    //         afterMealValue: 0,
    //         unit: 'g',
    //         maxColor: '#e2f3f4',
    //         currentColor: '#83bbbe',
    //         afterMealColor: '#83bbbe',
    //         fontColor: '#83bbbe',
    //     },
    //     {
    //         icon: "/assets/img/proteinIcon.png",
    //         label: 'Protein',
    //         totalValue: 0,
    //         currentValue: 0,
    //         afterMealValue: 0,
    //         unit: 'g',
    //         maxColor: '#e8f0e9',
    //         currentColor: '#87a98d',
    //         afterMealColor: '#87a98d',
    //         fontColor: '#87a98d',
    //     },
    //     {
    //         icon: "/assets/img/fatsIcon.png",
    //         label: 'Fats',
    //         totalValue: 0,
    //         currentValue: 0,
    //         afterMealValue: 0,
    //         unit: 'g',
    //         maxColor: '#fbf1cd',
    //         currentColor: '#ecc474',
    //         afterMealColor: '#ecc474',
    //         fontColor: '#ecc474',
    //     },
    //     {
    //         icon: "/assets/img/sodiumIcon.png",
    //         label: 'Sodium',
    //         totalValue: 0,
    //         currentValue: 0,
    //         afterMealValue: 0,
    //         unit: 'mg',
    //         maxColor: '#f9e1da',
    //         currentColor: '#ec7455',
    //         afterMealColor: '#ec7455',
    //         fontColor: '#ec7455',
    //     },
    //     {
    //         icon: "/assets/img/cholesterolsIcon.png",
    //         label: 'Cholesterol',
    //         totalValue: 0,
    //         currentValue: 0,
    //         afterMealValue: 0,
    //         unit: 'mg',
    //         maxColor: '#ffe5d4',
    //         currentColor: '#be9a83',
    //         afterMealColor: '#be9a83',
    //         fontColor: '#be9a83',
    //     }
    // ]

    // const nutrientsType = ['carbs', 'protein', 'fat', 'sodium', 'cholesterol'];

    // watch(() => props.nutrients,
    //     (newVal, oldVal) => {
    //         console.log('Nutrients changed:', newVal);
    //         // You can now perform actions based on the new value of the prop
    //     },
    //     { deep: true } // Add deep option if you want to watch for changes within the array elements
    // );

    // const maxCalories = props.nutrients[0]['calories'];
    // const remainingCalories = props.nutrients[2]['calories'];

    // const userNutritionBudget = [];
    
    // for (let i = 0; i < props.nutrients.length; i++) {
    //     const nutrient = {
    //         carbs: props.nutrients[i]['carbs'],
    //         protein: props.nutrients[i]['protein'],
    //         fat: props.nutrients[i]['fat'],
    //         sodium: props.nutrients[i]['sodium'],
    //         cholesterol: props.nutrients[i]['cholesterol'],
    //     }
    //     userNutritionBudget.push(nutrient);
    // }

    // for (let i = 0; i < nutrientsType.length; i++) {
    //     const daily_budget = userNutritionBudget[0][nutrientsType[i]];
    //     const current_value = userNutritionBudget[1][nutrientsType[i]];
    //     const after_meal_value = userNutritionBudget[2][nutrientsType[i]];

    //     nutrientsList[i].totalValue = daily_budget;
    //     nutrientsList[i].currentValue = current_value;
    //     nutrientsList[i].afterMealValue = after_meal_value;
    // }

    // // Calculate the fill percentage
    // const fillPercentage = computed(() => (remainingCalories / maxCalories) * 100);

    // // Calculate the dynamic path for the fill
    // const progressPath = computed(() => {
    //     const maxPath = "M466.238 179.5C473.838 179.5 480.089 173.313 479.123 165.774C474.993 133.55 456.416 103.245 426.254 80.1515C391.841 53.8026 345.167 39 296.5 39C247.833 39 201.159 53.8026 166.746 80.1515C136.584 103.245 118.007 133.55 113.877 165.774C112.911 173.313 119.162 179.5 126.762 179.5V179.5C134.363 179.5 140.422 173.304 141.556 165.789C145.574 139.163 161.211 114.194 186.209 95.0538C215.46 72.6572 255.133 60.075 296.5 60.075C337.867 60.075 377.54 72.6572 406.791 95.0538C431.789 114.194 447.426 139.163 451.444 165.789C452.578 173.304 458.637 179.5 466.238 179.5V179.5Z";
    //     const fillLength = (fillPercentage.value / 100) * maxPath.length;
    //     return maxPath.slice(0, fillLength);
    // });

    // Define props
    const props = defineProps({
        nutrients: {
            type: Array,
            required: true,
        },
    });

    // The predefined nutrients list
    const nutrientsList = ref([
        {
            icon: "/assets/img/carbIcon.png",
            label: 'Carbohydrates',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#e2f3f4',
            currentColor: '#83bbbe',
            afterMealColor: '#83bbbe',
            fontColor: '#83bbbe',
        },
        {
            icon: "/assets/img/proteinIcon.png",
            label: 'Protein',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#e8f0e9',
            currentColor: '#87a98d',
            afterMealColor: '#87a98d',
            fontColor: '#87a98d',
        },
        {
            icon: "/assets/img/fatsIcon.png",
            label: 'Fats',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'g',
            maxColor: '#fbf1cd',
            currentColor: '#ecc474',
            afterMealColor: '#ecc474',
            fontColor: '#ecc474',
        },
        {
            icon: "/assets/img/sodiumIcon.png",
            label: 'Sodium',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'mg',
            maxColor: '#f9e1da',
            currentColor: '#ec7455',
            afterMealColor: '#ec7455',
            fontColor: '#ec7455',
        },
        {
            icon: "/assets/img/cholesterolsIcon.png",
            label: 'Cholesterol',
            totalValue: 0,
            currentValue: 0,
            afterMealValue: 0,
            unit: 'mg',
            maxColor: '#ffe5d4',
            currentColor: '#be9a83',
            afterMealColor: '#be9a83',
            fontColor: '#be9a83',
        },
    ]);

    // Watch for changes in the nutrients prop
    watch(() => props.nutrients, (newVal) => {
            if (newVal && newVal.length >= 3) {
            // Update userNutritionBudget with nutrients from props
            const userNutritionBudget = [];
            for (let i = 0; i < props.nutrients.length; i++) {
                const nutrient = {
                carbs: props.nutrients[i]['carbs'],
                protein: props.nutrients[i]['protein'],
                fat: props.nutrients[i]['fat'],
                sodium: props.nutrients[i]['sodium'],
                cholesterol: props.nutrients[i]['cholesterol'],
                };
                userNutritionBudget.push(nutrient);
            }

            // Update nutrientsList with new values
            const nutrientsType = ['carbs', 'protein', 'fat', 'sodium', 'cholesterol'];
            for (let i = 0; i < nutrientsType.length; i++) {
                const daily_budget = userNutritionBudget[0][nutrientsType[i]];
                const current_value = userNutritionBudget[1][nutrientsType[i]];
                const after_meal_value = userNutritionBudget[2][nutrientsType[i]];

                nutrientsList.value[i].totalValue = daily_budget;
                nutrientsList.value[i].currentValue = current_value;
                nutrientsList.value[i].afterMealValue = after_meal_value;
            }
            }
        },
        { immediate: true, deep: true }
    );

    // Calculate the fill percentage
    const maxCalories = computed(() => props.nutrients[0]['calories']);
    const remainingCalories = computed(() => props.nutrients[2]['calories']);
    const fillPercentage = computed(() => (remainingCalories.value / maxCalories.value) * 100);

    // Calculate the dynamic path for the fill
    const progressPath = computed(() => {
        const maxPath =
            "M466.238 179.5C473.838 179.5 480.089 173.313 479.123 165.774C474.993 133.55 456.416 103.245 426.254 80.1515C391.841 53.8026 345.167 39 296.5 39C247.833 39 201.159 53.8026 166.746 80.1515C136.584 103.245 118.007 133.55 113.877 165.774C112.911 173.313 119.162 179.5 126.762 179.5V179.5C134.363 179.5 140.422 173.304 141.556 165.789C145.574 139.163 161.211 114.194 186.209 95.0538C215.46 72.6572 255.133 60.075 296.5 60.075C337.867 60.075 377.54 72.6572 406.791 95.0538C431.789 114.194 447.426 139.163 451.444 165.789C452.578 173.304 458.637 179.5 466.238 179.5V179.5Z";
        const fillLength = (fillPercentage.value / 100) * maxPath.length;
        return maxPath.slice(0, fillLength);
    });

</script>

<style scoped>
    .budget-container {
        position: relative; /* Set the position to relative to allow absolute positioning of overlay */
        width: 592px;
        height: 747px;
        margin-left: auto;
        margin-right: auto;
        top: -5%;
    }

    .budget-container svg {
        width: 100%;
        height: 100%;
    }

    .budget-overlay{
        width: 100%;
        height: 100%;
        top: 0%;
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */

        font-weight: 600;
    }

    .calories-container{
        top: 11.25%;
        left: 36.25%;
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */
        width: fit-content;
        display:flex;
        flex-direction: column;
        text-align: center;

        font-weight: 600;
    }

    .calories-title{
        font-size: 175%;
    }

    .calories-value{

    }

    .budget-title{
        position: absolute;
        font-size: 200%;
        font-weight: 600;
        top: 25%;
        left: 20%     
    }

    .budget-bar-overlay{
        width: 461px;
        height: 474px;
        top: 33%;
        left: 12%;
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */

        font-weight: 600;
        font-size: 115%;
    }

    /deep/ .progress-bar{
        height: 140%;
    }

</style>