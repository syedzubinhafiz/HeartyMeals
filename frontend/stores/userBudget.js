import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useNuxtApp } from '#app';

export const useUserBudgetStore = defineStore('userBudget', () => {
  // Initialise with zeros so child components render without errors
  const emptySlot = () => ({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0
  });

  // Reactive state: [dailyBudget, consumed, remaining]
  const nutrients = ref([emptySlot(), emptySlot(), emptySlot()]);

  const { $axios } = useNuxtApp();
  const toast = useToast();

  // Utility to format Date → YYYY-MM-DD
  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Action: fetch and compute nutrition slots for a given date (defaults to today)
  async function refresh(date = new Date()) {
    try {
      const dateStr = formatDate(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const token = localStorage.getItem('accessToken');

      const response = await $axios.get(`/user/budget?startDate=${dateStr}&timeZone=${timeZone}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        console.error('[userBudgetStore] Unexpected response', response);
        toast.error('Failed to load user budget');
        return;
      }

      const userNutrition = response.data[dateStr];
      if (!userNutrition) {
        console.warn('[userBudgetStore] No nutrition payload for date', dateStr);
        console.warn('Available dates in response:', Object.keys(response.data));
        return;
      }

      const dailyBudget = userNutrition[0];
      const remainingNutrients = userNutrition[1];

      // Calculate consumed nutrients = daily – remaining (ensure non-negative)
      const consumed = {
        calories: Math.max(0, dailyBudget.calories - remainingNutrients.calories),
        carbs: Math.max(0, dailyBudget.carbs - remainingNutrients.carbs),
        protein: Math.max(0, dailyBudget.protein - remainingNutrients.protein),
        fat: Math.max(0, dailyBudget.fat - remainingNutrients.fat),
        sodium: Math.max(0, dailyBudget.sodium - remainingNutrients.sodium),
        cholesterol: Math.max(0, dailyBudget.cholesterol - remainingNutrients.cholesterol),
      };

      // Ensure proper object creation to avoid Pinia hydration issues
      nutrients.value[0] = { ...dailyBudget };
      nutrients.value[1] = { ...consumed };
      nutrients.value[2] = {
        calories: Math.max(0, remainingNutrients.calories),
        carbs: Math.max(0, remainingNutrients.carbs),
        protein: Math.max(0, remainingNutrients.protein),
        fat: Math.max(0, remainingNutrients.fat),
        sodium: Math.max(0, remainingNutrients.sodium),
        cholesterol: Math.max(0, remainingNutrients.cholesterol),
      };
    } catch (err) {
      console.error('[userBudgetStore] Error loading budget', err);
      toast.error('Failed to load user budget');
    }
  }

  return {
    nutrients,
    refresh,
  };
}); 