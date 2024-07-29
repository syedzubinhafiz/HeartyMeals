
export const useUserInfo = () => {
    const userCookie = useCookie("session", {
		maxAge: 1 * 24 * 60 * 60,
		decode: (e) => {
			return e ? JSON.parse(atob(e)) : null;
		},
		encode: (e) => {
			return e ? btoa(JSON.stringify(e)) : null;
		},
	});
    const userInfo = useState("user", () => userCookie.value ?? null);
    const getUserInfo = () => {
        return userInfo._object.$suser
    }
    const login = (email) => {
        let userData = retrieveUserInfo(email)
        if(userData!=null) {
            userInfo.value = userData
            userCookie.value = userData
            return true
        }
        else {
            return false
        }
 
    }
    const logout = () => {
        userCookie.value = null
    }
    const retrieveUserInfo = (email) => {
        // tempoaray code for now; replace with call into backend
        if(email=="bob@gmail.com") {
            return {email: "bob@gmail.com"}
        }
        else if(email=="kate@gmail.com") {
            return {email: "kate@gmail.com"}
        }
        else {
            return null
        }
    }
    return {getUserInfo,login,logout}
}