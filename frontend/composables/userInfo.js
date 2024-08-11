
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

    const quickLogin = async () => {
        userCookie.value = {email:"urist@gmail.com",token:"asokdsaodjsaiojdoiadiasjasjdoiadjsdaidjeq8jewqjf"}
        userInfo.value = {
            "user_id": "51afc137-6a47-408b-aada-cffe7a9d7a45",
            "first_name": "Urist",
            "last_name": "McUser",
            "email": "urist@gmail.com",
            "gender": "Female",
            "nyha_level": null,
            "medical_info": {},
            "user_role": "Admin",
            "createdAt": "2024-08-09T06:33:04.524Z",
            "updatedAt": "2024-08-09T06:33:04.524Z",
            "deletedAt": null,
            "country": null,
            "dietary": null
        }
    }
    return {userCookie,getUserInfo,login,logout,quickLogin}
}