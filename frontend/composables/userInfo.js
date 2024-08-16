
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
    const { $toast } = useNuxtApp();

    const signup = async (gender,countryID,nyhaLevel,dietaryId,ethnicityId,medicalInfo,foodCategory) => {
        let result = await useApi("/user/signup","POST",{
            gender: gender,
            countryId: countryID,
            nyhaLevel: nyhaLevel,
            dietaryId: dietaryId,
            ethnicityId: ethnicityId,
            medicalInfo: medicalInfo
        })
        if(result.isError) {
            if(process.client) {
                $toast.open({
                    message: `${result?.value?.data?.statusCode} ${result?.value?.data?.error}: ${result?.value?.data?.message}`,
                    type: "error",
                    position: "top",
                    duration: 6000,
                });
            }
            return false
        }
        else if(result.value.message != null) {
            if(process.client) {
                $toast.open({
                    message: `status code 400: ${result.value.message}`,
                    type: "error",
                    position: "top",
                    duration: 6000,
                });
            }
            return false
        }
        else {
            let result2 = {isError: false}
            if(foodCategory!=null) {
                result2 = await useApi("/user_allergy/add","POST",{
                    userId: result.value.user_id,
                    foodCatName: foodCategory
                })
            }
            if(result2.isError) {
                if(process.client) {
                    $toast.open({
                        message: `${result2?.value?.data?.statusCode} ${result2?.value?.data?.error}: ${result2?.value?.data?.message}`,
                        type: "error",
                        position: "top",
                        duration: 6000,
                    });
                }
                return false
            }
            else {
                return true
            }
            
        }
    }


    return {userCookie,getUserInfo,login,logout,signup}
}