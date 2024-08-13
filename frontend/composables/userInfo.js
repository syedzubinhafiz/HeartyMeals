
export const useUserInfo = () => {
    const userCookie = useCookie("session");
    const userInfo = useState("user", () => userCookie.value ?? null);
    const getUserInfo = () => {
        return userInfo._object.$suser
    }
    const login = async (email) => {
        let token = await getToken(email)
        if(token!=null) {
            userCookie.value = {email:email,token:token}
            userInfo.value = await useApi("/user/verify","GET",token=token)
            return true
        }
        else {
            return false
        }
 
    }
    const logout = () => {
        userCookie.value = null
        userInfo.value = null
    }
    const signup = () => {
        useApi("/user/signup","POST")
    }


    return {userCookie,getUserInfo,login,logout,signup}
}