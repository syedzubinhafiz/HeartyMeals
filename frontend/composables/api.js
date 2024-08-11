export const useApi = async (request, method, token) => {
	token = token ?? await getToken(useUserInfo().userCookie.value?.email)
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

export const getToken = async (username) => {
	let result = await useLazyFetch("/token", {
        baseURL: "https://accounts.greensheart.com/realms/greensheart/protocol/openid-connect",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: "greensheart",
            client_secret: "cPgL1rezoYUXh9zbaMA1EENEDPt7XBnt",
            grant_type: "password",
            username: username,
            password: "123456"
        }).toString()
    });
	if(result.data.value!=null) {
		return result.data.value.access_token
	}
	else {
		console.log("TOKEN RETRIEVAL ERROR")
		console.log(result.error)
		return null
	}
}