<template>
    <div class="budget-container">
        <svg width="592" height="747" viewBox="0 0 592 747" fill="none" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stop-color="#B8B396" />
                <stop offset="100%" stop-color="#B8B396" />
            </linearGradient>

            <g filter="url(#filter0_d_5105_2538)">
            <path d="M17 240C17 206.863 43.8629 180 77 180H515C548.137 180 575 206.863 575 240V666C575 699.137 548.137 726 515 726H77C43.8629 726 17 699.137 17 666V240Z" fill="#F3EADA"/>
            <path d="M523 214.5C523 188.039 517.271 161.836 506.139 137.389C495.008 112.942 478.692 90.729 458.124 72.018C437.556 53.307 413.138 38.4646 386.264 28.3383C359.391 18.2119 330.588 13 301.5 13C272.412 13 243.609 18.212 216.736 28.3383C189.862 38.4646 165.444 53.307 144.876 72.018C124.308 90.729 107.992 112.942 96.8607 137.389C85.7293 161.836 80 188.039 80 214.5L523 214.5Z" fill="#F3EADA"/>
            </g>
            
            <g filter="url(#filter1_d_5105_2538)">
            <!-- Calories background -->
            <path class="grey" d="M 142 167 C 142 151.11 146.074 135.376 153.989 120.695 C 161.904 106.015 173.505 92.676 188.131 81.4401 C 202.756 70.2042 220.119 61.2914 239.227 55.2106 C 258.336 49.1298 278.817 46 299.5 46 S 340.664 49.1298 359.773 55.2106 C 378.881 61.2914 396.244 70.2042 410.869 81.4401 C 425.495 92.676 437.096 106.015 445.011 120.695 C 452.926 135.376 457 151.11 457 167" fill="none"/>
            <path d="M 142 167 C 142 151.11 146.074 135.376 153.989 120.695 C 161.904 106.015 173.505 92.676 188.131 81.4401 C 202.756 70.2042 220.119 61.2914 239.227 55.2106 C 258.336 49.1298 278.817 46 299.5 46 S 340.664 49.1298 359.773 55.2106 C 378.881 61.2914 396.244 70.2042 410.869 81.4401 C 425.495 92.676 437.096 106.015 445.011 120.695 C 452.926 135.376 457 151.11 457 167" class="blue" id="blue"/>
            </g>           
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
                <span class="calories-title">Calories</span>
                <span class="calories-value">{{ remainingCalories }}/{{ maxCalories }}cal</span>
            </div>
            <span class="budget-title">Today's Nutrition Budget</span>
        </div>
        <div class="budget-bar-overlay">
            <div v-for="(nutrient, index) in nutrientsList.slice(0, 6)" :key="index" class="tooltip-wrapper">
                <div 
                class="tooltip-container"
                @mouseenter="showTooltip(index)" 
                @mouseleave="hideTooltip"
                >
                    <!-- Nutrition Bar Component -->
                    <NutritionBar
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
                
                    <!-- Custom Tooltip -->
                    <div v-if="activeTooltip === index" class="custom-tooltip">
                        {{ tooltips[index] }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NutritionBar from './NutritionBar.vue';

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

    const tooltips = ref([
        'Carbohydrates are energy sources found in foods like sugar and grains. Simple carbs, like fruits, provide quick energy. Complex carbs, like whole grains, offer lasting energy. Opt for complex carbs for better health.',
        'Proteins are building blocks for the body found in foods like meat and beans. Animal sources, like chicken, provide complete proteins. Plant-based sources, like lentils, offer diverse nutrients. Include both for a balanced diet.',
        'Fats are energy-rich molecules found in foods like nuts and oils. Healthy fats, like avocados, support heart health. Omega-3 fatty acids in salmon are good for the brain. Balance fats for overall well-being.',
        'Sodium is a mineral found in salt and processed foods. Too much can harm health, raising blood pressure. Limit salty snacks and canned foods for a healthier diet.',
        'Cholesterol is a fatty substance in the blood. High levels can clog arteries, leading to heart issues. Foods like eggs contain cholesterol. Focus on a balanced diet to manage cholesterol levels.'
    ])

    const activeTooltip = ref(null);

    const showTooltip = (index) => {
        activeTooltip.value = index;
    }

    const hideTooltip = () => {
        activeTooltip.value = null;
    }

    const caloriesBar = ref(null);
    const maxCalories = computed(() => props.nutrients[0]['calories']);
    const remainingCalories = computed(() => props.nutrients[2]['calories']);

    onMounted(() => {
        nextTick(() => {
            caloriesBar.value = document.getElementById('blue');
        })
    })

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

                // Calculate the fill percentage
                const progress = remainingCalories.value / maxCalories.value;
                const strokeDashoffset = 511 * (1 - progress);

                if (caloriesBar.value) {
                    caloriesBar.value.style.transition = 'stroke-dashoffset 1s';
                    caloriesBar.value.style.strokeDashoffset = strokeDashoffset;
                }

            }
        },
        { immediate: true, deep: true }
    );

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
        left: 41.25%;
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

    .grey {
        stroke-width: 20;
        stroke-linecap: round;
        stroke-miterlimit: 10;
        stroke: #E9E5CD;
    }

    .blue {
        fill: none;
        stroke-width: 20;
        stroke-linecap: round;
        stroke-miterlimit: 10;
        stroke: url(#gradient);
        stroke-dasharray: 511;
        stroke-dashoffset: 511;
        animation: progress 3s ease-out forwards;
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

    .view-nutrition {
        position: absolute;
        top: 150%;
        left: 50%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 12px;
        width: 30%;
        font-size: 0.75rem;
        cursor: pointer;
    }

    .tooltip-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-bottom: 0%;
    }

    .tooltip-container {
        position: relative;
        cursor: initial;
    }

    .custom-tooltip {
        position: absolute;
        top: -100%; /* Adjust based on your layout */
        left: 75%;
        transform: translateX(-50%);
        background-color: #E3D4BE;
        border-radius: 3vh;
        z-index: 10;
        width: 50vh;
        cursor: initial;



        font-size: 100%;
        padding: 2vh;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        opacity: 1; /* Tooltip is visible */
    }

    .tooltip-container:hover .custom-tooltip {
        opacity: 1;
    }
</style>