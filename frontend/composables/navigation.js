// Navigation utility to handle edge cases and timing issues
export const useNavigation = () => {
  const loading = ref(false);
  const error = ref(null);

  const safeNavigate = async (path, options = {}) => {
    if (loading.value) {
      console.warn('Navigation already in progress, ignoring duplicate request');
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log('Starting navigation to:', path);

      // Client-side specific handling
      if (import.meta.client) {
        // Small delay to ensure DOM is stable
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Check if we're already on the target path
        const currentPath = window.location.pathname;
        if (currentPath === path) {
          console.log('Already on target path, skipping navigation');
          return true;
        }
      }

      // Attempt navigation with specific options
      await navigateTo(path, {
        replace: false,
        external: false,
        ...options
      });

      console.log('Navigation completed successfully to:', path);
      return true;

    } catch (navigationError) {
      console.error('Navigation failed:', navigationError);
      error.value = navigationError;

      // Fallback strategies
      if (import.meta.client && typeof window !== 'undefined') {
        try {
          console.log('Attempting window.location fallback');
          window.location.href = path;
          return true;
        } catch (fallbackError) {
          console.error('Fallback navigation also failed:', fallbackError);
          error.value = fallbackError;
        }
      }

      return false;

    } finally {
      // Reset loading state after a delay to prevent rapid consecutive calls
      setTimeout(() => {
        loading.value = false;
      }, 100);
    }
  };

  return {
    safeNavigate,
    loading: readonly(loading),
    error: readonly(error)
  };
}; 