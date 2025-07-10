import { useNuxtApp } from '#app';
import { useMealLoggingStore } from '@/stores/mealLogging.js';
import { useToast } from 'vue-toast-notification';

/**
 * Composable that provides a single `saveUnsavedMeals` method.
 * It transparently decides whether the save should update the Meal Log
 * or the Meal Plan based on the provided `mealInfo` object.
 *
 * @example
 * const { saveUnsavedMeals } = usePersistMeals();
 * await saveUnsavedMeals(mealInfo);
 */
export default function usePersistMeals () {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  /**
   * Persists the current unsaved meal list ("Stomach") to the backend.
   *
   * @param {Object} mealInfo – expects at least `{ logDate, mealType, logType }`.
   * @returns {Boolean} true if the request succeeds, false otherwise.
   */
  async function saveUnsavedMeals (mealInfo) {
    // Get fresh store instance to ensure proper reactivity
    const mealStore = useMealLoggingStore();
    
    // Try both ways to access the data
    const mealsWithValue = mealStore.unsavedMealList?.value;
    const mealsWithoutValue = mealStore.unsavedMealList;
    
    console.log('[persistMeals] Fresh mealStore:', mealStore);
    console.log('[persistMeals] mealStore.unsavedMealList:', mealStore.unsavedMealList);
    console.log('[persistMeals] mealsWithValue (.value):', mealsWithValue);
    console.log('[persistMeals] mealsWithoutValue (direct):', mealsWithoutValue);
    console.log('[persistMeals] mealsWithValue type:', typeof mealsWithValue);
    console.log('[persistMeals] mealsWithoutValue type:', typeof mealsWithoutValue);
    console.log('[persistMeals] mealsWithValue length:', mealsWithValue?.length);
    console.log('[persistMeals] mealsWithoutValue length:', mealsWithoutValue?.length);
    
    // Use whichever one has the actual data
    const meals = mealsWithValue || mealsWithoutValue;
    
    if (!meals || !Array.isArray(meals) || !meals.length) {
      toast.error('No meals to save');
      return false;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Authentication token missing');
      return false;
    }

    // Transform to backend-expected format
    const recipeIdPortions = meals.map(m => ({
      recipeId: m.id,
      portion: m.portion,
    }));

    try {
      // TASK-009: Always save meals as planned first, requiring manual consumption confirmation
      const response = await $axios.post('/meal-log-summary/add', {
        mealDate: mealInfo.logDate,
        userLocalDateTime: new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recipeIdPortions,
        mealType: mealInfo.mealType,
        // If the flow is "planning" we create planned meals; otherwise they are immediately logged as consumed
        isMealPlanning: mealInfo?.logType === 'planning',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if ([200, 201, 204].includes(response.status)) {
        toast.success('Meals saved successfully');
        mealStore.clearUnsavedList();
        return true;
      }

      toast.error(response.data?.message || 'Failed to save meals');
      return false;
    } catch (error) {
      /* eslint-disable no-console */
      console.error('[usePersistMeals] save failed', error);
      /* eslint-enable no-console */
      toast.error(error.response?.data?.message || 'Failed to save meals');
      return false;
    }
  }

  return { saveUnsavedMeals };
} 