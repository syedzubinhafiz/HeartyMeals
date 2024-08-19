export default defineNuxtRouteMiddleware(async (to, form) => {

    if(!import.meta.client){
        return;
    };

    const { $oauth4webapiUserInfo } = useNuxtApp();
    
    try{
        localStorage.userInfo =  JSON.stringify(
            await $oauth4webapiUserInfo(localStorage.accessToken),
        );
    } catch(error) {
        // an error most of the time means the access token is expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("claims");

        const {$oauth4webapiAuthorizationUrl} = useNuxtApp();

        const url =  new URL(to.fullPath, window.location.origin);
        if (url.pathname === "/sign-in") {
            url.pathname = "/dashboard";
        }

        const {authorizationUrl, codeVerifier} = await $oauth4webapiAuthorizationUrl(url);

        sessionStorage.codeVerifier =  codeVerifier;

        return navigateTo(authorizationUrl.href, {
            external: true,
        });
    };
});