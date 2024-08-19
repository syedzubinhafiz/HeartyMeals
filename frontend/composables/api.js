export const useApi = async (request, method,body=null) => {
    let token = getItem("accessToken")
    let result = await useLazyFetch(request, {
        baseURL: "http://localhost:3001",
        method: method,
        body: method === "POST" ? JSON.stringify(body) : null,
        headers: {
            ...useRequestURL(),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

  if(result.error.value == null) {
    result.data.isError = false
		return result.data
	}
	else {
    result.error.isError = true
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
