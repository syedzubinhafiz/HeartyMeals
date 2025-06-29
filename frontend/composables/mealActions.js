import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';
import { useDate } from '@/composables/date.js';

/**
 * Unified meal action handlers composable
 * Provides consistent behavior for meal consumption, editing, and removal across all components
 */
export function useMealActions() {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  /**
   * Marks a meal as consumed
   * @param {Object} meal - The meal object containing id and other details
   * @param {Function} onSuccess - Callback function to execute on successful consumption
   * @returns {Boolean} - Success status
   */
  async function consumeMeal(meal, onSuccess) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing');
        return false;
      }

      const response = await $axios.post('/meal-logging/mark_consume', {
        mealLoggingId: meal.id,
        dateTime: useDate().getFormattedDateLong(),
        timeZone: 'Asia/Kuala_Lumpur',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && !response.data?.isError) {
        toast.success('Meal marked as consumed', {
          duration: 3000,
          position: 'top-right'
        });
        
        // Execute callback for component-specific actions
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(meal.id);
        }
        
        return true;
      }

      toast.error('Failed to mark meal as consumed');
      return false;
    } catch (error) {
      console.error('[useMealActions] Consume meal failed:', error);
      toast.error(error.response?.data?.message || 'Failed to mark meal as consumed');
      return false;
    }
  }

  /**
   * Removes a meal from the meal log
   * @param {Object} meal - The meal object containing id and other details
   * @param {Function} onSuccess - Callback function to execute on successful removal
   * @returns {Boolean} - Success status
   */
  async function removeMeal(meal, onSuccess) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing');
        return false;
      }

      const response = await $axios.delete('/meal-logging/delete', {
        data: {
          mealDate: meal.created_at || meal.mealDate,
          mealLoggingId: meal.id,
          mealType: meal.type,
          userLocalDate: useDate().getFormattedDateShort(),
          timeZone: 'Asia/Kuala_Lumpur'
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Meal removed successfully', {
          duration: 3000,
          position: 'top-right'
        });
        
        // Execute callback for component-specific actions
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(meal.id);
        }
        
        return true;
      }

      toast.error('Failed to remove meal');
      return false;
    } catch (error) {
      console.error('[useMealActions] Remove meal failed:', error);
      toast.error(error.response?.data?.message || 'Failed to remove meal');
      return false;
    }
  }

  /**
   * Updates meal details (portion, meal type, etc.)
   * @param {Object} mealUpdate - Object containing meal update details
   * @param {Function} onSuccess - Callback function to execute on successful update
   * @returns {Boolean} - Success status
   */
  async function updateMeal(mealUpdate, onSuccess) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing');
        return false;
      }

      const response = await $axios.post('/meal-logging/update', {
        mealLoggingId: mealUpdate.id,
        mealType: mealUpdate.mealType,
        portion: mealUpdate.portion,
        timeZone: 'Asia/Kuala_Lumpur',
        userLocalDate: useDate().getFormattedDateShort(),
        mealDate: useDate().getFormattedDateShort(new Date(mealUpdate.created_at)),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Meal updated successfully', {
          duration: 3000,
          position: 'top-right'
        });
        
        // Execute callback for component-specific actions
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(mealUpdate);
        }
        
        return true;
      }

      toast.error('Failed to update meal');
      return false;
    } catch (error) {
      console.error('[useMealActions] Update meal failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update meal');
      return false;
    }
  }

  /**
   * Bulk consumption action for multiple meals
   * @param {Array} meals - Array of meal objects to consume
   * @param {Function} onSuccess - Callback function to execute on successful bulk consumption
   * @returns {Boolean} - Success status
   */
  async function bulkConsumeMeals(meals, onSuccess) {
    try {
      let successCount = 0;
      const totalMeals = meals.length;

      for (const meal of meals) {
        const success = await consumeMeal(meal);
        if (success) successCount++;
      }

      if (successCount === totalMeals) {
        toast.success(`All ${totalMeals} meals marked as consumed`, {
          duration: 4000,
          position: 'top-right'
        });
      } else if (successCount > 0) {
        toast.warning(`${successCount}/${totalMeals} meals marked as consumed`, {
          duration: 4000,
          position: 'top-right'
        });
      } else {
        toast.error('Failed to mark any meals as consumed');
      }

      // Execute callback for component-specific actions
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(successCount, totalMeals);
      }

      return successCount === totalMeals;
    } catch (error) {
      console.error('[useMealActions] Bulk consume failed:', error);
      toast.error('Failed to mark meals as consumed');
      return false;
    }
  }

  /**
   * Gets the appropriate status styling for a meal
   * @param {Boolean} isConsumed - Whether the meal is consumed
   * @returns {Object} - Style classes and configuration
   */
  function getMealStatusStyling(isConsumed) {
    return {
      cardClass: isConsumed ? 'consumed' : 'planned',
      badgeClass: isConsumed ? 'consumed-badge' : 'planned-badge',
      textClass: isConsumed ? 'text-green-600' : 'text-orange-600',
      iconClass: isConsumed ? 'fas fa-check-circle' : 'fas fa-clock',
      statusText: isConsumed ? 'Consumed' : 'Planned',
      imageClass: isConsumed ? 'consumed-image' : ''
    };
  }

  return {
    consumeMeal,
    removeMeal,
    updateMeal,
    bulkConsumeMeals,
    getMealStatusStyling
  };
} 