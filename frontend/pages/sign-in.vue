<template>
  <div class="flex flex-row min-h-screen relative">
    <div class="w-2/5 bg-custom-bg-green flex items-center justify-center">
      <img src="../assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal">
    </div>
    <div class="w-3/5 relative flex items-center justify-center bg-custom-bg-beige">
      <img src="../assets/img/GreenCurve.png" class="absolute left-0 h-full object-cover" alt="Green Curve Decor">
      <img src="../assets/img/brownBlob.svg" class="absolute bottom-0 right-0 w-80 h-80" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
      <div class="relative z-10 w-full max-w-md px-8">
        <div class="space-y-5 m-9 z-10 container">
          <H1>Sign in to your account</H1>
          <H2>Welcome back 👋</H2>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <Input 
                v-model="loginForm.email" 
                type="email" 
                id="email"
                placeholder="Enter your email"
                required
                class="mt-1"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <Input 
                v-model="loginForm.password" 
                type="password" 
                id="password"
                placeholder="Enter your password"
                required
                class="mt-1"
              />
            </div>
            
            <div class="flex justify-center space-x-4">
              <ButtonOrange type="submit" :disabled="loading">
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </ButtonOrange>
            </div>
          </form>
          
          <div class="text-center">
            <P style="margin-bottom: 10px;">Don't have an account?</P>
            <button @click="async () => await navigateTo('/register')" class="link-button">
              Sign up here
            </button>
          </div>
          
          <div v-if="errorMessage" class="text-red-600 text-center">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "SignInPage",
});

definePageMeta({
  layout: "emptylayout"
});

const { $axios } = useNuxtApp();
const { $toast } = useNuxtApp();

const loginForm = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $axios.post('/auth/login', {
      email: loginForm.value.email,
      password: loginForm.value.password
    });
    
    if (response.data.access_token) {
      // Store the JWT token
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      $toast.success('Login successful!');
      
      // Check user role and redirect accordingly
      if (response.data.user.user_role === 'Admin') {
        await navigateTo('/admin');
      } else {
        // Note: Dietitians currently redirect to home until TASK-004 is implemented
        await navigateTo('/home');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
    $toast.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  width: fit-content;
  background-color: #F3EADA;
  padding: 2.5%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  max-width: 400px;
}

.link-button {
  background-color: #015B59;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.link-button:hover {
  background-color: #3a7b70;
}
</style>
  