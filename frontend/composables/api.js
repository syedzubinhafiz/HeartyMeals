export const useApi = (request, options) => {
	return useLazyFetch(request, {
		baseURL: "http://localhost:3420",
		server: false,
		retry: 0, 
		headers: {
            ...useRequestURL()
		},
		...options,
	});
};