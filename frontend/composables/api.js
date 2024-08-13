export const useApi = async (request, method) => {
        let token = getItem("accessToken")
        console.log(token)
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

function getItem(item) {
    if (process.client) {
      return localStorage.getItem(item)
    } else {
      return undefined
    }
  }
  
