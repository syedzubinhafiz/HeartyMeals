export const useApi = async (request, method) => {
        let token = localStorage.getItem("accessToken")
        let result = await useLazyFetch(request, {
        baseURL: "http://localhost:3001",
        method: method,
        headers: {
            ...useRequestURL(),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
	if(result.error.value == null) {
		return result.data.value
	}
	else {
		console.log("API CALL ERROR")
		console.log(result.error)
		return result.error
	}
}
