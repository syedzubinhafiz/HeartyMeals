export default defineNuxtRouteMiddleware((to, from) => {
    const sessionCookie = useCookie("session")
    if(!sessionCookie.value) {
        return navigateTo("/login");
    }
    
})