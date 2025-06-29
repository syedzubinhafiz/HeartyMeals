import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';

export const useFluidLoggingStore = defineStore('fluidLogging', () => {
  /* --------------------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------------------*/
  const maxVolume = ref(0);        // daily water budget (ml)
  const remainingVolume = ref(0);  // ml still to drink

  /* --------------------------------------------------------------------------
   * INTERNALS
   * ------------------------------------------------------------------------*/
  const { $axios } = useNuxtApp();
  const toast = useToast();

  // Helper: date-time string in ISO without timezone offset (backend expects)
  function nowIso () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Convert arbitrary units to millilitres (ml)
  function toMl (value, unit) {
    switch (unit) {
      case 'l':      return value * 1000;
      case 'fl oz':  return value * 29.5735;
      case 'gal':    return value * 3785.41;
      case 'pt':     return value * 473.176;
      case 'qt':     return value * 946.353;
      case 'ct':     return value * 240;     // cup (approx)
      default:       return value;           // already ml
    }
  }

  /* --------------------------------------------------------------------------
   * ACTIONS
   * ------------------------------------------------------------------------*/
  async function refresh () {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const token = localStorage.getItem('accessToken');
      const response = await $axios.get(`/fluid-logging/get?dateTime=${nowIso()}&timeZone=${timeZone}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const history = response.data.logging_history;
        if (history && history.length) {
          maxVolume.value = history[0].remaining_fluid;
          remainingVolume.value = parseFloat(history[history.length - 1].remaining_fluid.toFixed(2));
        }
      }
    } catch (err) {
      console.error('[fluidLoggingStore] refresh failed', err);
      toast.error('Failed to load fluid intake data');
    }
  }

  async function logIntake (value, unit) {
    try {
      if (value <= 0) {
        toast.error('Please enter a positive amount');
        return;
      }
      const intakeValueInMl = toMl(value, unit);
      const token = localStorage.getItem('accessToken');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        waterIntake: value,
        fluidUnit: unit,
        loggingDateTime: nowIso(),
        timeZone,
      };
      const response = await $axios.post('/fluid-logging/update', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201 || response.status === 200) {
        toast.success('Water intake logged');
        await refresh(); // update local state
      } else {
        toast.error('Failed to log intake');
      }
    } catch (err) {
      console.error('[fluidLoggingStore] logIntake failed', err);
      toast.error('Failed to log intake');
    }
  }

  return {
    maxVolume,
    remainingVolume,
    refresh,
    logIntake,
  };
}); 