import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie, useNuxtApp } from '#app';
import { MEAL_STATE } from '@/constants/mealState.js';

// Centralised state for meal logging and planning
export const useMealLoggingStore = defineStore('mealLogging', () => {
  /** -------------------------------------------------------------
   *  STATE
   * ------------------------------------------------------------*/
  // Unsaved list lives only on the client and is persisted via localStorage
  // Ensure proper object creation to avoid Pinia hydration issues
  const initialUnsaved = process.client ? 
    JSON.parse(localStorage.getItem('mealList') || '[]').map(meal => ({
      ...meal,
      recipe: meal.recipe ? {
        ...meal.recipe,
        nutrition_info: meal.recipe.nutrition_info ? { ...meal.recipe.nutrition_info } : null,
        storage_links: meal.recipe.storage_links ? { ...meal.recipe.storage_links } : {}
      } : {}
    })) : [];
  const unsavedMealList = ref(initialUnsaved);

  // The date currently being edited (ISO string). Persisted so users can
  // navigate between pages (e.g. add-meals overlay) without losing context.
  const mealDateCookie = useCookie('mealDate', { default: () => new Date().toISOString() });
  const mealDate = ref(mealDateCookie.value);

  // Future-proof fields for Tasks 009-011 -----------------------------------
  // Meals retrieved from backend, split by state. These will be fleshed out
  // in later tasks but are declared now so components can rely on them.
  const plannedMeals   = ref([]); // meals added to plan but not consumed
  const consumedMeals  = ref([]); // meals already consumed

  /** -------------------------------------------------------------
   *  ACTIONS
   * ------------------------------------------------------------*/
  // Basic mutators for unsaved list -----------------------------------------
  function addMeal(meal) {
    console.log('[mealLoggingStore] addMeal called with:', meal);
    // Store only essential, serialisable fields to avoid hydration issues
    const minimal = {
      id: meal.id,
      portion: meal.portion,
      recipe: {
        name: meal.recipe?.name,
        serving_size: meal.recipe?.serving_size || 1,
        // Ensure nutrition_info has proper prototype chain
        nutrition_info: meal.recipe?.nutrition_info ? { ...meal.recipe.nutrition_info } : null,
        storage_links: {
          thumbnail: meal.recipe?.storage_links?.thumbnail || ''
        }
      }
    };
    console.log('[mealLoggingStore] Adding minimal meal:', minimal);
    unsavedMealList.value.push(minimal);
    console.log('[mealLoggingStore] Updated unsavedMealList:', unsavedMealList.value);
  }

  function removeMeal(index) {
    unsavedMealList.value.splice(index, 1);
  }

  function clearUnsavedList() {
    unsavedMealList.value = [];
  }

  function setMealDate(dateIso) {
    mealDate.value = dateIso;
  }

  // Backend interactions ----------------------------------------------------
  const { $axios } = useNuxtApp();

  async function fetchMealsForDate(dateIso) {
    // Placeholder – to be fully implemented in TASK-009/010.
    try {
      const token = localStorage.getItem('accessToken');
      const response = await $axios.get(`/meal_logging/date/${dateIso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        // Ensure proper object creation to avoid Pinia hydration issues
        plannedMeals.value  = response.data.planned ? response.data.planned.map(meal => ({ ...meal })) : [];
        consumedMeals.value = response.data.consumed ? response.data.consumed.map(meal => ({ ...meal })) : [];
      }
    } catch (err) {
      console.error('[mealLoggingStore] failed to fetch meals', err);
    }
  }

  /** -------------------------------------------------------------
   *  PERSISTENCE WATCHERS
   * ------------------------------------------------------------*/
  if (process.client) {
    watch(unsavedMealList, (val) => {
      localStorage.setItem('mealList', JSON.stringify(val));
    }, { deep: true });
  }

  watch(mealDate, (val) => {
    mealDateCookie.value = val;
  });

  return {
    /* constants */
    MEAL_STATE,
    /* state */
    unsavedMealList,
    mealDate,
    plannedMeals,
    consumedMeals,

    /* actions */
    addMeal,
    removeMeal,
    clearUnsavedList,
    setMealDate,
    fetchMealsForDate,
  };
}); 