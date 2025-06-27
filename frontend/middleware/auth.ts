export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (!import.meta.client) {
        return;
    }

    const { $axios } = useNuxtApp() as any;
    
    try {
        // Check if user has a valid JWT token
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            // No token, redirect to sign-in
            return navigateTo('/sign-in');
        }

        // Verify the token by calling the backend
        const response = await $axios.get('/auth/me');
        
        if (response.data) {
            // Token is valid, store user info
            localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            throw new Error('Invalid token response');
        }
        
    } catch (error: any) {
        // Token is invalid or expired, clear storage and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        console.log('Authentication failed:', error.message);
        
        // Redirect to sign-in page
        return navigateTo('/sign-in');
    }
});