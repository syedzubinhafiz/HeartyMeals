
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

    const signup = async (age,height,weight,gender,countryID,nyhaLevel,dietaryId,ethnicityId,medicalInfo,foodCategory) => {
        // main user call
        console.log(age)
        let result = await useApi("/user/signup","POST",{
            age: age,
            height: height,
            weight: weight,            
            gender: gender,
            countryId: countryID,
            nyhaLevel: nyhaLevel,
            dietaryId: dietaryId,
            ethnicityId: ethnicityId,
            medicalInfo: medicalInfo,
            "userNutritionSetting": {
                "carbsPercentage": 0.4, //range from 0 to 1
                "proteinPercentage": 0.4, //range from 0 to 1
                "fatPercentage": 0.2, //range from 0 to 1
                "cholesterolLevel": "High",
                "activityLevel": 3
            }
        })
        // if an error occurs, show a toast and exit
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
        // if a non-error error message occurs, show a toast and exit (eg for the user already existing the API technically doesn't return an error)
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
        // if the result is valid, continue
        else {
            // allergy is optional (avoids a bug where if allergy creation fails, the user can't sign up as the user has already been created)
            let result2 = {isError: false}
            if(foodCategory!=null) {
                result2 = await useApi("/user_allergy/add","POST",{
                    userId: result.value.user_id,
                    foodCatName: foodCategory
                })
            }
            // show a toast and exit if there's an error
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
            // otherwise return true and finish the signup process
            else {
                return true
            }
            
        }
    }


    return {userCookie,getUserInfo,login,logout,signup}
}