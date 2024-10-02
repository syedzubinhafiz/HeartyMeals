<template>
    <div>
        <!-- Meal -->
        <div v-if="mode==0" class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-start">
            <div class="flex justify-between items-start mb-2">
            <!-- Adjusted flex container -->
            <div class="relative">
                <div class="flex items-center">
                <h1 class="font-bold text-black text-xl leading-normal">{{mealType}}</h1>
                <img
                    src="../assets/img/InformationIcon.png"
                    alt="info"
                    class="ml-3 w-6 h-6 cursor-pointer"
                    @mouseover="showTooltip()"
                    @mouseleave="hideTooltip()"
                />
                </div>
                <h3 class="text-gray-800 mt-1">
                {{ mealList.length > 0 ? mealList[0].name : ""  }}
                </h3>
                <!-- Tooltip (shown on hover) -->
                <div
                v-if="tooltipVisible"
                class="tooltip"
                >
                <!-- Mini Meal Cards in Tooltip -->
                <div
                    v-for="meal in reformattedMealList"
                    :key="meal.name"
                    class="bg-card-beige rounded-lg p-2 shadow-card mb-2"
                >
                    <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-black text-md leading-normal">{{ meal.name }}</h3>
                    </div>
                    <div class="bg-calories-yellow text-black px-2 py-1 rounded-lg text-xs shadow-sm">
                        Calories <span class="font-bold">{{ meal.calories }}kcal</span>
                    </div>
                    </div>
                    <!-- Nutrition Info Grid -->
                    <div class="grid grid-cols-5 gap-0 text-xs">
                    <div
                        v-for="(value, key) in meal.nutrition"
                        :key="key" 
                        :class="['nutrition-item', nutrientBgClass(key), 'p-1', 'text-center']"
                    >
                        <p class="text-gray-800">{{ key }}</p>
                        <p class="font-bold text-black">
                        {{ formatNutrientValue(value, key) }}
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="bg-calories-yellow text-black px-3 py-1 rounded-lg text-md shadow-sm">
                Calories <span class="font-bold">{{ totalNutrition.calories }}kcal</span>
            </div>
            </div>
            <!-- Nutrition Info Grid -->
            <div class="grid grid-cols-5 gap-0 text-md">
            <div
                v-for="nutrient in nutrientOrder"
                :key="nutrient"
                :class="['nutrition-item', nutrientBgClass(nutrient), 'p-1', 'text-center']"
            >
                <p class="text-gray-800">{{ nutrient }}</p>
                <p class="font-bold text-black">
                {{ formatNutrientValue(totalNutrition[nutrient] || 0, nutrient) }}
                </p>
            </div>
            </div>
        </div>
        <!-- Meal not logged -->
        <div v-else-if="mode==1" class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <h1 class="font-bold text-black text-xl leading-normal">{{mealType}}</h1>
          <div class="bg-red-warning mt-4 text-black text-center py-2 rounded-lg flex items-center justify-between px-4">
            <span>Meal not logged</span>
            <img
              src="../assets/img/Cancel.png"
              alt="Cancel Icon"
              class="w-auto h-auto"
            />
          </div>
        </div>
        <!-- Meal yet to be logged -->
        <div v-else-if="mode==2" class="bg-card-beige rounded-lg p-4 shadow-card w-full min-h-[10rem] h-auto flex flex-col justify-between">
          <h1 class="font-bold text-black text-xl leading-normal">{{mealType}}</h1>
          <div class="bg-yellow-warning mt-4 text-black py-2 rounded-lg flex items-center justify-between px-4">
            <span>Meal yet to be logged</span>
            <img
              src="../assets/img/Box Important.png"
              alt="Important Icon"
              class="w-auto h-auto"
            />
          </div>
        </div>
    </div>

</template>
<script setup>
defineOptions({
	name: "AnalyticsDayCard",
});

const props = defineProps({
    mealType: {
        default: "default"
    },
    totalNutrition: {
        default: {
        calories: 150,
        carbohydrates: 125,
        cholesterol: 0,
        fat: 20,
        protein: 125,
        sodium: 1
        }
    },
    mealList: {
        default: []
    },
    mode: {
      default: 0
    }
})

const reformattedMealList = computed({
  get() {
    return props.mealList.map((meal) => {return {
      name: meal.name,
      calories: meal.calories,
      nutrition: {
          carbohydrates: meal.carbohydrates,
          cholesterol: meal.cholesterol,
          fat: meal.fat,
          protein: meal.protein,
          sodium: meal.sodium
      }
    }})
  }
})
// Function to determine background class for nutrients
function nutrientBgClass(nutrient) {
  if (['carbohydrates', 'fat', 'sodium'].includes(nutrient)) {
    return 'bg-protein-bg';
  } else {
    return 'bg-highlight-yellow';
  }
}

// Function to format nutrient values with units
function formatNutrientValue(value, nutrient) {
  let unit = 'g'; // default unit
  // if (nutrient === 'Cholesterol') {
  //   unit = 'mg';
  // }
  return `${value}${unit}`;
}
const nutrientOrder = ['carbohydrates', 'cholesterol', 'fat', 'protein', 'sodium'];


const tooltipVisible = ref(false)

function showTooltip() {
    tooltipVisible.value = true;
}

function hideTooltip() {
    tooltipVisible.value = false;
}


// // Computed property to calculate total calories and nutrients for each meal category
// const totalMealData = computed(() => {
//   const result = {};
//   for (const [mealCategory, meals] of Object.entries(mealsData)) {
//     let totalCalories = 0;
//     const totalNutrients = {};

//     for (const meal of meals) {
//       // Sum calories
//       totalCalories += meal.calories;

//       // Sum nutrients
//       for (const [nutrient, value] of Object.entries(meal.nutrients)) {
//         if (!totalNutrients[nutrient]) {
//           totalNutrients[nutrient] = 0;
//         }
//         totalNutrients[nutrient] += value;
//       }
//     }

//     result[mealCategory] = {
//       totalCalories,
//       totalNutrients,
//     };
//   }
//   return result;
// });
</script>