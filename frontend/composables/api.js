import { $fetch } from 'ofetch';

export const useApi = async (request, method = "GET", body = null) => {
  // Get access token if it exists
  const token = process.client ? localStorage.getItem("accessToken") : null;
  const config = useRuntimeConfig();

  try {
    const result = await $fetch(request, {
      baseURL: config.public.apiBaseUrl,
      method,
      body: method !== "GET" ? body : undefined,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" },
    });

    return { isError: false, value: result };
  } catch (error) {
    return { isError: true, error };
  }
};
