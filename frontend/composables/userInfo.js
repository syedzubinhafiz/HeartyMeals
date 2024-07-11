// export const useAuth = () => {
// 	const ONE_DAY = 1 * 24 * 60 * 60;
// 	const ONE_WEEK = 7 * 24 * 60 * 60;
// 	const config = useRuntimeConfig();
// 	const { $i18n } = useNuxtApp();
// 	const { origin, protocol } = useRequestURL();
// 	const userCookie = useCookie("_session", {
// 		maxAge: ONE_DAY,
// 		sameSite: "strict",
// 		secure: protocol.includes("https") === true,
// 		decode: (e) => {
// 			return e ? JSON.parse(atob(e)) : null;
// 		},
// 		encode: (e) => {
// 			return e ? btoa(JSON.stringify(e)) : null;
// 		},
// 	});

// 	const userRememberMe = useCookie("_remember", {
// 		maxAge: ONE_DAY,
// 		sameSite: "strict",
// 		secure: protocol.includes("https") === true,
// 		decode: (e) => {
// 			return e ? JSON.parse(atob(e)) : null;
// 		},
// 		encode: (e) => {
// 			return e ? btoa(JSON.stringify(e)) : null;
// 		},
// 	});

// 	const userState = useState("user", () => userCookie.value ?? null);
// 	const isAuthentication = useState("authentication", () => false);

// 	const setCookie = (value) => {
// 		userCookie.value = value;
// 	};

// 	const setUserState = (value) => {
// 		userState.value = value;
// 	};

// 	const setRememberMe = (value) => {
// 		userRememberMe.value = { email: value.email };
// 	};

// 	const login = async (email, password, tenant, remember) => {
// 		const { user, role, accessToken, refreshToken } = await $fetch(`/user/login`, {
// 			baseURL: `${origin}/api`,
// 			headers: {
// 				"x-nubitel-language": $i18n.locale.value,
// 				"x-nubitel-tenant": tenant,
// 			},
// 			method: "POST",
// 			body: {
// 				email,
// 				password,
// 			},
// 		});

// 		isAuthentication.value = true;
// 		userState.value = { ...user, role, tenant, accessToken, refreshToken };
// 		if (remember.value) {
// 			setRememberMe({
// 				email,
// 			});
// 		}

// 		setCookie({ ...user, role, tenant, accessToken, refreshToken });
// 	};

// 	const logout = async () => {
// 		const data = await $fetch(`/user/logout`, {
// 			baseURL: `${origin}/api`,
// 			headers: {
// 				"x-nubitel-language": $i18n.locale.value,
// 				...(userCookie && {
// 					"x-nubitel-tenant": userCookie.value.tenant,
// 					Authorization: `Bearer ${userCookie.value.accessToken}`,
// 				}),
// 			},
// 			body: {
// 				id: userCookie.value.id,
// 			},
// 			method: "POST",
// 		});
// 		isAuthentication.value = false;
// 		userState.value = null;
// 		setCookie(null);
// 	};

// 	const forgotPassword = async (email) => {
// 		const data = await $fetch(`/user/forgot-password`, {
// 			baseURL: `${origin}/api`,
// 			body: {
// 				email: email,
// 			},
// 			method: "POST",
// 			headers: {
// 				"x-nubitel-language": $i18n.locale.value,
// 				"x-nubitel-tenant": "",
// 			},
// 		});
// 		return data;
// 	};

// 	return {
// 		forgotPassword,
// 		login,
// 		logout,
// 		user: userState.value,
// 		setCookie,
// 		setUserState,
// 		isAuthentication,
// 		setRememberMe,
// 		getRememberMe: userRememberMe.value,
// 	};
// };
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