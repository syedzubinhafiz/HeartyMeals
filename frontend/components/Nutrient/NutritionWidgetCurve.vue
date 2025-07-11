<template>
    <div class="budget-container">
        <svg viewBox="0 0 592 747" fill="none" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stop-color="#B8B396" />
                <stop offset="100%" stop-color="#B8B396" />
            </linearGradient>
            <linearGradient id="warning-gradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="100%" stop-color="#dc2626" />
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
            <div class="calories-container" :class="{ 'over-budget': isOverBudget }">
                <span class="calories-title">Calories</span>
                <span>{{ consumedCalories.toFixed(1) }}/{{ maxCalories.toFixed(0) }}cal</span>
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

        <!-- Warning Toast for Over Budget -->
        <Transition name="slide-down">
            <div v-if="showWarning" class="warning-toast">
                <div class="warning-content">
                    <div class="warning-icon">⚠️</div>
                    <div class="warning-text">
                        <h4>Oops! You've exceeded your daily calorie budget</h4>
                        <p>Don't worry, tomorrow is a fresh start! Consider lighter meals for the rest of the day. 💪</p>
                    </div>
                    <button @click="dismissWarning" class="dismiss-btn">×</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
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
    const maxCalories = computed(() => {
        const max = props.nutrients[0]?.['calories'] || 0;
        return max;
    });
    const consumedCalories = computed(() => {
        const consumed = props.nutrients[1]?.['calories'] || 0;
        return consumed;
    });
    const isOverBudget = computed(() => consumedCalories.value > maxCalories.value);
    const warningDismissed = ref(false);
    const showWarning = computed(() => isOverBudget.value && !warningDismissed.value);

    const dismissWarning = () => {
        warningDismissed.value = true;
    };

    // Reset warning dismissal when no longer over budget
    watch(isOverBudget, (newValue) => {
        if (!newValue) {
            warningDismissed.value = false;
        }
    });

    onMounted(() => {
        nextTick(() => {
            caloriesBar.value = document.getElementById('blue');
        })
    })

    // Watch for changes in the nutrients prop
    watch(() => props.nutrients, (newVal) => {
            console.log('[NutritionWidgetCurve] Received nutrients prop:', newVal);
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
                console.log('[NutritionWidgetCurve] Updating nutrient bars with budget:', userNutritionBudget);
                for (let i = 0; i < nutrientsType.length; i++) {
                    const daily_budget = userNutritionBudget[0][nutrientsType[i]];
                    const consumed_value = userNutritionBudget[1][nutrientsType[i]];  // Now consumed instead of remaining
                    const remaining_value = userNutritionBudget[2][nutrientsType[i]];  // Remaining nutrients

                    console.log(`[NutritionWidgetCurve] ${nutrientsType[i]}: budget=${daily_budget}, consumed=${consumed_value}, remaining=${remaining_value}`);

                    nutrientsList.value[i].totalValue = daily_budget;
                    nutrientsList.value[i].currentValue = consumed_value;  // Display consumed amount
                    nutrientsList.value[i].afterMealValue = consumed_value;  // Keep the same as current for now
                }
                console.log('[NutritionWidgetCurve] Updated nutrientsList:', nutrientsList.value);

                // Calculate the fill percentage for consumed calories (cap at 100% to prevent overflow)
                const rawProgress = consumedCalories.value / maxCalories.value;
                const progress = Math.min(rawProgress, 1); // Cap at 100%
                const strokeDashoffset = 511 * (1 - progress);

                if (caloriesBar.value) {
                    caloriesBar.value.style.transition = 'stroke-dashoffset 1s, stroke 0.3s';
                    caloriesBar.value.style.strokeDashoffset = strokeDashoffset;
                    
                    // Update stroke color based on budget status
                    if (isOverBudget.value) {
                        caloriesBar.value.style.stroke = 'url(#warning-gradient)';
                    } else {
                        caloriesBar.value.style.stroke = 'url(#gradient)';
                    }
                }

            }
        },
        { immediate: true, deep: true }
    );

</script>

<style scoped>
    .budget-container {
        position: relative; /* Set the position to relative to allow absolute positioning of overlay */
        width: 100%; /* Make width responsive */
        max-width: 592px; /* Set a max-width to maintain aspect ratio */
        height: auto; /* Adjust height automatically */
        margin-left: auto;
        margin-right: auto;
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

    .budget-curve-overlay{
        width: 100%;
        height: 100%;
        top: 0%;
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */
    }

    .calories-container{
        top: 11.25%;
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */
        width: fit-content;
        display:flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        font-weight: 600;
    }

    .calories-title{
        font-size: 1.75rem; /* Responsive font size */
    }

    .calories-container span:last-child {
        font-size: 1rem;
    }

    .calories-container.over-budget {
        color: #ef4444;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
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
        font-size: 1.5rem; /* Responsive font size */
        font-weight: 600;
        top: 28%; /* Adjusted from 25% to lower the title */
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        text-align: center;
        padding-bottom: 15px; /* Add padding at the bottom */
    }

    .budget-bar-overlay{
        width: auto; /* Adjust width automatically */
        height: 58%; /* Slightly reduced height */
        top: 36%; /* Moved down to create more space from title */
        left: 10%;
        right: 10%; /* Use left and right for responsive width */
        position: absolute;
        pointer-events: all; /* Enable interaction with labels */
        font-weight: 600;
        font-size: 1rem; /* Base font size */
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Distribute evenly with tighter spacing */
        overflow: visible; /* Allow cholesterol bar to show */
        box-sizing: border-box;
    }

    :deep(.progress-bar) {
        /* Use full height of the container so the bar is not clipped */
        height: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 0%;
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
        flex: 0 0 auto; /* Don't flex, use natural size */
        margin: 0; /* Remove all margins for even spacing */
    }

    .tooltip-container {
        position: relative;
        cursor: initial;
        width: 100%; /* Ensure full width */
    }

    .custom-tooltip {
        position: absolute;
        top: -100%; /* Adjust based on your layout */
        left: 50%; /* Center the tooltip */
        transform: translateX(-50%);
        background-color: #E3D4BE;
        border-radius: 1rem; /* Use rem for scalability */
        z-index: 10;
        width: 80vw; /* Use viewport width for responsiveness */
        max-width: 300px; /* Set a max-width */
        cursor: initial;
        font-size: 0.875rem; /* Responsive font size */
        padding: 1rem; /* Use rem for scalable padding */
        opacity: 1; /* Tooltip is visible */
        transition: opacity 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .tooltip-container:hover .custom-tooltip {
        opacity: 1;
    }

    /* Warning Toast Styles */
    .warning-toast {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        background-color: #fef2f2;
        border: 2px solid #fecaca;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.15);
        max-width: 500px;
        min-width: 350px;
        font-family: 'Overpass', sans-serif;
    }

    .warning-content {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 12px;
    }

    .warning-icon {
        font-size: 24px;
        flex-shrink: 0;
    }

    .warning-text {
        flex: 1;
    }

    .warning-text h4 {
        margin: 0 0 4px 0;
        color: #dc2626;
        font-size: 16px;
        font-weight: 600;
    }

    .warning-text p {
        margin: 0;
        color: #991b1b;
        font-size: 14px;
        line-height: 1.4;
    }

    .dismiss-btn {
        background: none;
        border: none;
        color: #dc2626;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
        flex-shrink: 0;
    }

    .dismiss-btn:hover {
        background-color: #fecaca;
    }

    /* Slide Down Animation */
    .slide-down-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-down-leave-active {
        transition: all 0.3s ease-in;
    }

    .slide-down-enter-from {
        transform: translate(-50%, -20px);
        opacity: 0;
    }

    .slide-down-leave-to {
        transform: translate(-50%, -20px);
        opacity: 0;
    }
    
    /* Media Queries for Responsiveness */
    @media (max-width: 768px) {
        .budget-title {
            font-size: 1.25rem;
            top: 27%; /* Adjusted for tablets */
        }
        .calories-title {
            font-size: 1.5rem;
        }
        .budget-bar-overlay {
            top: 30%;
        }
    }

    @media (min-width: 769px) and (max-width: 1200px) {
        .budget-bar-overlay {
            top: 30%;
        }
    }

    @media (max-width: 480px) {
        .budget-title {
            font-size: 1rem;
            top: 26%; /* Adjusted for mobile */
        }
        .calories-title {
            font-size: 1.25rem;
        }
        .calories-container span:last-child {
            font-size: 0.875rem;
        }
        .budget-bar-overlay {
            top: 30%;
            bottom: 18%;
            font-size: 0.75rem;
        }
        .custom-tooltip {
            width: 90vw;
        }
    }
</style>