// Meal state constants used throughout the frontend
// IMPORTANT: keep these values in sync with backend if enums are introduced there.
// 2025-06-29

export const MEAL_STATE = Object.freeze({
  UNSAVED: 'unsaved',      // Added to "Stomach" but not yet persisted
  PLANNED: 'planned',      // Persisted in meal plan but not consumed
  CONSUMED: 'consumed',    // Marked as consumed ➜ affects nutrition widget
});

export default MEAL_STATE; 