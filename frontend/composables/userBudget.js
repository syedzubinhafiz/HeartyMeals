import { useUserBudgetStore } from '@/stores/userBudget';

// Shared composable to load a user's daily nutrition budget and transform it
// into the three-slot array format expected by Nutrition widgets.
// Usage:
//   const { nutrients, refresh } = useUserBudget();
//   await refresh();
//
// `nutrients` is a reactive array of length 3:
//   [0] – daily budget           (max allowed)
//   [1] – consumed nutrients     (eaten so far)
//   [2] – remaining nutrients    (still available)
export function useUserBudget () {
  const store = useUserBudgetStore();
  return {
    // reactive array of length 3 [daily, consumed, remaining]
    nutrients: store.nutrients,
    // action to load/update state
    refresh: store.refresh
  };
} 