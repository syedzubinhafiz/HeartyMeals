import { useFluidLoggingStore } from '@/stores/fluidLogging';

export function useFluidLogging () {
  const store = useFluidLoggingStore();
  return {
    maxVolume: store.maxVolume,
    remainingVolume: store.remainingVolume,
    refresh: store.refresh,
    logIntake: store.logIntake,
  };
} 