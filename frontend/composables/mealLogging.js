import { useMealLoggingStore } from '@/stores/mealLogging';

export const useMealLogging = () => {
  const store = useMealLoggingStore();
  return {
    unsavedMealList: store.unsavedMealList,
    mealDate: store.mealDate,
    // Expose extra helpers for future tasks
    addMeal: store.addMeal,
    removeMeal: store.removeMeal,
    clearUnsavedList: store.clearUnsavedList,
    setMealDate: store.setMealDate,
    plannedMeals: store.plannedMeals,
    consumedMeals: store.consumedMeals,
    fetchMealsForDate: store.fetchMealsForDate,
  };
}